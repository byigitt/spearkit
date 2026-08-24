/**
 * SQLite settings store via Node's built-in `node:sqlite` — no extra package.
 */
import { Intents, SpearClient, SqliteStore, command, createSettings, option } from "spearkit";

const store = new SqliteStore(process.env.SQLITE_PATH ?? ":memory:");

export const settings = createSettings({
  store,
  defaults: { prefix: "!" },
});

export const setPrefix = command({
  name: "setprefix",
  description: "Change this server's command prefix",
  guildOnly: true,
  options: { prefix: option.string({ description: "New prefix", required: true }) },
  run: async (ctx) => {
    if (ctx.guildId === null) return ctx.error("This only works in a server.");
    await settings.set(ctx.guildId, { prefix: ctx.options.prefix });
    await ctx.success(`Prefix updated to \`${ctx.options.prefix}\`.`);
  },
});

const client = new SpearClient({
  intents: Intents.default,
  cooldownStore: store,
  prefix: {
    dynamic: async (message) =>
      message.guildId !== null ? (await settings.get(message.guildId)).prefix : null,
  },
});

client.register(setPrefix);

async function main(): Promise<void> {
  await client.start();
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

void main();
