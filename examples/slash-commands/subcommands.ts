/**
 * Slash commands — subcommands and groups.
 *
 * `commandGroup` routes to the right `subcommand` automatically. Direct
 * subcommands and grouped subcommands can coexist.
 *
 *   /settings get
 *   /settings set
 *   /settings roles add
 */
import { command, commandGroup, option, subcommand, subcommandGroup } from "spear";

export const settings = commandGroup({
  name: "settings",
  description: "Manage settings",
  guildOnly: true,
  // /settings get and /settings set
  subcommands: {
    get: subcommand({
      description: "Show a setting",
      options: { key: option.string({ description: "Setting key", required: true }) },
      run: (ctx) => ctx.reply(`Value of ${ctx.options.key}: (demo)`),
    }),
    set: subcommand({
      description: "Change a setting",
      options: {
        key: option.string({ description: "Setting key", required: true }),
        value: option.string({ description: "New value", required: true }),
      },
      run: (ctx) => ctx.reply(`Set ${ctx.options.key} = ${ctx.options.value}`),
    }),
  },
  // /settings roles add and /settings roles remove
  groups: {
    roles: subcommandGroup({
      description: "Manage auto-roles",
      subcommands: {
        add: subcommand({
          description: "Add an auto-role",
          options: { role: option.role({ description: "Role", required: true }) },
          run: (ctx) => ctx.reply(`Added ${ctx.options.role}`),
        }),
        remove: subcommand({
          description: "Remove an auto-role",
          options: { role: option.role({ description: "Role", required: true }) },
          run: (ctx) => ctx.reply(`Removed ${ctx.options.role}`),
        }),
      },
    }),
  },
});

// A handler can also branch on the invoked subcommand via ctx.subcommand.
export const tools = command({
  name: "tools",
  description: "Misc tools",
  run: (ctx) => ctx.reply(`Invoked subcommand: ${ctx.subcommand ?? "none"}`),
});
