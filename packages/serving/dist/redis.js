import Redis from 'ioredis';
let sharedRedis = null;
export function getRedis() {
    if (!sharedRedis) {
        const url = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
        sharedRedis = new Redis.default(url, { maxRetriesPerRequest: null });
    }
    return sharedRedis;
}
export async function closeRedis() {
    if (sharedRedis) {
        await sharedRedis.quit();
        sharedRedis = null;
    }
}
//# sourceMappingURL=redis.js.map