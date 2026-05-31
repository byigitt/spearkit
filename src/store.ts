/**
 * Tiny persistent key-value storage and a typed per-guild settings helper.
 *
 * Almost every community bot needs to remember *something* per guild — a custom
 * prefix, a mod-log channel, a welcome message — and reaches for a database on
 * day one. spearkit ships a dependency-free {@link KeyValueStore} interface with
 * two backends ({@link MemoryStore} for tests, {@link JsonStore} for a durable
 * JSON file) plus {@link createSettings} for merged-with-defaults guild config.
 * Swap in your own store (Redis, SQL, …) by implementing the interface.
 *
 * @example
 * ```ts
 * const settings = createSettings({
 *   store: new JsonStore("data/guilds.json"),
 *   defaults: { prefix: "!", modLogChannelId: null as string | null },
 * });
 * const cfg = await settings.get(guildId);        // always fully populated
 * await settings.set(guildId, { prefix: "?" });   // shallow-merged + persisted
 * ```
 */
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * A minimal async key-value store. Values must be JSON-serialisable. All
 * backends share these semantics so you can develop against {@link MemoryStore}
 * and ship with {@link JsonStore} (or your own) without code changes.
 */
export interface KeyValueStore {
  /** Resolve the value for `key`, or `undefined` if absent. */
  get<T>(key: string): Promise<T | undefined>;
  /** Store `value` under `key`, overwriting any previous value. */
  set<T>(key: string, value: T): Promise<void>;
  /** Whether `key` currently has a value. */
  has(key: string): Promise<boolean>;
  /** Remove `key`. Resolves `true` if it existed. */
  delete(key: string): Promise<boolean>;
  /** Every key currently stored. */
  keys(): Promise<string[]>;
  /** Remove every key. */
  clear(): Promise<void>;
}

function clone<T>(value: T): T {
  if (value === undefined || value === null) return value;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * In-memory {@link KeyValueStore}. Values are deep-cloned on read and write so
 * callers can't accidentally mutate stored state — matching what a persistent
 * backend would do. Ideal for tests and ephemeral data.
 */
export class MemoryStore implements KeyValueStore {
  private readonly map = new Map<string, unknown>();

  async get<T>(key: string): Promise<T | undefined> {
    return this.map.has(key) ? clone(this.map.get(key) as T) : undefined;
  }
  async set<T>(key: string, value: T): Promise<void> {
    this.map.set(key, clone(value));
  }
  async has(key: string): Promise<boolean> {
    return this.map.has(key);
  }
  async delete(key: string): Promise<boolean> {
    return this.map.delete(key);
  }
  async keys(): Promise<string[]> {
    return [...this.map.keys()];
  }
  async clear(): Promise<void> {
    this.map.clear();
  }
}

/**
 * File-backed {@link KeyValueStore} persisting the whole map as one JSON object.
 * Reads are served from an in-memory cache (loaded once, lazily); writes are
 * serialised through a queue and committed atomically (temp file + rename) so a
 * crash mid-write can never corrupt the file.
 */
export class JsonStore implements KeyValueStore {
  private readonly cache = new Map<string, unknown>();
  private loading?: Promise<void>;
  private writeChain: Promise<void> = Promise.resolve();

  constructor(private readonly path: string) {}

  private ensureLoaded(): Promise<void> {
    if (this.loading === undefined) this.loading = this.load();
    return this.loading;
  }

  private async load(): Promise<void> {
    try {
      const raw = await readFile(this.path, "utf8");
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      for (const [key, value] of Object.entries(parsed)) this.cache.set(key, value);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  /** Queue an atomic write of the current cache; serialised against prior writes. */
  private persist(): Promise<void> {
    this.writeChain = this.writeChain.then(async () => {
      const body = JSON.stringify(Object.fromEntries(this.cache), null, 2);
      await mkdir(dirname(this.path), { recursive: true });
      const tmp = `${this.path}.${process.pid}.${Date.now()}.tmp`;
      await writeFile(tmp, body, "utf8");
      await rename(tmp, this.path);
    });
    return this.writeChain;
  }

  async get<T>(key: string): Promise<T | undefined> {
    await this.ensureLoaded();
    return this.cache.has(key) ? clone(this.cache.get(key) as T) : undefined;
  }
  async set<T>(key: string, value: T): Promise<void> {
    await this.ensureLoaded();
    this.cache.set(key, clone(value));
    await this.persist();
  }
  async has(key: string): Promise<boolean> {
    await this.ensureLoaded();
    return this.cache.has(key);
  }
  async delete(key: string): Promise<boolean> {
    await this.ensureLoaded();
    const existed = this.cache.delete(key);
    if (existed) await this.persist();
    return existed;
  }
  async keys(): Promise<string[]> {
    await this.ensureLoaded();
    return [...this.cache.keys()];
  }
  async clear(): Promise<void> {
    await this.ensureLoaded();
    this.cache.clear();
    await this.persist();
  }
}

/**
 * Wrap a store so every key is transparently prefixed with `${prefix}:`. Lets
 * several features share one backing file without key collisions.
 */
export function namespaced(store: KeyValueStore, prefix: string): KeyValueStore {
  const tag = `${prefix}:`;
  return {
    get: (key) => store.get(tag + key),
    set: (key, value) => store.set(tag + key, value),
    has: (key) => store.has(tag + key),
    delete: (key) => store.delete(tag + key),
    async keys() {
      return (await store.keys()).filter((k) => k.startsWith(tag)).map((k) => k.slice(tag.length));
    },
    async clear() {
      for (const key of await this.keys()) await store.delete(tag + key);
    },
  };
}

/** A typed settings accessor returned by {@link createSettings}. */
export interface SettingsManager<T extends Record<string, unknown>> {
  /** The defaults merged into every {@link get}. */
  readonly defaults: T;
  /** The underlying store. */
  readonly store: KeyValueStore;
  /** Read `id`'s settings, always fully populated from {@link defaults}. */
  get(id: string): Promise<T>;
  /** Shallow-merge `patch` into `id`'s stored settings and persist; returns the merged result. */
  set(id: string, patch: Partial<T>): Promise<T>;
  /** Restore `id` to defaults by removing its stored overrides. */
  reset(id: string): Promise<void>;
}

/** Options for {@link createSettings}. */
export interface CreateSettingsOptions<T extends Record<string, unknown>> {
  /** Backing store (e.g. `new JsonStore(path)`). */
  store: KeyValueStore;
  /** Default values applied to ids with no (or partial) stored settings. */
  defaults: T;
  /** Key prefix; lets one store hold several settings groups. Default `"settings"`. */
  namespace?: string;
}

/**
 * Build a typed, defaults-merged settings accessor over a {@link KeyValueStore}.
 * `get` always returns a complete object (stored overrides on top of defaults),
 * and `set` only persists the overrides — so widening `defaults` later is safe.
 */
export function createSettings<T extends Record<string, unknown>>(
  options: CreateSettingsOptions<T>,
): SettingsManager<T> {
  const { store, defaults } = options;
  const ns = options.namespace ?? "settings";
  const keyFor = (id: string): string => `${ns}:${id}`;
  return {
    defaults,
    store,
    async get(id) {
      const stored = await store.get<Partial<T>>(keyFor(id));
      return { ...defaults, ...(stored ?? {}) };
    },
    async set(id, patch) {
      const stored = (await store.get<Partial<T>>(keyFor(id))) ?? {};
      const merged = { ...stored, ...patch };
      await store.set(keyFor(id), merged);
      return { ...defaults, ...merged };
    },
    async reset(id) {
      await store.delete(keyFor(id));
    },
  };
}
