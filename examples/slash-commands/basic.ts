/**
 * Slash commands — the basics.
 *
 * A command bundles its metadata and handler. Export it, then register it with
 * `client.register(basic)` (see ../getting-started).
 */
import { command } from "spear";

export const ping = command({
  name: "ping",
  description: "Check latency",
  run: (ctx) => ctx.reply(`Pong! ${ctx.client.ws.ping}ms`),
});

// Handlers can be async and return anything; the return value is ignored.
export const time = command({
  name: "time",
  description: "Show the current time",
  run: async (ctx) => {
    await ctx.reply(`It is ${new Date().toISOString()}`);
  },
});

// `ctx` exposes the actor and location without reaching into the interaction.
export const whereami = command({
  name: "whereami",
  description: "Report where the command was used",
  run: (ctx) =>
    ctx.reply(ctx.guild ? `In ${ctx.guild.name} (channel ${ctx.channelId})` : "In a DM"),
});
