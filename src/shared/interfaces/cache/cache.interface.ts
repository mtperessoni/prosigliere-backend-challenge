export interface ICacheManager {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delByPrefix(key: string): Promise<void>;
  clear(): Promise<void>;
}
