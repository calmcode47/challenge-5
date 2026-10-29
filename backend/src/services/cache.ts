interface CacheEntry<T> {
  readonly expiresAt: number;
  readonly value: T;
}

/** Small bounded TTL cache for repeated, identical planning requests. */
export class TtlCache<T> {
  private readonly values = new Map<string, CacheEntry<T>>();

  public constructor(
    private readonly maxEntries = 100,
    private readonly ttlMs = 300_000,
  ) {}

  public get(key: string): T | undefined {
    const entry = this.values.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.values.delete(key);
      return undefined;
    }
    this.values.delete(key);
    this.values.set(key, entry);
    return entry.value;
  }

  public set(key: string, value: T): void {
    if (this.values.size >= this.maxEntries) {
      const oldestKey = this.values.keys().next().value;
      if (oldestKey) this.values.delete(oldestKey);
    }
    this.values.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  public clear(): void {
    this.values.clear();
  }
}
