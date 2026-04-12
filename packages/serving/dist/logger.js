import { createMiddleware } from 'hono/factory';
export function structuredLogger() {
    return createMiddleware(async (c, next) => {
        const requestId = crypto.randomUUID().slice(0, 8);
        const start = performance.now();
        c.set('requestId', requestId);
        c.header('X-Request-Id', requestId);
        await next();
        const duration = Math.round(performance.now() - start);
        const status = c.res.status;
        const method = c.req.method;
        const path = new URL(c.req.url).pathname;
        const log = {
            ts: new Date().toISOString(),
            rid: requestId,
            method,
            path,
            status,
            ms: duration,
        };
        if (status >= 500) {
            console.error(JSON.stringify(log));
        }
        else if (status >= 400) {
            console.warn(JSON.stringify(log));
        }
        else {
            console.log(JSON.stringify(log));
        }
    });
}
//# sourceMappingURL=logger.js.map