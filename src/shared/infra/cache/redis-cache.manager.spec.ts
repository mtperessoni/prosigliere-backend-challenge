import { Test, TestingModule } from '@nestjs/testing';
import { RedisCacheManager } from './redis-cache.manager';
import { Redis } from 'ioredis';

const mockRedisMethods = {
  get: jest.fn(),
  set: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
  flushall: jest.fn(),
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

      const result = await cacheManager.get('test-key');

      expect(result).toEqual(testData);
      expect(mockRedis.get).toHaveBeenCalledWith('test-key');
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

      await cacheManager.set('test-key', testData);

      expect(mockRedis.set).toHaveBeenCalledWith('test-key', JSON.stringify(testData));
    });

    it('should set value with TTL', async () => {
      const testData = { name: 'test', value: 123 };
      const ttl = 3600;

      await cacheManager.set('test-key', testData, ttl);

      expect(mockRedis.setex).toHaveBeenCalledWith('test-key', ttl, JSON.stringify(testData));
    });
  });

  describe('del', () => {
    it('should delete key', async () => {
      await cacheManager.del('test-key');

      expect(mockRedis.del).toHaveBeenCalledWith('test-key');
    });
  });

  describe('clear', () => {
    it('should clear all keys', async () => {
      await cacheManager.clear();

      expect(mockRedis.flushall).toHaveBeenCalled();
    });
  });
});
