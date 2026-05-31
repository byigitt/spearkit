/**
 * Per-guild settings + a dynamic per-guild prefix, persisted to a JSON file.
 *
 * `createSettings` gives a typed, defaults-merged accessor over any
 * `KeyValueStore` (here a durable `JsonStore`). The client's `prefix.dynamic`
 * resolver reads each guild's stored prefix, so `!` can become `?` per server —
 * the single most-requested community-bot setting.
 */
import { JsonStore, SpearClient, command, createSettings, option } from "spearkit";

export const settings = createSettings({
  store: new JsonStore("data/guilds.json"),
  defaults: { prefix: "!", modLogChannelId: null as string | null },
});

export const setPrefix = command({
  name: "setprefix",
  description: "Change this server's command prefix",
  guildOnly: true,
  options: { prefix: option.string({ description: "New prefix (e.g. ?)", required: true }) },
  run: async (ctx) => {
    if (ctx.guildId === null) return ctx.error("This only works in a server.");
    await settings.set(ctx.guildId, { prefix: ctx.options.prefix });
    await ctx.success(`Prefix updated to \`${ctx.options.prefix}\`.`);
  },
});

export const client = new SpearClient({
  prefix: {
    // Each guild's own prefix, looked up per message.
    dynamic: async (message) =>
      message.guildId !== null ? (await settings.get(message.guildId)).prefix : null,
  },
});

client.register(setPrefix);

async function main(): Promise<void> {
  await client.start(); // reads DISCORD_TOKEN
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

void main();
