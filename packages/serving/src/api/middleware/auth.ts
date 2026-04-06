import { createMiddleware } from 'hono/factory';

export function createAuthMiddleware(validKeys: string[]) {
  return createMiddleware(async (c, next) => {
    // Skip auth for health endpoint
    if (c.req.path === '/api/health') {
      await next();
      return;
    }

    const apiKey = c.req.header('X-API-Key');

    if (!apiKey) {
      return c.json({ error: 'Missing X-API-Key header' }, 401);
    }

    const keyIndex = validKeys.indexOf(apiKey);
    if (keyIndex === -1) {
      return c.json({ error: 'Invalid API key' }, 401);
    }

    c.set('userId', `user-${keyIndex + 1}`);
    await next();
  });
}
