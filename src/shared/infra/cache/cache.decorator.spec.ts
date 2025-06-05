import { Cacheable } from './cache.decorator';
import { ICacheManager } from '@/shared/interfaces/cache/cache.interface';

jest.mock('@nestjs/common', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    debug: jest.fn(),
  })),
}));

interface TestClass {
  cacheManager?: ICacheManager;
  testMethod(arg1: string | Record<string, unknown>, arg2: number): Promise<string>;
}

const createTestClass = (cacheManager?: ICacheManager, ttl?: number): TestClass => {
  class TestClassImpl implements TestClass {
    constructor(public cacheManager?: ICacheManager) {}

    @Cacheable('cacheManager', 'test-key', ttl)
    async testMethod(arg1: string | Record<string, unknown>, arg2: number): Promise<string> {
      const result = `result-${JSON.stringify(arg1)}-${arg2}`;
      await Promise.resolve();
      return result;
    }
  }

  return new TestClassImpl(cacheManager);
};

describe('Cacheable Decorator', () => {
  let mockCacheManager: jest.Mocked<ICacheManager>;
  let testClass: TestClass;
  let getSpy: jest.SpyInstance;
  let setSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      delByPrefix: jest.fn(),
      clear: jest.fn(),
    };

    testClass = createTestClass(mockCacheManager);
    getSpy = jest.spyOn(mockCacheManager, 'get');
    setSpy = jest.spyOn(mockCacheManager, 'set');
  });

  it('should return cached value when available', async () => {
    const cachedValue = 'cached-result';
    mockCacheManager.get.mockResolvedValueOnce(cachedValue);

    const result = await testClass.testMethod('test', 123);

    expect(result).toBe(cachedValue);
    expect(getSpy).toHaveBeenCalledWith('test-key:["test",123]');
    expect(setSpy).not.toHaveBeenCalled();
  });

  it('should execute method and cache result when cache miss occurs', async () => {
    mockCacheManager.get.mockResolvedValueOnce(null);

    const result = await testClass.testMethod('test', 123);

    expect(result).toBe('result-"test"-123');
    expect(getSpy).toHaveBeenCalledWith('test-key:["test",123]');
    expect(setSpy).toHaveBeenCalledWith('test-key:["test",123]', 'result-"test"-123', undefined);
  });

  it('should respect TTL when provided', async () => {
    const ttl = 3600;
    const testClassWithTTL = createTestClass(mockCacheManager, ttl);
    mockCacheManager.get.mockResolvedValueOnce(null);

    await testClassWithTTL.testMethod('test', 123);

    expect(setSpy).toHaveBeenCalledWith('test-key:["test",123]', 'result-"test"-123', ttl);
  });

  it('should throw error when cache manager is not found', async () => {
    const testClassWithoutCacheManager = createTestClass();

    await expect(testClassWithoutCacheManager.testMethod('test', 123)).rejects.toThrow(
      'Cache manager not found',
    );
  });

  it('should handle complex arguments in cache key', async () => {
    const complexArg = { nested: { value: 'test' } };
    mockCacheManager.get.mockResolvedValueOnce(null);

    await testClass.testMethod(complexArg, 123);

    expect(getSpy).toHaveBeenCalledWith(`test-key:[{"nested":{"value":"test"}},123]`);
  });
});
