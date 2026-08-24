/**
 * Rate-limit commands per user, per role, per guild, per channel or globally.
 *
 * A cooldown is described by a {@link CooldownConfig}: a base `duration`, the
 * `scope` it is keyed on, an `exempt` set (users/roles that never wait) and
 * per-user / per-role `overrides` (different durations for specific ids). Set a
 * default on the client (applies to every command) and/or per command.
 */

/** What a cooldown is bucketed against. Default `"user"`. */
export type CooldownScope = "user" | "guild" | "channel" | "global";

/** Users and roles that bypass a cooldown entirely. */
export interface CooldownExemptions {
  /** User ids that never wait. */
  users?: readonly string[];
  /** Role ids whose members never wait. */
  roles?: readonly string[];
}

/** Per-user and per-role duration overrides (milliseconds; `0` disables). */
export interface CooldownOverrides {
  /** `userId -> duration ms`. */
  users?: Readonly<Record<string, number>>;
  /** `roleId -> duration ms`. The most lenient matching role wins. */
  roles?: Readonly<Record<string, number>>;
}

/** Full cooldown description. */
export interface CooldownConfig {
  /** Base cooldown in milliseconds. */
  duration: number;
  /** What the cooldown is keyed on. Default `"user"`. */
  scope?: CooldownScope;
  /** Users/roles that bypass the cooldown. */
  exempt?: CooldownExemptions;
  /** Per-user / per-role duration overrides. */
  overrides?: CooldownOverrides;
  /** Message shown when blocked. A function receives the remaining ms. */
  message?: string | ((remainingMs: number) => string);
}

/** A `CooldownConfig`, or a bare duration in milliseconds. */
export type CooldownInput = number | CooldownConfig;

/** Normalise a {@link CooldownInput} to a full {@link CooldownConfig}. */
export function normalizeCooldown(input: CooldownInput): CooldownConfig {
  return typeof input === "number" ? { duration: input } : input;
}

/** The actor a cooldown is evaluated for. */
export interface CooldownActor {
  userId: string;
  roleIds: readonly string[];
  guildId: string | null;
  channelId: string | null;
}

/** Whether an action is allowed now, and if not, how long remains. */
export type CooldownResult = { allowed: true } | { allowed: false; remaining: number };

function scopeKey(scope: CooldownScope, actor: CooldownActor): string {
  switch (scope) {
    case "guild":
      return `g:${actor.guildId ?? "dm"}`;
    case "channel":
      return `c:${actor.channelId ?? "dm"}`;
    case "global":
      return "global";
    case "user":
      return `u:${actor.userId}`;
  }
}

/**
 * Resolve the cooldown an actor should serve. `null` means exempt (no
 * cooldown). Otherwise a duration in milliseconds (which may be `0`).
 */
export function effectiveDuration(config: CooldownConfig, actor: CooldownActor): number | null {
  if (config.exempt?.users?.includes(actor.userId) === true) return null;
  if (config.exempt?.roles?.some((roleId) => actor.roleIds.includes(roleId)) === true) return null;

  const userOverride = config.overrides?.users?.[actor.userId];
  if (userOverride !== undefined) return userOverride;

  const roleOverrides = config.overrides?.roles;
  if (roleOverrides !== undefined) {
    let best: number | undefined;
    for (const roleId of actor.roleIds) {
      const candidate = roleOverrides[roleId];
      if (candidate !== undefined) best = best === undefined ? candidate : Math.min(best, candidate);
    }
    if (best !== undefined) return best;
  }

  return config.duration;
}

function keyFor(bucket: string, config: CooldownConfig, actor: CooldownActor): string {
  return `${bucket}|${scopeKey(config.scope ?? "user", actor)}`;
}

import type { Awaitable } from "discord.js";
import type { KeyValueStore } from "./store.js";
import type { RedisCommands } from "./redis-store.js";

/**
 * Pluggable last-hit storage for {@link CooldownManager}.
 *
 * The in-memory backend is the default. Pass a {@link KeyValueStore} via
 * {@link keyValueCooldownBackend} (SQLite/JSON, restart-safe) or
 * {@link redisCooldownBackend} (`SET NX PX`, shard-safe) so several processes
 * share one clock.
 */
export interface CooldownBackend {
  /** Record a hit unless `key` is still cooling down. */
  hit(key: string, durationMs: number, now: number): Awaitable<CooldownResult>;
  /** Read-only check. */
  peek(key: string, durationMs: number, now: number): Awaitable<CooldownResult>;
  /** Drop one key. Resolves `true` if it existed. */
  delete(key: string): Awaitable<boolean>;
  /** Drop every tracked key. */
  clear(): Awaitable<void>;
  /** Number of tracked keys, when cheap to compute. */
  size?(): Awaitable<number> | number;
}

/** In-process timestamp map — the historical {@link CooldownManager} behaviour. */
export class MemoryCooldownBackend implements CooldownBackend {
  private readonly hits = new Map<string, number>();

  size(): number {
    return this.hits.size;
  }

  hit(key: string, durationMs: number, now: number): CooldownResult {
    const last = this.hits.get(key);
    if (last !== undefined && now - last < durationMs) {
      return { allowed: false, remaining: durationMs - (now - last) };
    }
    this.hits.set(key, now);
    return { allowed: true };
  }

  peek(key: string, durationMs: number, now: number): CooldownResult {
    const last = this.hits.get(key);
    if (last !== undefined && now - last < durationMs) {
      return { allowed: false, remaining: durationMs - (now - last) };
    }
    return { allowed: true };
  }

  delete(key: string): boolean {
    return this.hits.delete(key);
  }

  clear(): void {
    this.hits.clear();
  }
}

/**
 * Persist last-hit timestamps in any {@link KeyValueStore}.
 *
 * Safe across restarts; two processes hitting the same key can race (use
 * {@link redisCooldownBackend} when you need atomic NX).
 */
export function keyValueCooldownBackend(store: KeyValueStore): CooldownBackend {
  return {
    async hit(key, durationMs, now) {
      const last = await store.get<number>(key);
      if (last !== undefined && now - last < durationMs) {
        return { allowed: false, remaining: durationMs - (now - last) };
      }
      await store.set(key, now);
      return { allowed: true };
    },
    async peek(key, durationMs, now) {
      const last = await store.get<number>(key);
      if (last !== undefined && now - last < durationMs) {
        return { allowed: false, remaining: durationMs - (now - last) };
      }
      return { allowed: true };
    },
    delete: (key) => store.delete(key),
    clear: () => store.clear(),
    async size() {
      return (await store.keys()).length;
    },
  };
}

function setSucceeded(result: unknown): boolean {
  return result === "OK" || result === true;
}

/**
 * Atomic cooldown clock over Redis `SET key NX PX duration`.
 *
 * The key exists only while the actor is cooling down, so shards share one
 * window without a compare-and-swap race.
 */
export function redisCooldownBackend(
  client: RedisCommands,
  options: { prefix?: string } = {},
): CooldownBackend {
  const prefix = options.prefix ?? "cooldown:";
  const full = (key: string): string => prefix + key;

  return {
    async hit(key, durationMs, now) {
      const redisKey = full(key);
      const result = await client.set(redisKey, String(now), {
        NX: true,
        PX: durationMs,
      });
      if (setSucceeded(result)) return { allowed: true };
      const ttl = client.pttl === undefined ? durationMs : await client.pttl(redisKey);
      return { allowed: false, remaining: Math.max(1, ttl) };
    },
    async peek(key, durationMs) {
      const redisKey = full(key);
      if (client.pttl !== undefined) {
        const ttl = await client.pttl(redisKey);
        if (ttl < 0) return { allowed: true };
        return { allowed: false, remaining: ttl };
      }
      const raw = await client.get(redisKey);
      if (raw === null) return { allowed: true };
      return { allowed: false, remaining: durationMs };
    },
    async delete(key) {
      return Number(await client.del(full(key))) > 0;
    },
    async clear() {
      const found = await client.keys(`${prefix}*`);
      if (found.length === 0) return;
      await client.del(found);
    },
  };
}

function isCooldownBackend(value: unknown): value is CooldownBackend {
  return (
    typeof value === "object" &&
    value !== null &&
    "hit" in value &&
    typeof (value as CooldownBackend).hit === "function"
  );
}

function isKeyValueStore(value: unknown): value is KeyValueStore {
  return (
    typeof value === "object" &&
    value !== null &&
    "get" in value &&
    "set" in value &&
    "keys" in value &&
    "clear" in value
  );
}

/** A cooldown backend, or a store wrapped with {@link keyValueCooldownBackend}. */
export type CooldownStoreInput = CooldownBackend | KeyValueStore;

/** Resolve {@link CooldownStoreInput} into a {@link CooldownBackend}. */
export function resolveCooldownBackend(input?: CooldownStoreInput): CooldownBackend {
  if (input === undefined) return new MemoryCooldownBackend();
  if (isCooldownBackend(input)) return input;
  if (isKeyValueStore(input)) return keyValueCooldownBackend(input);
  throw new Error("spearkit: cooldownStore must be a CooldownBackend or KeyValueStore");
}

/**
 * Tracks last-use timestamps and decides whether an action is allowed.
 * One instance is shared on `client.cooldowns`. The default backend is
 * in-memory; pass a store so shards/restarts share the same clock.
 */
export class CooldownManager {
  private backend: CooldownBackend;

  constructor(backend?: CooldownStoreInput) {
    this.backend = resolveCooldownBackend(backend);
  }

  /** Swap the persistence backend (tests, late Redis connect). */
  setBackend(backend: CooldownStoreInput): this {
    this.backend = resolveCooldownBackend(backend);
    return this;
  }

  /** Number of tracked buckets when the backend exposes `size`. */
  get size(): number {
    const value = this.backend.size?.();
    return typeof value === "number" ? value : 0;
  }

  /**
   * Check whether `actor` may use `bucket`, recording the use when allowed.
   * Exempt actors and non-positive durations are always allowed (no record).
   * Returns a Promise when the backend is async; the in-memory backend stays
   * synchronous. Dispatch always `await`s this.
   */
  consume(
    bucket: string,
    input: CooldownInput,
    actor: CooldownActor,
    now: number = Date.now(),
  ): Awaitable<CooldownResult> {
    const config = normalizeCooldown(input);
    const duration = effectiveDuration(config, actor);
    if (duration === null || duration <= 0) return { allowed: true };
    return this.backend.hit(keyFor(bucket, config, actor), duration, now);
  }

  /** Like {@link consume} but never records — a read-only check. */
  peek(
    bucket: string,
    input: CooldownInput,
    actor: CooldownActor,
    now: number = Date.now(),
  ): Awaitable<CooldownResult> {
    const config = normalizeCooldown(input);
    const duration = effectiveDuration(config, actor);
    if (duration === null || duration <= 0) return { allowed: true };
    return this.backend.peek(keyFor(bucket, config, actor), duration, now);
  }

  /** Clear a single actor's cooldown for a bucket. Returns whether one existed. */
  reset(
    bucket: string,
    actor: CooldownActor,
    scope: CooldownScope = "user",
  ): Awaitable<boolean> {
    return this.backend.delete(`${bucket}|${scopeKey(scope, actor)}`);
  }

  /** Drop every tracked cooldown. */
  clear(): Awaitable<void> {
    return this.backend.clear();
  }
}

/** Build the user-facing message for a blocked action. */
export function formatCooldownMessage(config: CooldownConfig, remainingMs: number): string {
  if (typeof config.message === "function") return config.message(remainingMs);
  if (typeof config.message === "string") return config.message;
  const seconds = Math.max(1, Math.ceil(remainingMs / 1000));
  return `You're on cooldown — try again in ${seconds}s.`;
}
