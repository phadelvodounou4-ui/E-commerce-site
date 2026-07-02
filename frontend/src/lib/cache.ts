const memoryCache = new Map<string, { value: any; expiry: number }>();
export const cache = {
  get<T>(key: string): T | null {
    const mem = memoryCache.get(key);
    if (mem && mem.expiry > Date.now()) return mem.value;
    return null;
  },
  set<T>(key: string, value: T, ttlMinutes = 5): void {
    memoryCache.set(key, { value, expiry: Date.now() + ttlMinutes * 60000 });
  },
  delete(key: string): void { memoryCache.delete(key); },
  clear(): void { memoryCache.clear(); },
};
