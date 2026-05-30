/**
 * Autocomplete — using the context.
 *
 * The autocomplete handler receives an AutocompleteContext with the current
 * partial value, the focused option name, and the usual client/user/guild
 * accessors. Use them to produce context-aware suggestions.
 */
import { command, option } from "spear";

export const member = command({
  name: "member",
  description: "Find a guild member",
  options: {
    query: option.string({
      description: "Search by name",
      required: true,
      autocomplete: (ctx) => {
        // Suggest from the cached guild members that match the typed value.
        const typed = ctx.value.toLowerCase();
        const matches = ctx.guild
          ? [...ctx.guild.members.cache.values()]
              .filter((m) => m.user.username.toLowerCase().includes(typed))
              .slice(0, 25)
              .map((m) => ({ name: m.user.username, value: m.id }))
          : [];
        return matches;
      },
    }),
  },
  run: (ctx) => ctx.reply({ content: `Selected member id: ${ctx.options.query}`, ephemeral: true }),
});
