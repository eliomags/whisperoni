export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 text-balance">Singles Chat App - Technical Architecture</h1>

        <div className="space-y-8">
          {/* Overview */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Architecture Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              This singles chat application uses a <strong>hybrid architecture</strong> combining cloud storage for
              public data (profiles, posts) with client-side storage for private messaging. Messages are never stored on
              servers - they exist only on sender and recipient devices, ensuring maximum privacy and reducing server
              costs.
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Core Principles</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Privacy First:</strong> Messages stored only on client devices, never on servers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Offline Resilience:</strong> Messages queue on sender device until recipient comes online
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Real-time P2P:</strong> Direct peer-to-peer communication when both users online
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Minimal Server Load:</strong> Servers only handle profiles, posts, and signaling
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Tech Stack</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-primary">Frontend</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Next.js 15</strong> - React framework with App Router
                  </li>
                  <li>
                    <strong>React 19</strong> - UI library
                  </li>
                  <li>
                    <strong>TypeScript</strong> - Type safety
                  </li>
                  <li>
                    <strong>Tailwind CSS v4</strong> - Styling
                  </li>
                  <li>
                    <strong>shadcn/ui</strong> - Component library
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-primary">Backend & Cloud</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Supabase</strong> - PostgreSQL database for profiles & posts
                  </li>
                  <li>
                    <strong>Supabase Auth</strong> - User authentication
                  </li>
                  <li>
                    <strong>Vercel</strong> - Hosting and deployment
                  </li>
                  <li>
                    <strong>Next.js API Routes</strong> - Server endpoints
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-primary">Real-time Communication</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>WebSocket</strong> - Presence detection & signaling
                  </li>
                  <li>
                    <strong>WebRTC Data Channels</strong> - P2P message delivery
                  </li>
                  <li>
                    <strong>STUN/TURN Servers</strong> - NAT traversal
                  </li>
                  <li>
                    <strong>Go or Elixir</strong> - Backend for WebSocket server (high concurrency)
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-primary">Client-Side Storage</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>IndexedDB</strong> - Message & chat history storage
                  </li>
                  <li>
                    <strong>Dexie.js</strong> - IndexedDB wrapper library
                  </li>
                  <li>
                    <strong>LocalStorage</strong> - User preferences & settings
                  </li>
                  <li>
                    <strong>Service Workers</strong> - Background sync & offline support
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Storage Strategy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Data Storage Strategy</h2>

            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-green-700 dark:text-green-400">☁️ Cloud Storage (Supabase)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Public, discoverable data that needs to be accessible across devices
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• User profiles (name, age, gender, orientation, location, bio, photos)</li>
                  <li>• Posts (text content, timestamps, author info)</li>
                  <li>• User authentication data</li>
                  <li>• Media permissions & quarantine status</li>
                </ul>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">
                  💻 Client-Side Storage (IndexedDB)
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Private, ephemeral data that exists only on user devices
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Chat messages (text, audio, video)</li>
                  <li>• Chat metadata (last message, unread count, timestamps)</li>
                  <li>• Outgoing message queue (pending delivery)</li>
                  <li>• Audio/video message blobs</li>
                  <li>• Media permission states per chat</li>
                  <li>• Typing indicators & read receipts</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <strong>Why this split?</strong> Profiles and posts are public discovery mechanisms - they need to be
                searchable and accessible. Messages are private conversations that don't need server persistence. This
                approach maximizes privacy, reduces server costs, and gives users full control over their message data.
              </p>
            </div>
          </section>

          {/* Message Delivery Architecture */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Message Delivery Architecture</h2>

            <div className="space-y-4">
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Scenario 1: Both Users Online</h3>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>User A sends message</li>
                  <li>Message stored in User A's IndexedDB immediately</li>
                  <li>WebSocket signals User B's presence (online)</li>
                  <li>WebRTC data channel established (if not already open)</li>
                  <li>Message transmitted directly P2P to User B</li>
                  <li>User B stores message in their IndexedDB</li>
                  <li>User B sends delivery receipt back to User A</li>
                  <li>User A marks message as delivered</li>
                </ol>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Scenario 2: Recipient Offline</h3>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>User A sends message</li>
                  <li>Message stored in User A's IndexedDB</li>
                  <li>WebSocket detects User B is offline</li>
                  <li>Message added to outgoing queue in User A's IndexedDB</li>
                  <li>Message shows "waiting to send" status</li>
                  <li>When User B comes online, WebSocket notifies User A</li>
                  <li>User A's client automatically sends queued messages via WebRTC</li>
                  <li>User B receives and stores messages</li>
                  <li>Delivery receipts sent back to User A</li>
                </ol>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Audio & Video Messages</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Recorded using Web Audio API / MediaRecorder API</li>
                  <li>• Stored as Blob in sender's IndexedDB</li>
                  <li>• Transmitted via WebRTC data channel (chunked for large files)</li>
                  <li>• Stored as Blob in recipient's IndexedDB</li>
                  <li>• Playback directly from IndexedDB using Blob URLs</li>
                  <li>• No server storage - files exist only on sender & recipient devices</li>
                </ul>
              </div>
            </div>
          </section>

          {/* WebRTC Architecture */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">WebRTC P2P Architecture</h2>

            <div className="bg-card border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">Connection Establishment</h3>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>
                  <strong>Signaling:</strong> WebSocket server exchanges ICE candidates and SDP offers/answers
                </li>
                <li>
                  <strong>STUN:</strong> Discovers public IP addresses for NAT traversal
                </li>
                <li>
                  <strong>TURN:</strong> Relays data if direct P2P connection fails (fallback)
                </li>
                <li>
                  <strong>Data Channel:</strong> Establishes reliable, ordered data channel for messages
                </li>
                <li>
                  <strong>Keep-Alive:</strong> Maintains connection with periodic heartbeat messages
                </li>
              </ol>
            </div>

            <div className="bg-card border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">Message Transmission</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  • <strong>Text Messages:</strong> Sent as JSON over data channel
                </li>
                <li>
                  • <strong>Audio/Video:</strong> Chunked into 16KB packets, reassembled on recipient side
                </li>
                <li>
                  • <strong>Encryption:</strong> DTLS-SRTP provides end-to-end encryption by default
                </li>
                <li>
                  • <strong>Reliability:</strong> Data channels use SCTP for reliable, ordered delivery
                </li>
                <li>
                  • <strong>Compression:</strong> Optional gzip compression for large messages
                </li>
              </ul>
            </div>
          </section>

          {/* Presence System */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Presence & Online Status</h2>

            <div className="bg-card border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold mb-2">WebSocket-Based Presence</h3>
              <ul className="space-y-2 text-sm">
                <li>• Client connects to WebSocket server on app load</li>
                <li>• Server maintains active connections map (userId → socketId)</li>
                <li>• Heartbeat every 30 seconds to detect disconnections</li>
                <li>• Server broadcasts presence changes to relevant users</li>
                <li>• "Last seen" timestamp stored in cloud for offline users</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <div className="font-semibold text-green-700 dark:text-green-400 mb-1">🟢 Online</div>
                <p className="text-xs text-muted-foreground">
                  Active WebSocket connection, can receive messages immediately
                </p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">🟡 Away</div>
                <p className="text-xs text-muted-foreground">Tab inactive for 5+ minutes, connection maintained</p>
              </div>
              <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
                <div className="font-semibold text-gray-700 dark:text-gray-400 mb-1">⚫ Offline</div>
                <p className="text-xs text-muted-foreground">No connection, messages queue on sender side</p>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Security & Privacy</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-primary">Encryption</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>Transport:</strong> DTLS-SRTP for WebRTC data channels
                  </li>
                  <li>
                    • <strong>At Rest:</strong> IndexedDB encrypted by browser
                  </li>
                  <li>
                    • <strong>Cloud Data:</strong> Supabase Row Level Security (RLS)
                  </li>
                  <li>
                    • <strong>Authentication:</strong> JWT tokens with refresh rotation
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-primary">Privacy Features</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Messages never touch servers</li>
                  <li>• No message backups or cloud sync</li>
                  <li>• Media permissions per chat</li>
                  <li>• User quarantine system</li>
                  <li>• Clear chat history (deletes from IndexedDB)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Scalability */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Scalability Considerations</h2>

            <div className="space-y-3">
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Server Load</h3>
                <p className="text-sm text-muted-foreground mb-2">Since messages are P2P, servers only handle:</p>
                <ul className="space-y-1 text-sm">
                  <li>• WebSocket connections for presence (lightweight)</li>
                  <li>• WebRTC signaling (brief, infrequent)</li>
                  <li>• Profile/post CRUD operations (standard REST)</li>
                  <li>• TURN relay as fallback (~5-10% of connections)</li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Client Storage Limits</h3>
                <ul className="space-y-1 text-sm">
                  <li>• IndexedDB: ~50% of available disk space (typically GBs)</li>
                  <li>• Automatic cleanup of old messages (configurable retention)</li>
                  <li>• Audio/video messages compressed before storage</li>
                  <li>• Users can manually clear chat history anytime</li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Horizontal Scaling</h3>
                <ul className="space-y-1 text-sm">
                  <li>• WebSocket servers: Sticky sessions with Redis pub/sub</li>
                  <li>• Supabase: Auto-scaling PostgreSQL</li>
                  <li>• TURN servers: Geographic distribution</li>
                  <li>• CDN: Static assets and profile images</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Trade-offs */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Architectural Trade-offs</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-green-700 dark:text-green-400">✅ Advantages</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>Privacy:</strong> Messages never stored on servers
                  </li>
                  <li>
                    • <strong>Cost:</strong> Minimal server storage & bandwidth
                  </li>
                  <li>
                    • <strong>Speed:</strong> Direct P2P is faster than server relay
                  </li>
                  <li>
                    • <strong>Scalability:</strong> P2P reduces server bottlenecks
                  </li>
                  <li>
                    • <strong>Control:</strong> Users own their message data
                  </li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-red-700 dark:text-red-400">⚠️ Limitations</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>No Multi-Device Sync:</strong> Messages tied to one device
                  </li>
                  <li>
                    • <strong>Offline Delivery:</strong> Requires sender to be online
                  </li>
                  <li>
                    • <strong>Message History:</strong> Limited by client storage
                  </li>
                  <li>
                    • <strong>Backup:</strong> No cloud backup of messages
                  </li>
                  <li>
                    • <strong>Complexity:</strong> WebRTC setup more complex than REST
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Future Enhancements */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Future Enhancements</h2>

            <div className="space-y-3">
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Phase 2: Enhanced Features</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Push notifications via Service Workers</li>
                  <li>• Voice/video calls using WebRTC media streams</li>
                  <li>• Message reactions and replies</li>
                  <li>• Typing indicators in real-time</li>
                  <li>• Read receipts with timestamps</li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Phase 3: Advanced Capabilities</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Optional encrypted cloud backup (user-controlled)</li>
                  <li>• Multi-device sync via encrypted relay</li>
                  <li>• Group chats with mesh P2P topology</li>
                  <li>• Message search with client-side indexing</li>
                  <li>• Progressive Web App (PWA) for mobile</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Inspired By */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Architectural Inspiration</h2>

            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div>
                <h3 className="font-semibold mb-1">WhatsApp (Erlang/Elixir)</h3>
                <p className="text-sm text-muted-foreground">
                  Erlang/Elixir-based concurrency model with lightweight processes, persistent connections, in-memory
                  state management, and focus on reliability inspired our WebSocket presence system. Elixir is a strong
                  candidate for our real-time backend.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Telegram</h3>
                <p className="text-sm text-muted-foreground">
                  MTProto's client-server model, cloud storage for public data, device-specific secret chats, and
                  message queuing influenced our hybrid architecture approach.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Go for High-Concurrency Services</h3>
                <p className="text-sm text-muted-foreground">
                  Go's goroutines, channels, and built-in concurrency primitives make it ideal for handling thousands of
                  WebSocket connections efficiently. Go is an excellent alternative to Elixir for the real-time backend.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">WebRTC Standards</h3>
                <p className="text-sm text-muted-foreground">
                  Direct P2P communication, DTLS encryption, data channels for messaging, and NAT traversal techniques
                  form the foundation of our message delivery.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            This architecture prioritizes privacy, performance, and user control while maintaining scalability and
            cost-effectiveness.
          </p>
        </div>
      </div>
    </div>
  )
}
