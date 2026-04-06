export declare function createRateLimitMiddleware(maxRequests?: number, windowMs?: number): import("hono").MiddlewareHandler<any, string, {}, Response | (Response & import("hono").TypedResponse<{
    error: string;
}, 429, "json">)>;
//# sourceMappingURL=rate-limit.d.ts.map