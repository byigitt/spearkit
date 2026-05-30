/**
 * Select menus — entity selects (user, role, channel, mentionable).
 *
 * Each context exposes the relevant resolved collections plus the raw ids in
 * `ctx.values`.
 */
import {
  ChannelType,
  channelSelect,
  mentionableSelect,
  roleSelect,
  userSelect,
} from "spearkit";

export const pickUsers = userSelect({
  id: "pick-users",
  placeholder: "Pick up to 3 users",
  maxValues: 3,
  run: (ctx) =>
    ctx.reply({
      content: `Users: ${[...ctx.users.values()].map((u) => u.tag).join(", ")}`,
      ephemeral: true,
    }),
});

export const pickRole = roleSelect({
  id: "pick-role",
  placeholder: "Pick a role",
  run: (ctx) => ctx.reply({ content: `Roles: ${ctx.roles.size}`, ephemeral: true }),
});

export const pickChannel = channelSelect({
  id: "pick-channel",
  placeholder: "Pick a text channel",
  channelTypes: [ChannelType.GuildText],
  run: (ctx) => ctx.reply({ content: `Channels: ${ctx.channels.size}`, ephemeral: true }),
});

export const pickTarget = mentionableSelect({
  id: "pick-target",
  placeholder: "Pick a user or role",
  run: (ctx) =>
    ctx.reply({
      content: `${ctx.users.size} user(s), ${ctx.roles.size} role(s)`,
      ephemeral: true,
    }),
});
