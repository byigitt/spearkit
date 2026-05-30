/**
 * Scheduler — run a task on a fixed interval.
 *
 *   DISCORD_TOKEN=... npx tsx examples/scheduler/interval.ts
 */
import { SpearClient, Intents, task } from "spearkit";

const client = new SpearClient({ intents: Intents.default, logger: { level: "info" } });

client.register(
  task({
    name: "heartbeat",
    interval: 60_000, // every minute
    runOnStart: true, // also run once at startup
    run: (c) => c.logger.info("heartbeat", { data: { guilds: c.guilds.cache.size } }),
  }),
);

async function main(): Promise<void> {
  await client.start(); // scheduler starts on ready
}

void main();
