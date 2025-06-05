import { Module } from '@nestjs/common';
import { RedisCacheManager } from './redis-cache.manager';
import { CACHE_MANAGER } from '@/shared/interfaces/cache/tokens.cache';

@Module({
  providers: [
    {
      provide: CACHE_MANAGER,
      useClass: RedisCacheManager,
    },
  ],
  exports: [CACHE_MANAGER],
})
export class CacheModule {}
