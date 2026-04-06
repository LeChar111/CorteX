import dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: resolve(import.meta.dirname, '../../../.env') });
import { serve } from '@hono/node-server';
import { runMigrations } from '@cortex/db';
import { createApp } from './api/app.js';
import { WebSocketHub } from './ws/hub.js';
import { PgListener } from './ws/pg-listener.js';

const port = Number(process.env['PORT']) || 3100;
const apiKeys = (process.env['API_KEYS'] || 'dev-key-1').split(',').map((k) => k.trim());
const dbUrl = process.env['DATABASE_URL'] ?? 'postgres://localhost/cortex';

// Run pending database migrations before starting
await runMigrations().then(() => {
  console.log('Database migrations applied');
}).catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

// Create WebSocket hub
const hub = new WebSocketHub();

// Create PostgreSQL LISTEN client and wire to hub
const pgListener = new PgListener(dbUrl);
pgListener.onNotify((payload) => hub.broadcast(payload));

// Create Hono app with hub attached
const app = createApp({ apiKeys, hub });

const server = serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Cortex API ready at http://localhost:${info.port}`);
});

// Enable WebSocket upgrades on the HTTP server
app.injectWebSocket(server);

// Start listening for PostgreSQL notifications
pgListener.start().catch((err) => {
  console.error('PgListener failed to start:', err);
});

// Prevent crash on transient errors (e.g. postgres restart)
process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception (suppressed):', err.message);
});
process.on('unhandledRejection', (err) => {
  console.error('[server] Unhandled rejection (suppressed):', err instanceof Error ? err.message : err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  await pgListener.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down...');
  await pgListener.stop();
  process.exit(0);
});
