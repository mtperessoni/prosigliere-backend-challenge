import { ICacheManager } from '../../interfaces/cache/cache.interface';
import { Logger } from '@nestjs/common';

export function Cacheable<T extends Record<string, ICacheManager>>(
  cacheManagerKey: keyof T,
  key: string,
  ttl?: number,
) {
  const logger = new Logger('CacheDecorator');

  return function (_: unknown, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value as (...args: unknown[]) => Promise<unknown>;

    descriptor.value = async function (this: T, ...args: unknown[]): Promise<unknown> {
      const cacheManager = this[cacheManagerKey];
      if (!cacheManager) {
        throw new Error('Cache manager not found');
      }

      const cacheKey = `${key}:${JSON.stringify(args)}`;

      const cached = await cacheManager.get<unknown>(cacheKey);

      if (cached) {
        logger.debug(`Cache hit for key: ${cacheKey}`);
        return cached;
      }

      logger.debug(`Cache miss for key: ${cacheKey}`);
      const result: unknown = await originalMethod.apply(this, args);
      await cacheManager.set(cacheKey, result, ttl);
      return result;
    };

    return descriptor;
  };
}
