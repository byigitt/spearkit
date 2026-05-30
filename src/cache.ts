/**
 * Pluggable cache abstraction with TTL, counters and rate-limit primitives.
 *
 * The {@link CacheStore} interface lets you swap a {@link MemoryCache} for any
 * external backend (Redis, Memcached, your DB) without changing call sites —
 * production bots commonly start with memory and graduate to Redis as load
 * grows. Counters and fixed-window rate limits live on the same surface so the
 * three patterns repeated in real bots (TTL cache, daily counter, per-user
 * rate limit) share one API.
 */

/** Result of a fixed-window {@link CacheStore.rateLimit} hit. */
export interface RateLimitResult {
  /** `true` if this hit was within the window's budget. */
  allowed: boolean;
  /** Remaining hits in the current window (`0` once `allowed` is false). */
  remaining: number;
  /** Epoch ms at which the current window resets. */
  resetAt: number;
}

/** Options accepted by every write helper. */
export interface CacheSetOptions {
  /** Time-to-live in milliseconds. `undefined` means never expire. */
  ttl?: number;
}

/** A swappable cache backend. All operations are async to allow remote stores. */
export interface CacheStore {
  /** Read a previously set value, or `undefined` if missing/expired. */
  get<T = unknown>(key: string): Promise<T | undefined>;
  /** Write a value, optionally with a TTL in ms. */
  set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void>;
  /** Remove a key. Resolves to `true` if it existed. */
  delete(key: string): Promise<boolean>;
  /** Whether a non-expired key is present. */
  has(key: string): Promise<boolean>;
  /** Atomically increment a numeric counter. Returns the new value. */
  increment(key: string, delta?: number, options?: CacheSetOptions): Promise<number>;
  /** Fixed-window rate limit hit. Atomic per key. */
  rateLimit(key: string, options: { limit: number; windowMs: number }): Promise<RateLimitResult>;
  /** Drop every entry. */
  clear(): Promise<void>;
}

interface Entry<T> {
  value: T;
  expiresAt?: number;
}

/** In-memory implementation of {@link CacheStore}. Lazy TTL expiration. */
export class MemoryCache implements CacheStore {
  private readonly store = new Map<string, Entry<unknown>>();

  /** Total number of stored (possibly expired) entries — primarily for tests. */
  get size(): number {
    return this.store.size;
  }

  async get<T = unknown>(key: string): Promise<T | undefined> {
    const entry = this.store.get(key);
    if (entry === undefined) return undefined;
    if (entry.expiresAt !== undefined && entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void> {
    const ttl = options?.ttl;
    this.store.set(key, {
      value,
      expiresAt: ttl !== undefined && ttl > 0 ? Date.now() + ttl : undefined,
    });
  }

  async delete(key: string): Promise<boolean> {
    return this.store.delete(key);
  }

  async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== undefined;
  }

  async increment(key: string, delta: number = 1, options?: CacheSetOptions): Promise<number> {
    const current = (await this.get<number>(key)) ?? 0;
    const next = current + delta;
    const existing = this.store.get(key);
    // Preserve an existing expiry unless caller overrides it.
    const ttl = options?.ttl;
    if (ttl !== undefined && ttl > 0) {
      await this.set(key, next, { ttl });
    } else if (existing?.expiresAt !== undefined) {
      this.store.set(key, { value: next, expiresAt: existing.expiresAt });
    } else {
      await this.set(key, next);
    }
    return next;
  }

  async rateLimit(key: string, options: { limit: number; windowMs: number }): Promise<RateLimitResult> {
    const now = Date.now();
    const bucketKey = `__rl__:${key}`;
    const entry = this.store.get(bucketKey) as Entry<number> | undefined;
    const expired = entry === undefined || entry.expiresAt === undefined || entry.expiresAt <= now;
    if (expired) {
      const resetAt = now + options.windowMs;
      this.store.set(bucketKey, { value: 1, expiresAt: resetAt });
      return { allowed: true, remaining: Math.max(0, options.limit - 1), resetAt };
    }
    const count = entry.value;
    const resetAt = entry.expiresAt ?? now;
    if (count >= options.limit) {
      return { allowed: false, remaining: 0, resetAt };
    }
    this.store.set(bucketKey, { value: count + 1, expiresAt: resetAt });
    return { allowed: true, remaining: Math.max(0, options.limit - count - 1), resetAt };
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

/** Convenience factory: returns a default in-memory {@link CacheStore}. */
export function createCache(): CacheStore {
  return new MemoryCache();
}
