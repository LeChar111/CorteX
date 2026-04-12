export declare function buildCacheKey(query: string, mode: string, projectId?: string): string;
export declare function getCached(key: string): Promise<string | null>;
export declare function setCache(key: string, value: string, ttlSec?: number): Promise<void>;
export declare function invalidateProjectCache(projectId?: string): Promise<number>;
export declare function invalidateGraphCache(): Promise<void>;
//# sourceMappingURL=cache.d.ts.map