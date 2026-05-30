/**
 * Usage tracking — in-memory store.
 *
 * Every successful command/component/prefix use is auto-recorded into the
 * MemoryUsageStore. We query it later via `client.usage.store` (and via the
 * concrete `store` reference for the Memory-only helpers like `.size`).
 *
 * Run with: DISCORD_TOKEN=... npx tsx examples/usage/memory-store.ts
 */
import { Intents, MemoryUsageStore, SpearClient, command } from "spearkit";

const store = new MemoryUsageStore(1_000); // keep the last 1,000 events

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

  // Query through the tracker (UsageStore.all() — works for any store).
  const tracked = client.usage.store;
  if (tracked !== undefined) {
    const events = await tracked.all();
    console.log(`recorded ${events.length} uses so far`);
  }

  // Memory-store specific helpers via the concrete reference.
  console.log(`store size: ${store.size}`);
}

void main();
