/**
 * Declarative preconditions ("guards") that run before a command, component
 * or prefix-command handler. Replaces the role/permission/guild-only/owner
 * checks repeated 127+ times across production bots — `member.roles.cache.some(...)`,
 * `member.permissions.has(...)`, `if (!message.guild) return`, ownership and
 * target-hierarchy checks — with a composable predicate pipeline.
 *
 * Attach guards on a command (`command({ guards: [...] })`), on a component
 * (`button({ guards: [...] })`), on a prefix command, or once on the client
 * for everything (`new SpearClient({ guards: [...] })`). On denial, spearkit
 * replies with an ephemeral error embed and skips the handler.
 */
import {
  PermissionsBitField,
  type APIInteractionGuildMember,
  type Awaitable,
  type Client,
  type Guild,
  type GuildMember,
  type PermissionResolvable,
  type User,
} from "discord.js";

/**
 * Minimal context a guard reads. Every spearkit handler (slash/prefix/component
 * /modal) already exposes these — guards work uniformly across all of them.
 */
export interface GuardContext {
  readonly client: Client;
  readonly user: User;
  readonly member: GuildMember | APIInteractionGuildMember | null;
  readonly guild: Guild | null;
  readonly guildId: string | null;
  readonly channelId: string | null;
}

/** A guard's outcome. `true` = pass; `false`/`{ allowed: false, reason? }` = deny. */
export type GuardResult = boolean | { allowed: false; reason?: string };

/** A precondition evaluated before a handler runs. */
export type Guard<TCtx extends GuardContext = GuardContext> = (ctx: TCtx) => Awaitable<GuardResult>;

/** Sugar: build a denial result with an explanation. */
export function denied(reason?: string): GuardResult {
  return { allowed: false, reason };
}

/** The resolved outcome of running a list of guards. */
export type RunGuardsResult = { allowed: true } | { allowed: false; reason: string | undefined };

/** Run guards in order, short-circuiting on the first denial. */
export async function runGuards<TCtx extends GuardContext>(
  ctx: TCtx,
  guards: readonly Guard<TCtx>[] | undefined,
): Promise<RunGuardsResult> {
  if (guards === undefined || guards.length === 0) return { allowed: true };
  for (const guard of guards) {
    const result = await guard(ctx);
    if (result === true) continue;
    if (result === false) return { allowed: false, reason: undefined };
    if (result.allowed === false) return { allowed: false, reason: result.reason };
  }
  return { allowed: true };
}

// --- built-in predicates --------------------------------------------------

/** Require the interaction/message to come from inside a guild. */
export function guildOnly(reason: string = "This can only be used in a server."): Guard {
  return (ctx) => (ctx.guildId !== null ? true : denied(reason));
}

/** Require the interaction/message to come from a DM. */
export function dmOnly(reason: string = "This can only be used in DMs."): Guard {
  return (ctx) => (ctx.guildId === null ? true : denied(reason));
}

function memberRoleIds(member: GuildMember | APIInteractionGuildMember | null): string[] {
  if (member === null) return [];
  const roles = member.roles;
  if (Array.isArray(roles)) return roles;
  return [...roles.cache.keys()];
}

function memberPermissionsBitField(
  member: GuildMember | APIInteractionGuildMember | null,
): PermissionsBitField | null {
  if (member === null) return null;
  const perms = member.permissions;
  if (perms instanceof PermissionsBitField) return perms;
  if (typeof perms === "string") return new PermissionsBitField(BigInt(perms));
  return null;
}

/** Require the invoking member to hold ANY of these role ids. */
export function requireAnyRole(
  roleIds: readonly string[],
  reason: string = "You don't have permission to use this.",
): Guard {
  const set = new Set(roleIds);
  return (ctx) => {
    const ids = memberRoleIds(ctx.member);
    return ids.some((id) => set.has(id)) ? true : denied(reason);
  };
}

/** Require the invoking member to hold EVERY one of these role ids. */
export function requireAllRoles(
  roleIds: readonly string[],
  reason: string = "You're missing one of the required roles.",
): Guard {
  return (ctx) => {
    const ids = new Set(memberRoleIds(ctx.member));
    return roleIds.every((id) => ids.has(id)) ? true : denied(reason);
  };
}

/** Require the invoking user to be one of `ownerIds` ("bot owners"). */
export function requireOwner(
  ownerIds: readonly string[],
  reason: string = "This is owner-only.",
): Guard {
  const set = new Set(ownerIds);
  return (ctx) => (set.has(ctx.user.id) ? true : denied(reason));
}

/** Require the invoking member to hold a Discord permission flag. */
export function requireUserPermissions(
  permission: PermissionResolvable,
  reason: string = "You don't have permission to use this.",
): Guard {
  return (ctx) => {
    const bits = memberPermissionsBitField(ctx.member);
    if (bits === null) return denied(reason);
    return bits.has(permission) ? true : denied(reason);
  };
}

/** Require the BOT's own member to hold a Discord permission flag. */
export function requireBotPermissions(
  permission: PermissionResolvable,
  reason: string = "I don't have permission to do that here.",
): Guard {
  return async (ctx) => {
    const guild = ctx.guild;
    if (guild === null) return denied(reason);
    const me = guild.members.me ?? (await guild.members.fetchMe().catch(() => null));
    if (me === null) return denied(reason);
    return me.permissions.has(permission) ? true : denied(reason);
  };
}

/** Inline custom predicate; sugar so a one-off check still types as a Guard. */
export function guard<TCtx extends GuardContext = GuardContext>(predicate: Guard<TCtx>): Guard<TCtx> {
  return predicate;
}
