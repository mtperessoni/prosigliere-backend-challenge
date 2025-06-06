import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ICacheManager } from '@/shared/interfaces/cache/cache.interface';

@Injectable()
export class RedisCacheManager implements ICacheManager {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, stringValue);
    } else {
      await this.redis.set(key, stringValue);
    }
    const prefix = key.split(':')[0];
    await this.redis.sadd(`keys:${prefix}`, key);
  }

  async delByPrefix(prefix: string): Promise<void> {
    const keys = await this.redis.smembers(`keys:${prefix}`);
    console.log(keys);
    if (keys.length) {
      await this.redis.del(...keys);
      await this.redis.del(`keys:${prefix}`);
    }
  }

  async clear(): Promise<void> {
    await this.redis.flushall();
  }
}
