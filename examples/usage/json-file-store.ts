/**
 * Usage tracking — durable JSON-file store.
 *
 * JsonFileUsageStore appends one newline-delimited JSON object per event to a
 * `.jsonl` file. `all()` reads the file back, so it behaves like a small
 * file-backed database that survives restarts.
 *
 * Run with: DISCORD_TOKEN=... npx tsx examples/usage/json-file-store.ts
 */
import { Intents, JsonFileUsageStore, SpearClient, command } from "spearkit";

const store = new JsonFileUsageStore("./usage.jsonl");

const client = new SpearClient({ intents: Intents.default, usage: { store } });

const ping = command({
  name: "ping",
  description: "Check that the bot is alive",
  run: (ctx) => ctx.reply("Pong!"),
});

client.register(ping);

async function main(): Promise<void> {
  await client.start(); // reads DISCORD_TOKEN
  await client.deployCommands({ guildId: process.env.GUILD_ID });

  // Read the durable log back (always async for the file store).
  const events = await store.all();
  console.log(`usage.jsonl holds ${events.length} events`);
}

void main();
