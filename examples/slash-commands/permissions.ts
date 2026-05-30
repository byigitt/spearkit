/**
 * Slash commands — metadata: permissions, guild-only, NSFW, localization.
 */
import { PermissionFlagsBits, command, option } from "spearkit";

// Only members with Manage Messages see this command by default.
export const purge = command({
  name: "purge",
  description: "Delete recent messages",
  guildOnly: true,
  defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
  options: { count: option.integer({ description: "How many", required: true, minValue: 1, maxValue: 100 }) },
  run: (ctx) => ctx.reply({ content: `Would delete ${ctx.options.count} messages.`, ephemeral: true }),
});

// Combine several permission bits.
export const ban = command({
  name: "ban",
  description: "Ban a member",
  guildOnly: true,
  defaultMemberPermissions: PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers,
  options: { member: option.user({ description: "Member", required: true }) },
  run: (ctx) => ctx.reply({ content: `Banned ${ctx.options.member.tag}`, ephemeral: true }),
});

// Localized name and description.
export const hello = command({
  name: "hello",
  description: "Say hello",
  nameLocalizations: { tr: "selam", de: "hallo" },
  descriptionLocalizations: { tr: "Merhaba de", de: "Sag Hallo" },
  run: (ctx) => ctx.reply("Hello!"),
});

// Age-restricted command.
export const spicy = command({
  name: "spicy",
  description: "An age-restricted command",
  nsfw: true,
  run: (ctx) => ctx.reply("Only in age-restricted channels."),
});
