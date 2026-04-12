import Redis from 'ioredis';

let sharedRedis: InstanceType<typeof Redis.default> | null = null;

export function getRedis(): InstanceType<typeof Redis.default> {
  if (!sharedRedis) {
    const url = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
    sharedRedis = new Redis.default(url, { maxRetriesPerRequest: null });
  }
  return sharedRedis;
}

export async function closeRedis(): Promise<void> {
  if (sharedRedis) {
    await sharedRedis.quit();
    sharedRedis = null;
  }
}
