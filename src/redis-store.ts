/**
 * Redis {@link KeyValueStore} without taking a Redis client dependency.
 *
 * Pass any client that speaks the small {@link RedisCommands} surface —
 * `node-redis` v4+ matches it directly; wrap `ioredis` in a few one-line
 * methods if you already use that.
 */
import type { KeyValueStore } from "./store.js";

/** Options accepted by {@link RedisCommands.set} for NX/PX writes. */
export interface RedisSetOptions {
  /** Set only if the key does not exist. */
  NX?: boolean;
  /** Expire after this many milliseconds. */
  PX?: number;
}

/**
 * Minimal Redis commands used by {@link RedisStore} and
 * {@link redisCooldownBackend}. Compatible with node-redis:
 *
 * ```ts
 * import { createClient } from "redis";
 * const redis = createClient();
 * await redis.connect();
 * const store = new RedisStore(redis);
 * ```
 */
export interface RedisCommands {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: RedisSetOptions): Promise<unknown>;
  del(key: string | readonly string[]): Promise<unknown>;
  keys(pattern: string): Promise<string[]>;
  pttl?(key: string): Promise<number>;
}

/** Options for {@link RedisStore}. */
export interface RedisStoreOptions {
  client: RedisCommands;
  /** Prefix prepended to every key. Default `"spearkit:"`. */
  prefix?: string;
}

/**
 * Redis-backed {@link KeyValueStore}. Values are JSON-serialised.
 *
 * spearkit does not depend on `ioredis` / `redis` — install the client your
 * process already uses and pass it in.
 */
function isStoreOptions(value: RedisCommands | RedisStoreOptions): value is RedisStoreOptions {
  return (
    typeof value === "object" &&
    value !== null &&
    "client" in value &&
    typeof (value as RedisStoreOptions).client?.get === "function"
  );
}

export class RedisStore implements KeyValueStore {
  private readonly client: RedisCommands;
  private readonly prefix: string;

  constructor(client: RedisCommands | RedisStoreOptions) {
    if (isStoreOptions(client)) {
      this.client = client.client;
      this.prefix = client.prefix ?? "spearkit:";
    } else {
      this.client = client;
      this.prefix = "spearkit:";
    }
  }

  private full(key: string): string {
    return this.prefix + key;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const raw = await this.client.get(this.full(key));
    return raw === null ? undefined : (JSON.parse(raw) as T);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.client.set(this.full(key), JSON.stringify(value));
  }

  async has(key: string): Promise<boolean> {
    return (await this.client.get(this.full(key))) !== null;
  }

  async delete(key: string): Promise<boolean> {
    const removed = await this.client.del(this.full(key));
    return Number(removed) > 0;
  }

  async keys(): Promise<string[]> {
    const found = await this.client.keys(`${this.prefix}*`);
    return found.map((key) => key.slice(this.prefix.length));
  }

  async clear(): Promise<void> {
    const found = await this.client.keys(`${this.prefix}*`);
    if (found.length === 0) return;
    await this.client.del(found);
  }
}
