/**
 * Scheduler — define and register a task in one call with client.schedule.
 *
 *   DISCORD_TOKEN=... npx tsx examples/scheduler/inline-schedule.ts
 */
import { SpearClient, Intents } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

client.schedule({
  name: "cleanup",
  cron: "@hourly",
  run: async (c) => {
    c.logger.info("hourly cleanup");
    // …purge expired records…
  },
});

async function main(): Promise<void> {
  await client.start();
  console.log("scheduled tasks:", client.scheduler.list().map((t) => t.name));
}

void main();
