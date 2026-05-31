/**
 * Moderation preflight — check permissions and role hierarchy *before* acting.
 *
 * `ctx.botMissing(...)` (zero-fetch, reads the interaction's app permissions)
 * catches the "I don't have Ban Members here" case; `moderationCheck(...)`
 * catches "you/I can't act on someone higher in the role list" and "can't ban
 * the owner". Both return clear, ready-to-show messages, so you never hit a
 * `Missing Permissions` (50013) error mid-action.
 */
import {
  PermissionFlagsBits,
  command,
  formatPermissions,
  moderationCheck,
  option,
} from "spearkit";

export const ban = command({
  name: "ban",
  description: "Ban a member",
  guildOnly: true,
  defaultMemberPermissions: PermissionFlagsBits.BanMembers,
  options: {
    member: option.user({ description: "Member to ban", required: true }),
    reason: option.string({ description: "Reason" }),
  },
  run: async (ctx) => {
    if (ctx.guild === null) return ctx.error("This only works in a server.");

    const missing = ctx.botMissing(PermissionFlagsBits.BanMembers);
    if (missing.length > 0) return ctx.error(`I'm missing: ${formatPermissions(missing)}`);

    const [moderator, target] = await Promise.all([
      ctx.guild.members.fetch(ctx.user.id),
      ctx.guild.members.fetch(ctx.options.member.id).catch(() => null),
    ]);
    if (target === null) return ctx.error("I couldn't find that member.");

    const check = moderationCheck({ moderator, target, action: "ban" });
    if (!check.ok) return ctx.error(check.reason);

    await target.ban({ reason: ctx.options.reason });
    await ctx.success(`Banned **${target.user.username}**.`);
  },
});
