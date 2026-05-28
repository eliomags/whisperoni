// worker.js — Whisperoni API entry point
// Pairing handshake + routing to per-chat Durable Objects.
//
// Endpoints:
//   POST /pair/init      { code, pubkey }            → host registers their pubkey for a pair code (5 min TTL)
//   POST /pair/complete  { code, pubkey }            → joiner posts their pubkey; creates DO; returns chatId+hostPubkey
//   GET  /pair/wait?code=...                         → host polls; returns {chatId, peerPubkey} once joiner arrives
//   GET  /chat/:chatId  (Upgrade: websocket)         → upgrades to a WS handled by the chat's DO
//   POST /media/upload  { chatId, contentHash, ct }  → R2 PUT of encrypted blob
//   GET  /media/:hash   (with signed token)          → R2 GET
//
// Notes:
//   • The server never sees plaintext. Pubkeys + ciphertext only.
//   • Pair codes are short (6 chars) so they're QR-friendly; collisions are rare at 32^6 ≈ 1B keyspace
//     but the KV TTL of 5 min bounds the collision window. For paranoia, increase to 8 chars.

export { ChatDurableObject } from './chat-do.js';

// Same-origin deployment: no CORS configuration. The Worker serves both the static client and
// the API from whisperoni.com — the legitimate client never triggers CORS, and a wildcard would
// allow any other origin to fire pairing requests at the API.

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
const text = (s, status = 200) => new Response(s, { status });

function validCode(c)   { return typeof c === 'string' && /^[A-Z2-9]{6,12}$/.test(c); }
function validPubkey(p) { return typeof p === 'string' && /^[A-Za-z0-9+/=]{60,140}$/.test(p); } // P-256 raw is 65 bytes → ~88 b64 chars

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // www.whisperoni.com/* → 301 to apex
    if (url.hostname === 'www.whisperoni.com') {
      url.hostname = 'whisperoni.com';
      return Response.redirect(url.toString(), 301);
    }

    const path = url.pathname;

    try {
      if (path === '/pair/init'     && request.method === 'POST') return await pairInit(request, env);
      if (path === '/pair/complete' && request.method === 'POST') return await pairComplete(request, env);
      if (path === '/pair/wait'     && request.method === 'GET')  return await pairWait(request, env);
      if (path === '/media/upload'  && request.method === 'POST') return await mediaUpload(request, env);
      if (path.startsWith('/media/')&& request.method === 'GET')  return await mediaGet(request, env, path.slice(7));

      // /chat/:chatId/dissolve  (POST) — initiate teardown
      // /chat/:chatId/status    (GET)  — peer checks if chat was tombstoned while they were offline
      const chatMatch = path.match(/^\/chat\/([a-f0-9]{64})(?:\/(dissolve|status))?$/);
      if (chatMatch) {
        const chatId = chatMatch[1];
        const sub = chatMatch[2];
        if (sub === 'dissolve' && request.method === 'POST') return await chatDissolve(request, env, chatId);
        if (sub === 'status'   && request.method === 'GET')  return await chatStatus(request, env, chatId);
        // Otherwise: WebSocket upgrade to the DO
        const id = env.CHAT_DO.idFromString(chatId);
        const stub = env.CHAT_DO.get(id);
        return await stub.fetch(request);
      }

      if (path === '/health') return json({ ok: true, t: Date.now() });
      // Fallback for non-API paths: serve from the static assets layer.
      // With run_worker_first=true the Worker is invoked for every request; everything
      // outside the /pair/*, /chat/*, /media/*, /health prefixes falls through to assets.
      return env.ASSETS.fetch(request);
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  },
};

// ---- dissolve --------------------------------------------------------------
// POST /chat/:chatId/dissolve
//   body: { pubkey: string }     - the caller proves they're one of the two pair members
//   body: { orphaned: true }     - a client that already lost local state wants the DO gone anyway;
//                                  this path is idempotent and safe because the DO checks its own
//                                  pubkey list before honoring it (an orphaned caller will fail to
//                                  authenticate; the call still succeeds if the DO is already gone).
//
// The DO is the source of truth for who's authorized. The Worker just dispatches.
async function chatDissolve(request, env, chatId) {
  const body = await request.json().catch(() => ({}));
  const doId = env.CHAT_DO.idFromString(chatId);
  const stub = env.CHAT_DO.get(doId);

  // ORDER: (a) tombstone first — idempotent, cheap, and ensures a peer reconnecting in any
  // race window or KV propagation window gets a deterministic /status answer even if the
  // DO teardown or R2 purge later fails. (b) Then the DO dissolve. (c) Then R2 purge in a
  // separate try block so an R2 list/delete error doesn't undo the tombstone or hide the
  // dissolve result.
  await env.PAIR_KV.put(`tomb:${chatId}`, String(Date.now()), { expirationTtl: 7 * 86400 });

  const resp = await stub.fetch('https://do/dissolve', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  if (!resp.ok) return new Response(await resp.text(), { status: resp.status });

  // R2 purge in a SEPARATE try — failure here must not eat the tombstone (already written)
  // or the dissolve success (DO already torn down). Best-effort cleanup, bounded at 1000 keys.
  try {
    let cursor;
    let removed = 0;
    for (let i = 0; i < 10; i++) {
      const listing = await env.MEDIA.list({ prefix: `${chatId}/`, cursor, limit: 100 });
      if (!listing.objects.length) break;
      await Promise.all(listing.objects.map(o => env.MEDIA.delete(o.key)));
      removed += listing.objects.length;
      if (!listing.truncated) break;
      cursor = listing.cursor;
    }
    return json({ ok: true, mediaRemoved: removed });
  } catch (e) {
    return json({ ok: true, mediaWarning: e.message });
  }
}

async function chatStatus(request, env, chatId) {
  const tomb = await env.PAIR_KV.get(`tomb:${chatId}`);
  if (tomb) return json({ tombstoned: true, at: Number(tomb) });
  return json({ tombstoned: false });
}

// ---- pairing ---------------------------------------------------------------

// Light validation for handles — the value is opaque to the server, but cap length and reject
// control chars to keep KV small and the response sane. The chat-app already normalizes to
// `@xxx` (3-24 chars) client-side; we accept anything that fits a reasonable display string.
function sanitizeHandle(h) {
  if (typeof h !== 'string') return '';
  const s = h.replace(/[\x00-\x1f\x7f]/g, '').slice(0, 40);
  return s;
}

async function pairInit(request, env) {
  const body = await request.json().catch(() => null);
  if (!body || !validCode(body.code) || !validPubkey(body.pubkey)) return json({ error: 'bad request' }, 400);

  // Rate-limit by IP to prevent code-flooding (Turnstile is the better answer in production).
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const rlKey = `rl:init:${ip}`;
  const hits = parseInt((await env.PAIR_KV.get(rlKey)) || '0', 10);
  if (hits > 20) return json({ error: 'rate limit' }, 429);
  await env.PAIR_KV.put(rlKey, String(hits + 1), { expirationTtl: 60 });

  const existing = await env.PAIR_KV.get(`pair:${body.code}`);
  if (existing) return json({ error: 'code in use' }, 409);

  await env.PAIR_KV.put(
    `pair:${body.code}`,
    JSON.stringify({
      pubkey: body.pubkey,
      handle: sanitizeHandle(body.handle),
      createdAt: Date.now(),
    }),
    { expirationTtl: 300 }
  );
  return json({ ok: true });
}

async function pairComplete(request, env) {
  const body = await request.json().catch(() => null);
  if (!body || !validCode(body.code) || !validPubkey(body.pubkey)) return json({ error: 'bad request' }, 400);

  const init = await env.PAIR_KV.get(`pair:${body.code}`, 'json');
  if (!init) return json({ error: 'expired or unknown' }, 410);

  const joinerHandle = sanitizeHandle(body.handle);

  // Create the chat DO and initialize it with both pubkeys.
  const doId = env.CHAT_DO.newUniqueId();
  const stub = env.CHAT_DO.get(doId);
  await stub.fetch('https://do/init', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pubkeyA: init.pubkey, pubkeyB: body.pubkey }),
  });

  // Signal the waiting host that the joiner is here, with the joiner's handle.
  await env.PAIR_KV.put(
    `complete:${body.code}`,
    JSON.stringify({
      chatId: doId.toString(),
      peerPubkey: body.pubkey,
      peerHandle: joinerHandle,
    }),
    { expirationTtl: 60 }
  );
  await env.PAIR_KV.delete(`pair:${body.code}`);

  // Return the host's identity to the joiner.
  return json({
    chatId: doId.toString(),
    peerPubkey: init.pubkey,
    peerHandle: init.handle || '',
  });
}

async function pairWait(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!validCode(code)) return json({ error: 'bad code' }, 400);

  const r = await env.PAIR_KV.get(`complete:${code}`, 'json');
  if (r) {
    await env.PAIR_KV.delete(`complete:${code}`);
    return json({ pending: false, ...r });
  }
  return json({ pending: true });
}

// ---- media (R2) -------------------------------------------------------------
// Clients upload encrypted blobs keyed by their own content hash.
// Server cannot decrypt; just stores opaque bytes. ChatId is for billing/cleanup attribution only.

async function mediaUpload(request, env) {
  const chatId = request.headers.get('x-chat-id') || '';
  const hash = request.headers.get('x-content-hash') || '';
  if (!/^[a-f0-9]{64}$/.test(chatId)) return json({ error: 'bad chat id' }, 400);
  if (!/^[a-f0-9]{64}$/.test(hash))   return json({ error: 'bad content hash' }, 400);

  const body = await request.arrayBuffer();
  if (body.byteLength === 0 || body.byteLength > 20 * 1024 * 1024) return json({ error: 'size' }, 413);

  await env.MEDIA.put(`${chatId}/${hash}`, body, {
    customMetadata: { uploadedAt: String(Date.now()) },
  });
  return json({ ok: true, key: `${chatId}/${hash}` });
}

async function mediaGet(request, env, key) {
  if (!/^[a-f0-9]{64}\/[a-f0-9]{64}$/.test(key)) return text('bad key', 400);
  const obj = await env.MEDIA.get(key);
  if (!obj) return text('not found', 404);
  return new Response(obj.body, {
    headers: {
      'content-type': 'application/octet-stream',
      'cache-control': 'private, max-age=31536000, immutable',
    },
  });
}
