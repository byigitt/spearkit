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

/**
 * Tracks last-use timestamps and decides whether an action is allowed.
 * Stateful but dependency-free; one instance is shared on `client.cooldowns`.
 */
export class CooldownManager {
  private readonly hits = new Map<string, number>();

  /** Number of tracked buckets. */
  get size(): number {
    return this.hits.size;
  }

  /**
   * Check whether `actor` may use `bucket`, recording the use when allowed.
   * Exempt actors and non-positive durations are always allowed (no record).
   */
  consume(bucket: string, input: CooldownInput, actor: CooldownActor, now: number = Date.now()): CooldownResult {
    const config = normalizeCooldown(input);
    const duration = effectiveDuration(config, actor);
    if (duration === null || duration <= 0) return { allowed: true };
    const key = keyFor(bucket, config, actor);
    const last = this.hits.get(key);
    if (last !== undefined && now - last < duration) {
      return { allowed: false, remaining: duration - (now - last) };
    }
    this.hits.set(key, now);
    return { allowed: true };
  }

  /** Like {@link consume} but never records — a read-only check. */
  peek(bucket: string, input: CooldownInput, actor: CooldownActor, now: number = Date.now()): CooldownResult {
    const config = normalizeCooldown(input);
    const duration = effectiveDuration(config, actor);
    if (duration === null || duration <= 0) return { allowed: true };
    const last = this.hits.get(keyFor(bucket, config, actor));
    if (last !== undefined && now - last < duration) {
      return { allowed: false, remaining: duration - (now - last) };
    }
    return { allowed: true };
  }

  /** Clear a single actor's cooldown for a bucket. Returns whether one existed. */
  reset(bucket: string, actor: CooldownActor, scope: CooldownScope = "user"): boolean {
    return this.hits.delete(`${bucket}|${scopeKey(scope, actor)}`);
  }

  /** Drop every tracked cooldown. */
  clear(): void {
    this.hits.clear();
  }
}

/** Build the user-facing message for a blocked action. */
export function formatCooldownMessage(config: CooldownConfig, remainingMs: number): string {
  if (typeof config.message === "function") return config.message(remainingMs);
  if (typeof config.message === "string") return config.message;
  const seconds = Math.max(1, Math.ceil(remainingMs / 1000));
  return `You're on cooldown — try again in ${seconds}s.`;
}
