/**
 * Keyed in-memory async lock (mutex) with TTL.
 *
 * Prevents two handlers from mutating the same resource concurrently — e.g.
 * the same ticket id being claimed twice, or a user opening a ticket while
 * another button click is still creating one. Hold leases are auto-expired so
 * a forgotten `release()` cannot deadlock the process forever.
 */

/** Construction options for {@link KeyedLock}. */
export interface KeyedLockOptions {
  /** Maximum lifetime (ms) of a held lock before it auto-expires. Default `60_000`. */
  ttl?: number;
  /** Sweep interval (ms) for expired-but-not-released locks. `0` disables sweeping. */
  sweep?: number;
}

interface LeaseEntry {
  createdAt: number;
  ttl: number;
}

/** Release a previously-acquired lease. Idempotent — safe to call multiple times. */
export type LockRelease = () => void;

/**
 * Acquire, release and run-while-locked operations keyed on an arbitrary string.
 *
 * @example
 * ```ts
 * const locks = new KeyedLock();
 * const result = await locks.run(`ticket:${id}:claim`, async () => {
 *   // …mutate ticket atomically…
 *   return "ok";
 * }, { onBusy: () => "busy" });
 * ```
 */
export class KeyedLock {
  private readonly entries = new Map<string, LeaseEntry>();
  private readonly defaultTtl: number;
  private readonly sweepTimer?: ReturnType<typeof setInterval>;

  constructor(options: KeyedLockOptions = {}) {
    this.defaultTtl = options.ttl ?? 60_000;
    const sweep = options.sweep ?? 15_000;
    if (sweep > 0) {
      this.sweepTimer = setInterval(() => this.sweep(), sweep);
      if (typeof this.sweepTimer.unref === "function") this.sweepTimer.unref();
    }
  }

  /** Try to acquire `key`. Returns a release function, or `null` if already held. */
  tryAcquire(key: string, ttl: number = this.defaultTtl): LockRelease | null {
    const existing = this.entries.get(key);
    if (existing !== undefined && Date.now() - existing.createdAt < existing.ttl) {
      return null;
    }
    this.entries.set(key, { createdAt: Date.now(), ttl });
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.entries.delete(key);
    };
  }

  /** Whether `key` is currently held and not expired. */
  isHeld(key: string): boolean {
    const entry = this.entries.get(key);
    return entry !== undefined && Date.now() - entry.createdAt < entry.ttl;
  }

  /**
   * Run `fn` while holding `key`. If the key is already held, calls `onBusy`
   * (or returns `undefined`) without ever calling `fn`. Always releases on
   * return or throw.
   */
  async run<T>(
    key: string,
    fn: () => Promise<T> | T,
    options: { ttl?: number; onBusy?: () => Promise<T> | T } = {},
  ): Promise<T | undefined> {
    const release = this.tryAcquire(key, options.ttl ?? this.defaultTtl);
    if (release === null) {
      return options.onBusy !== undefined ? await options.onBusy() : undefined;
    }
    try {
      return await fn();
    } finally {
      release();
    }
  }

  /** Number of currently-tracked leases (including expired-but-unswept). */
  get size(): number {
    return this.entries.size;
  }

  /** Drop all known leases and stop the sweep timer. */
  dispose(): void {
    this.entries.clear();
    if (this.sweepTimer !== undefined) clearInterval(this.sweepTimer);
  }

  /** Manually remove a single key without running anything. */
  forget(key: string): boolean {
    return this.entries.delete(key);
  }

  private sweep(): void {
    const now = Date.now();
    for (const [key, entry] of this.entries.entries()) {
      if (now - entry.createdAt > entry.ttl) this.entries.delete(key);
    }
  }
}
