/**
 * Permission and role-hierarchy preflight helpers for moderation-style actions.
 *
 * Two failures dominate moderation bots: doing work and *then* hitting a
 * `Missing Permissions` (50013) error, and trying to ban/kick/timeout a member
 * who is above the bot (or above the moderator) in the role list. Both are
 * checkable up front. These helpers compute exactly what's missing so you can
 * bail out with a clear message before touching the API.
 *
 * @example
 * ```ts
 * const missing = botMissingPermissions(ctx.channel, [PermissionFlagsBits.ManageMessages]);
 * if (missing.length) return ctx.error(`I need: ${formatPermissions(missing)}`);
 *
 * const check = moderationCheck({ moderator: ctx.member, target, action: "ban" });
 * if (!check.ok) return ctx.error(check.reason);
 * await target.ban();
 * ```
 */
import {
  PermissionsBitField,
  type GuildBasedChannel,
  type GuildMember,
  type PermissionResolvable,
  type PermissionsString,
  type Role,
} from "discord.js";

/** A member or role whose permissions are being resolved in a channel. */
export type PermissionHolder = GuildMember | Role;

/**
 * Return the names of the `required` permissions that `who` does NOT have in
 * `channel` (taking channel overwrites and Administrator into account). An empty
 * array means every required permission is granted. When permissions can't be
 * resolved (e.g. the member isn't cached) every required permission is reported
 * missing.
 */
export function missingPermissions(
  channel: GuildBasedChannel,
  who: PermissionHolder,
  required: PermissionResolvable,
): PermissionsString[] {
  const held = channel.permissionsFor(who);
  if (held === null) return new PermissionsBitField(required).toArray();
  return held.missing(required);
}

/**
 * Like {@link missingPermissions} but for the bot's own member in `channel`.
 * Resolves `channel.guild.members.me`; if that isn't available, every required
 * permission is reported missing.
 */
export function botMissingPermissions(
  channel: GuildBasedChannel,
  required: PermissionResolvable,
): PermissionsString[] {
  const me = channel.guild.members.me;
  if (me === null) return new PermissionsBitField(required).toArray();
  return missingPermissions(channel, me, required);
}

/** Whether `who` has all of `required` in `channel`. */
export function hasPermissions(
  channel: GuildBasedChannel,
  who: PermissionHolder,
  required: PermissionResolvable,
): boolean {
  return missingPermissions(channel, who, required).length === 0;
}

/**
 * Compare two members by their highest role position. Returns a positive number
 * when `a` is above `b`, negative when below, `0` when equal. This is the raw
 * comparison Discord enforces for moderation actions.
 */
export function compareRoles(a: GuildMember, b: GuildMember): number {
  return a.roles.highest.comparePositionTo(b.roles.highest);
}

/**
 * Whether `actor` outranks `target` enough to act on them: not the same member,
 * `target` isn't the guild owner, and `actor` is either the owner or holds a
 * higher top role.
 */
export function canActOn(actor: GuildMember, target: GuildMember): boolean {
  if (actor.id === target.id) return false;
  if (target.id === target.guild.ownerId) return false;
  if (actor.id === actor.guild.ownerId) return true;
  return compareRoles(actor, target) > 0;
}

/** The result of a {@link moderationCheck}: pass, or fail with a reason. */
export type ModerationCheckResult = { ok: true } | { ok: false; reason: string };

/** Options for {@link moderationCheck}. */
export interface ModerationCheckOptions {
  /** The member attempting the action. */
  moderator: GuildMember;
  /** The member the action targets. */
  target: GuildMember;
  /**
   * The bot's own member. Defaults to `target.guild.members.me`. Pass `null` to
   * skip the bot-hierarchy check (e.g. when the action doesn't need it).
   */
  me?: GuildMember | null;
  /** Verb used in the failure messages, e.g. `"ban"`. Default `"moderate"`. */
  action?: string;
}

/**
 * Validate that both the moderator and the bot may act on `target`, returning a
 * ready-to-show reason on the first failing rule. Checks, in order: acting on
 * self, acting on the server owner, moderator role hierarchy, and bot role
 * hierarchy.
 */
export function moderationCheck(options: ModerationCheckOptions): ModerationCheckResult {
  const { moderator, target } = options;
  const action = options.action ?? "moderate";
  const me = options.me === undefined ? target.guild.members.me : options.me;
  const name = target.user.username;

  if (moderator.id === target.id) return { ok: false, reason: `You can't ${action} yourself.` };
  if (target.id === target.guild.ownerId) {
    return { ok: false, reason: `You can't ${action} the server owner.` };
  }
  if (moderator.id !== moderator.guild.ownerId && compareRoles(moderator, target) <= 0) {
    return {
      ok: false,
      reason: `You can't ${action} **${name}** — their highest role is above or equal to yours.`,
    };
  }
  if (me !== null) {
    if (me.id === target.id) return { ok: false, reason: `I can't ${action} myself.` };
    if (me.id !== me.guild.ownerId && compareRoles(me, target) <= 0) {
      return {
        ok: false,
        reason: `I can't ${action} **${name}** — move my role above theirs and try again.`,
      };
    }
  }
  return { ok: true };
}

const PERMISSION_LABELS: Partial<Record<PermissionsString, string>> = {
  CreateInstantInvite: "Create Invite",
  KickMembers: "Kick Members",
  BanMembers: "Ban Members",
  Administrator: "Administrator",
  ManageChannels: "Manage Channels",
  ManageGuild: "Manage Server",
  AddReactions: "Add Reactions",
  ViewAuditLog: "View Audit Log",
  PrioritySpeaker: "Priority Speaker",
  Stream: "Video",
  ViewChannel: "View Channel",
  SendMessages: "Send Messages",
  SendTTSMessages: "Send TTS Messages",
  ManageMessages: "Manage Messages",
  EmbedLinks: "Embed Links",
  AttachFiles: "Attach Files",
  ReadMessageHistory: "Read Message History",
  MentionEveryone: "Mention Everyone",
  UseExternalEmojis: "Use External Emojis",
  ViewGuildInsights: "View Server Insights",
  Connect: "Connect",
  Speak: "Speak",
  MuteMembers: "Mute Members",
  DeafenMembers: "Deafen Members",
  MoveMembers: "Move Members",
  UseVAD: "Use Voice Activity",
  ChangeNickname: "Change Nickname",
  ManageNicknames: "Manage Nicknames",
  ManageRoles: "Manage Roles",
  ManageWebhooks: "Manage Webhooks",
  ManageGuildExpressions: "Manage Expressions",
  UseApplicationCommands: "Use Application Commands",
  RequestToSpeak: "Request to Speak",
  ManageEvents: "Manage Events",
  ManageThreads: "Manage Threads",
  CreatePublicThreads: "Create Public Threads",
  CreatePrivateThreads: "Create Private Threads",
  UseExternalStickers: "Use External Stickers",
  SendMessagesInThreads: "Send Messages in Threads",
  UseEmbeddedActivities: "Use Activities",
  ModerateMembers: "Timeout Members",
};

/**
 * Render permission flag names into a human, comma-separated string. Accepts a
 * {@link PermissionsString} array (the output of {@link missingPermissions}) or
 * anything {@link PermissionResolvable}.
 *
 * @example
 * ```ts
 * formatPermissions(botMissingPermissions(ctx.channel, [PermissionFlagsBits.BanMembers]));
 * // → "Ban Members"
 * ```
 */
export function formatPermissions(permissions: PermissionResolvable): string {
  const names = new PermissionsBitField(permissions).toArray();
  if (names.length === 0) return "none";
  return names.map((flag) => PERMISSION_LABELS[flag] ?? flag).join(", ");
}
