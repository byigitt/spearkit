/**
 * Cache-first, timeout-bounded fetch helpers that resolve to `T | null` instead
 * of throwing. They replace the `.catch(() => null)` pattern repeated 30+ times
 * in production bots (member/channel/message/user/guild/role lookups that may
 * 404, rate-limit, or block startup if awaited indefinitely).
 */
import type {
  Channel,
  Client,
  Guild,
  GuildMember,
  Message,
  MessageManager,
  Role,
  User,
} from "discord.js";

/** Shared options for every safe-fetch helper. */
export interface SafeFetchOptions {
  /** Use the cache when present and not `force`. Default `true`. */
  cache?: boolean;
  /** Bypass the cache and force a REST hit. Default `false`. */
  force?: boolean;
  /** Resolve to `null` if Discord takes longer than this (ms). Default `5000`. */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 5000;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<null>((resolve) => {
      timer = setTimeout(() => resolve(null), ms);
    });
    return await Promise.race([promise.catch(() => null), timeout]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

/** Resolve a guild member with a cache-hit fast path. Returns `null` on failure. */
export async function fetchMember(
  guild: Guild | null | undefined,
  userId: string | null | undefined,
  options: SafeFetchOptions = {},
): Promise<GuildMember | null> {
  if (guild == null || userId == null || userId.length === 0) return null;
  if (options.cache !== false && options.force !== true) {
    const cached = guild.members.cache.get(userId);
    if (cached !== undefined) return cached;
  }
  return withTimeout(
    guild.members.fetch({ user: userId, force: options.force ?? false }),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );
}

/** Resolve a channel by id from the client. Returns `null` on failure. */
export async function fetchChannel(
  client: Client | null | undefined,
  channelId: string | null | undefined,
  options: SafeFetchOptions = {},
): Promise<Channel | null> {
  if (client == null || channelId == null || channelId.length === 0) return null;
  if (options.cache !== false && options.force !== true) {
    const cached = client.channels.cache.get(channelId);
    if (cached !== undefined) return cached;
  }
  return withTimeout(
    client.channels.fetch(channelId, { force: options.force ?? false }),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );
}

/** Resolve a message id in a given channel's messages manager. */
export async function fetchMessage(
  messages: MessageManager | null | undefined,
  messageId: string | null | undefined,
  options: SafeFetchOptions = {},
): Promise<Message | null> {
  if (messages == null || messageId == null || messageId.length === 0) return null;
  if (options.cache !== false && options.force !== true) {
    const cached = messages.cache.get(messageId);
    if (cached !== undefined) return cached;
  }
  return withTimeout(
    messages.fetch({ message: messageId, force: options.force ?? false }),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );
}

/** Resolve a user by id from the client. Returns `null` on failure. */
export async function fetchUser(
  client: Client | null | undefined,
  userId: string | null | undefined,
  options: SafeFetchOptions = {},
): Promise<User | null> {
  if (client == null || userId == null || userId.length === 0) return null;
  if (options.cache !== false && options.force !== true) {
    const cached = client.users.cache.get(userId);
    if (cached !== undefined) return cached;
  }
  return withTimeout(
    client.users.fetch(userId, { force: options.force ?? false }),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );
}

/** Resolve a guild by id from the client. Returns `null` on failure. */
export async function fetchGuild(
  client: Client | null | undefined,
  guildId: string | null | undefined,
  options: SafeFetchOptions = {},
): Promise<Guild | null> {
  if (client == null || guildId == null || guildId.length === 0) return null;
  if (options.cache !== false && options.force !== true) {
    const cached = client.guilds.cache.get(guildId);
    if (cached !== undefined) return cached;
  }
  return withTimeout(
    client.guilds.fetch({ guild: guildId, force: options.force ?? false }),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );
}

/** Resolve a role id from a guild's roles manager. Returns `null` on failure. */
export async function fetchRole(
  guild: Guild | null | undefined,
  roleId: string | null | undefined,
  options: SafeFetchOptions = {},
): Promise<Role | null> {
  if (guild == null || roleId == null || roleId.length === 0) return null;
  if (options.cache !== false && options.force !== true) {
    const cached = guild.roles.cache.get(roleId);
    if (cached !== undefined) return cached;
  }
  return withTimeout(
    guild.roles.fetch(roleId, { force: options.force ?? false }),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );
}

/**
 * Wrap an arbitrary best-effort operation so a failure resolves to `null`
 * instead of throwing. Useful for sends/deletes whose outcome is non-critical.
 *
 * @example
 * ```ts
 * await safeTry(() => message.delete());
 * ```
 */
export async function safeTry<T>(op: () => Promise<T> | T): Promise<T | null> {
  try {
    return await op();
  } catch {
    return null;
  }
}

/** Time-bound an arbitrary promise; resolves to `null` on timeout or rejection. */
export async function withSafeTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T | null> {
  return withTimeout(promise, timeoutMs);
}

/** Cache-first, timeout-bounded fetch helpers grouped for ergonomic imports. */
export const safeFetch = {
  member: fetchMember,
  channel: fetchChannel,
  message: fetchMessage,
  user: fetchUser,
  guild: fetchGuild,
  role: fetchRole,
  try: safeTry,
} as const;
