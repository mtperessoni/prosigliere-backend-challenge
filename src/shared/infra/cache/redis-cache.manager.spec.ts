import { Test, TestingModule } from '@nestjs/testing';
import { RedisCacheManager } from './redis-cache.manager';
import { Redis } from 'ioredis';

const mockRedisMethods = {
  get: jest.fn(),
  set: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
  flushall: jest.fn(),
  smembers: jest.fn(),
  sadd: jest.fn(),
};

jest.mock('ioredis', () => {
  return {
    Redis: jest.fn().mockImplementation(() => mockRedisMethods),
  };
});

describe('RedisCacheManager', () => {
  let cacheManager: RedisCacheManager;
  let mockRedis: typeof mockRedisMethods;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisCacheManager,
        {
          provide: Redis,
          useValue: mockRedisMethods,
        },
      ],
    }).compile();

    cacheManager = module.get<RedisCacheManager>(RedisCacheManager);
    mockRedis = module.get(Redis);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return parsed value when key exists', async () => {
      const testData = { name: 'test', value: 123 };
      mockRedis.get.mockResolvedValue(JSON.stringify(testData));

      const result = await cacheManager.get('test:');

      expect(result).toEqual(testData);
      expect(mockRedis.get).toHaveBeenCalledWith('test:');
    });

    it('should return null when key does not exist', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await cacheManager.get('non-existent-key');

      expect(result).toBeNull();
      expect(mockRedis.get).toHaveBeenCalledWith('non-existent-key');
    });

    it('should return null when JSON parsing fails', async () => {
      mockRedis.get.mockResolvedValue('invalid-json');

      const result = await cacheManager.get('invalid-json-key');

      expect(result).toBeNull();
      expect(mockRedis.get).toHaveBeenCalledWith('invalid-json-key');
    });
  });

  describe('set', () => {
    it('should set value without TTL', async () => {
      const testData = { name: 'test', value: 123 };
      const key = 'test:';

      await cacheManager.set(key, testData);

      expect(mockRedis.set).toHaveBeenCalledWith(key, JSON.stringify(testData));
      expect(mockRedis.sadd).toHaveBeenCalledWith(`keys:test`, key);
    });

    it('should set value with TTL', async () => {
      const testData = { name: 'test', value: 123 };
      const key = 'test:';
      const ttl = 3600;

      await cacheManager.set(key, testData, ttl);

      expect(mockRedis.setex).toHaveBeenCalledWith(key, ttl, JSON.stringify(testData));
      expect(mockRedis.sadd).toHaveBeenCalledWith(`keys:test`, key);
    });
  });

  describe('clear', () => {
    it('should clear all keys', async () => {
      await cacheManager.clear();

      expect(mockRedis.flushall).toHaveBeenCalled();
    });
  });

  describe('delByPrefix', () => {
    it('should delete all keys with given prefix', async () => {
      const prefix = 'test';
      const keys = ['test:key1', 'test:key2'];
      mockRedis.smembers.mockResolvedValue(keys);

      await cacheManager.delByPrefix(prefix);

      expect(mockRedis.smembers).toHaveBeenCalledWith(`keys:${prefix}`);
      expect(mockRedis.del).toHaveBeenCalledWith(...keys);
      expect(mockRedis.del).toHaveBeenCalledWith(`keys:${prefix}`);
    });

    it('should not attempt deletion when no keys found', async () => {
      const prefix = 'empty';
      mockRedis.smembers.mockResolvedValue([]);

      await cacheManager.delByPrefix(prefix);

      expect(mockRedis.smembers).toHaveBeenCalledWith(`keys:${prefix}`);
      expect(mockRedis.del).not.toHaveBeenCalled();
    });
  });
});
