import { getRedis } from '../../redis.js';
const DEFAULT_TTL = 300; // 5 minutes
const CACHE_PREFIX = 'qcache:';
export function buildCacheKey(query, mode, projectId) {
    const normalized = query.trim().toLowerCase();
    return `${CACHE_PREFIX}${projectId ?? 'all'}:${mode}:${normalized}`;
}
export async function getCached(key) {
    return getRedis().get(key);
}
export async function setCache(key, value, ttlSec = DEFAULT_TTL) {
    await getRedis().setex(key, ttlSec, value);
}
export async function invalidateProjectCache(projectId) {
    const redis = getRedis();
    const pattern = projectId
        ? `${CACHE_PREFIX}${projectId}:*`
        : `${CACHE_PREFIX}*`;
    let deleted = 0;
    let cursor = '0';
    do {
        const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;
        if (keys.length > 0) {
            await redis.del(...keys);
            deleted += keys.length;
        }
    } while (cursor !== '0');
    return deleted;
}
export async function invalidateGraphCache() {
    await getRedis().del('graph:full');
}
//# sourceMappingURL=cache.js.map