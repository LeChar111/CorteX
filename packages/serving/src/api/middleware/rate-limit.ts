import { createMiddleware } from 'hono/factory';
import { getRedis } from '../../redis.js';

export function createRateLimitMiddleware(
  maxRequests = 100,
  windowSec = 60,
) {
  return createMiddleware(async (c, next) => {
    const userId = c.get('userId') as string | undefined;
    const key = `rl:${userId ?? c.req.header('x-forwarded-for') ?? 'anon'}`;

    const redis = getRedis();
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, windowSec);
    }

    const ttl = await redis.ttl(key);
    const remaining = Math.max(0, maxRequests - count);

    c.header('X-RateLimit-Limit', String(maxRequests));
    c.header('X-RateLimit-Remaining', String(remaining));
    c.header('X-RateLimit-Reset', String(ttl > 0 ? ttl : windowSec));

    if (count > maxRequests) {
      return c.json({ error: 'Rate limit exceeded' }, 429);
    }

    await next();
  });
}
