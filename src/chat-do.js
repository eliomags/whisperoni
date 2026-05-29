// chat-do.js — one Durable Object per chat.
// Responsibilities:
//   • Hold the two participants' public keys (no plaintext anywhere).
//   • Accept WebSocket connections, identify each as side A or B by pubkey match.
//   • Relay ciphertext between sides in order, assigning a monotonic seq.
//   • Queue messages for whichever side is offline, with bounded retention.
//   • Use the WebSocket Hibernation API: idle sockets cost no wall-time.
//
// Storage layout (in this DO's storage):
//   pubkeyA, pubkeyB        : strings (b64 P-256 raw pubkeys)
//   nextSeq:A, nextSeq:B    : per-direction monotonic counters (the sender's-direction
//                             counter becomes the broadcast seq, so client_seq matches
//                             server_seq for AES-GCM IV correctness)
//   q:A, q:B                : array of { seq, payload, t } awaiting delivery to that side
//   createdAt, lastActiveAt : ms timestamps

const MAX_QUEUE = 1000;        // hard cap per side; older messages drop
const MAX_PAYLOAD = 256 * 1024; // 256KB ciphertext cap; media goes via R2

export class ChatDurableObject {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    // sessionMeta is regenerated after hibernation from the WS attachment.
    // (Hibernation API persists serializable attachments per socket.)
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.endsWith('/init')) {
      const { pubkeyA, pubkeyB } = await request.json();
      if (!pubkeyA || !pubkeyB) return new Response('bad init', { status: 400 });
      // First-write-wins: refuse re-init.
      const existing = await this.state.storage.get('pubkeyA');
      if (existing) return new Response('already initialized', { status: 409 });
      await this.state.storage.put({
        pubkeyA, pubkeyB,
        // Per-direction seq counters so the DO's broadcast seq matches the sender's
        // client-side ++conn.sendCounter. A shared nextSeq breaks AES-GCM decryption on
        // any round-trip after the second send-direction switch (the IV used to encrypt
        // would not match the IV used to decrypt).
        'nextSeq:A': 0,
        'nextSeq:B': 0,
        'q:A': [], 'q:B': [],
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
      });
      return new Response('ok');
    }

    // HTTP dissolve: caller proves they're one of the two pair members (or claims orphan cleanup).
    // Either way, the result is the same: the DO destroys itself. We still authorize so a random
    // ID guesser can't dissolve a stranger's chat — orphan callers will fail authentication and
    // get a 403 *unless* the DO is already gone (in which case we return idempotent 200 from the
    // Worker before we even get here).
    if (url.pathname.endsWith('/dissolve')) {
      const body = await request.json().catch(() => ({}));
      const [pubkeyA, pubkeyB] = await Promise.all([
        this.state.storage.get('pubkeyA'),
        this.state.storage.get('pubkeyB'),
      ]);
      if (!pubkeyA) {
        // Already destroyed — idempotent success.
        return new Response(JSON.stringify({ ok: true, alreadyGone: true }), { headers: { 'content-type': 'application/json' } });
      }
      const isAuthorized = body && (body.pubkey === pubkeyA || body.pubkey === pubkeyB);
      if (!isAuthorized) {
        return new Response('forbidden', { status: 403 });
      }
      const initiatorSide = body.pubkey === pubkeyA ? 'A' : 'B';
      await this._teardown(initiatorSide);
      return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
    }

    if (request.headers.get('Upgrade') === 'websocket') {
      const initialized = await this.state.storage.get('pubkeyA');
      if (!initialized) return new Response('not initialized', { status: 404 });
      const pair = new WebSocketPair();
      const [client, server] = [pair[0], pair[1]];
      // Hibernation: accept without keeping a JS handle alive.
      this.state.acceptWebSocket(server);
      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response('not found', { status: 404 });
  }

  // Tear down the chat: notify the other side if connected, then wipe storage and close sockets.
  // The Worker is responsible for R2 cleanup and KV tombstone — this method only handles the DO.
  async _teardown(initiatorSide) {
    const otherSide = initiatorSide === 'A' ? 'B' : 'A';
    // Notify any connected peer immediately. For the offline peer, queue the notification.
    let delivered = false;
    for (const sock of this.state.getWebSockets()) {
      const m = sock.deserializeAttachment();
      if (!m) continue;
      try {
        if (m.side === otherSide) {
          sock.send(JSON.stringify({ type: 'dissolved', by: 'them' }));
          delivered = true;
        }
        // Close all sockets — chat is over.
        sock.close(1000, 'dissolved');
      } catch { /* dead socket */ }
    }
    // If the peer wasn't online, queue a special marker so when they reconnect they get the news.
    // We don't strictly need this because the chatStatus tombstone (in KV) serves the same purpose,
    // and a reconnect to a deleted DO returns 404. Both pathways lead the client to the same state.
    // Nuke storage. SQLite-backed deleteAll is atomic per call but can fail under CPU-time-limit
    // pressure or transient errors. Retry-on-failure is safe because each call is all-or-nothing.
    // NOTE: requires compatibility_date >= 2026-02-24 to also clear alarm metadata; do not pin
    // earlier or dissolved chats will keep billing storage in perpetuity.
    for (let i = 0; i < 5; i++) {
      try { await this.state.storage.deleteAll(); break; }
      catch (e) { if (i === 4) throw e; }
    }
  }

  // ---- WebSocket hibernation callbacks ----

  async webSocketMessage(ws, message) {
    let data;
    try { data = JSON.parse(typeof message === 'string' ? message : new TextDecoder().decode(message)); }
    catch { return ws.close(1003, 'bad json'); }

    const meta = ws.deserializeAttachment() || {};

    if (data.type === 'identify') {
      const [pubkeyA, pubkeyB] = await Promise.all([
        this.state.storage.get('pubkeyA'),
        this.state.storage.get('pubkeyB'),
      ]);
      let side = null;
      if (data.pubkey === pubkeyA) side = 'A';
      else if (data.pubkey === pubkeyB) side = 'B';
      else return ws.close(1008, 'unknown identity');

      ws.serializeAttachment({ side });
      // drain the queue for this side
      const qKey = `q:${side}`;
      const queue = (await this.state.storage.get(qKey)) || [];
      if (queue.length) {
        for (const m of queue) {
          try { ws.send(JSON.stringify({ type: 'message', seq: m.seq, payload: m.payload, t: m.t })); }
          catch { /* dead socket */ }
        }
        await this.state.storage.put(qKey, []);
      }
      ws.send(JSON.stringify({ type: 'ready' }));
      return;
    }

    if (data.type === 'send') {
      if (!meta.side) return ws.close(1008, 'not identified');
      if (typeof data.payload !== 'string' || data.payload.length > MAX_PAYLOAD)
        return ws.send(JSON.stringify({ type: 'error', reason: 'payload too large' }));

      // Per-direction seq: nextSeq:A counts A's sends, nextSeq:B counts B's sends.
      // The broadcast seq becomes the sender's-direction counter, which matches the
      // sender's ++conn.sendCounter on the client. Receiver decrypts with the same seq.
      const seqKey = `nextSeq:${meta.side}`;
      const seq = ((await this.state.storage.get(seqKey)) || 0) + 1;
      const otherSide = meta.side === 'A' ? 'B' : 'A';
      const t = Date.now();

      // Try to deliver to other side's connected sockets.
      let delivered = false;
      for (const sock of this.state.getWebSockets()) {
        const m = sock.deserializeAttachment();
        if (m && m.side === otherSide && sock.readyState === 1 /* OPEN */) {
          try {
            sock.send(JSON.stringify({ type: 'message', seq, payload: data.payload, t }));
            delivered = true;
          } catch { /* will be removed via close */ }
        }
      }

      // Persist per-direction sequence + queue if undelivered.
      const writes = { [seqKey]: seq, lastActiveAt: t };
      if (!delivered) {
        const qKey = `q:${otherSide}`;
        const queue = (await this.state.storage.get(qKey)) || [];
        queue.push({ seq, payload: data.payload, t });
        if (queue.length > MAX_QUEUE) queue.shift();
        writes[qKey] = queue;
      }
      await this.state.storage.put(writes);

      ws.send(JSON.stringify({ type: 'ack', seq }));
      return;
    }

    if (data.type === 'dissolve') {
      // WS-initiated dissolve. Authentication is the identified socket — only the two pair
      // members ever pass the identify check, so reaching this opcode already proves authorization.
      if (!meta.side) return ws.close(1008, 'not identified');
      await this._teardown(meta.side);
      return;
    }

    // Unknown opcode → ignore silently rather than leaking error surface.
  }

  async webSocketClose(ws /*, code, reason, wasClean*/) {
    // Nothing to do; deserializeAttachment is implicitly dropped with the socket.
  }

  async webSocketError(ws /*, error*/) {
    try { ws.close(1011, 'error'); } catch {}
  }

  // Optional: scheduled cleanup of inactive chats (registered via alarm()).
  // Implementer note: an alarm fired every 30 days could check lastActiveAt and self-delete
  // if both queues are empty AND no inbound activity for N days. Out of v1 scope.
}
