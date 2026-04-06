import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { createNodeWebSocket } from '@hono/node-ws';
import { serveStatic } from '@hono/node-server/serve-static';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createAuthMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errors.js';
import { createRateLimitMiddleware } from './middleware/rate-limit.js';
import { healthRouter } from './routes/health.js';
import { projectsRouter } from './routes/projects.js';
import { reposRouter } from './routes/repos.js';
import { scanRouter } from './routes/scan.js';
import { queryRoutes } from './routes/query.js';
import { graphRoutes } from './routes/graph.js';
import { ingestRoutes } from './routes/ingest.js';
import { eventRoutes } from './routes/events.js';
import { credentialsRouter } from './routes/credentials.js';
import { exportImportRoutes } from './routes/export-import.js';
import { projectLinksRouter } from './routes/project-links.js';
import { analysisRoutes } from './routes/analysis.js';
import { archRulesRouter } from './routes/arch-rules.js';
import { annotationsRouter } from './routes/annotations.js';
import { changelogRoutes } from './routes/changelog.js';
import { documentsRouter } from './routes/documents.js';
import { chatRouter } from './routes/chat.js';
import { contextRoutes } from './routes/context.js';
import { webhookRoutes } from './routes/webhooks.js';
import type { WebSocketHub } from '../ws/hub.js';
import type { NodeWebSocket } from '@hono/node-ws';

interface AppOptions {
  apiKeys: string[];
  hub?: WebSocketHub;
}

export type AppWithWs = Hono & { injectWebSocket: NodeWebSocket['injectWebSocket'] };

export function createApp({ apiKeys, hub }: AppOptions): AppWithWs {
  const app = new Hono();

  app.use('*', logger());
  app.onError(errorHandler);

  // Set up WebSocket support
  const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

  // WebSocket upgrade route at /ws — auth via ?key= query param
  app.get(
    '/ws',
    upgradeWebSocket((c) => {
      const key = c.req.query('key') ?? '';
      if (!apiKeys.includes(key)) {
        return {
          onOpen(_evt, ws) {
            ws.close(1008, 'Unauthorized');
          },
        };
      }

      const clientId = crypto.randomUUID();
      const userId = `user-${apiKeys.indexOf(key) + 1}`;

      return {
        onOpen(_evt, ws) {
          hub?.addClient(clientId, ws, userId);
        },
        onMessage(evt, _ws) {
          try {
            const msg = JSON.parse(String(evt.data)) as Record<string, unknown>;
            if (msg.type === 'subscribe' && typeof msg.projectId === 'string') {
              hub?.subscribe(clientId, msg.projectId);
            } else if (
              msg.type === 'unsubscribe' &&
              typeof msg.projectId === 'string'
            ) {
              hub?.unsubscribe(clientId, msg.projectId);
            }
          } catch {
            // Ignore malformed messages
          }
        },
        onClose(_evt, _ws) {
          hub?.removeClient(clientId);
        },
      };
    }),
  );

  // Webhook routes — mounted BEFORE /api auth middleware (called by external services)
  app.route('/webhooks', webhookRoutes);

  // /api sub-router with auth + rate-limit
  const api = new Hono();
  api.use('*', createAuthMiddleware(apiKeys));
  api.use('*', createRateLimitMiddleware());

  api.route('/', healthRouter);
  api.route('/', projectsRouter);
  api.route('/', reposRouter);
  api.route('/', scanRouter);
  api.route('/', queryRoutes);
  api.route('/', graphRoutes);
  api.route('/', ingestRoutes);
  api.route('/', eventRoutes);
  api.route('/', credentialsRouter);
  api.route('/', exportImportRoutes);
  api.route('/', projectLinksRouter);
  api.route('/', analysisRoutes);
  api.route('/', archRulesRouter);
  api.route('/', annotationsRouter);
  api.route('/', changelogRoutes);
  api.route('/', documentsRouter);
  api.route('/', chatRouter);
  api.route('/', contextRoutes);

  app.route('/api', api);

  // Serve dashboard static files — must come AFTER all /api/* and /ws routes
  // Resolve the dashboard dist directory relative to this file's location at compile time
  const dashboardDist = resolve(import.meta.dirname, '../../../dashboard/dist');

  // Serve hashed asset files (JS/CSS bundles produced by Vite)
  app.use('/assets/*', serveStatic({ root: dashboardDist }));

  // SPA fallback: serve index.html for every non-API, non-asset path
  app.get('*', async (c) => {
    try {
      const html = readFileSync(resolve(dashboardDist, 'index.html'), 'utf-8');
      return c.html(html);
    } catch {
      return c.text(
        'Dashboard not built. Run: pnpm --filter @cortex/dashboard run build',
        404,
      );
    }
  });

  // Attach injectWebSocket to the app object for server.ts to use
  return Object.assign(app, { injectWebSocket });
}
