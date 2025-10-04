import { Redis } from 'ioredis';

let redisClient: Redis;

const REDIS_URL = 'redis://localhost:6379';
// const REDIS_URL = process.env.REDIS_URL!;

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      disconnectTimeout:1000
      // Add other options like TLS if needed
    });

    // redisClient.on('error', err => console.error('Redis Client Error:', err));
    // redisClient.on('connect', () => console.log('Connected to Redis'));
  }
  return redisClient;
}

export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient();
    const data = await client.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch (error) {
    console.error(`Error getting from cache (key: ${key}):`, error);
    return null;
  }
}

export async function setToCache(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
  try {
    const client = getRedisClient();
    await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (error) {
    console.error(`Error setting to cache (key: ${key}):`, error);
  }
}

export async function invalidateCache(keyOrPattern: string): Promise<void> {
  try {
    const client = getRedisClient();
    if (keyOrPattern.includes('*')) {
      // Basic pattern matching
      const keys = await client.keys(keyOrPattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } else {
      await client.del(keyOrPattern);
    }
  } catch (error) {
    console.error(`Error invalidating cache (key/pattern: ${keyOrPattern}):`, error);
  }
}
