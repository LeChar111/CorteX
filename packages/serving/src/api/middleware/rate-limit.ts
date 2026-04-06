import { createMiddleware } from 'hono/factory';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export function createRateLimitMiddleware(
  maxRequests = 100,
  windowMs = 60000,
) {
  const store = new Map<string, RateLimitEntry>();

  return createMiddleware(async (c, next) => {
    const userId = c.get('userId') as string | undefined;
    const key = userId ?? c.req.header('x-forwarded-for') ?? 'anonymous';

    const now = Date.now();
    let entry = store.get(key);

    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      store.set(key, entry);
    }

    entry.count += 1;

    const remaining = Math.max(0, maxRequests - entry.count);
    const resetSeconds = Math.ceil((entry.resetAt - now) / 1000);

    c.header('X-RateLimit-Limit', String(maxRequests));
    c.header('X-RateLimit-Remaining', String(remaining));
    c.header('X-RateLimit-Reset', String(resetSeconds));

    if (entry.count > maxRequests) {
      return c.json({ error: 'Rate limit exceeded' }, 429);
    }

    await next();
  });
}
