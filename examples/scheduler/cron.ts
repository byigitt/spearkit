/**
 * Scheduler — cron-scheduled tasks (local time).
 *
 *   DISCORD_TOKEN=... npx tsx examples/scheduler/cron.ts
 */
import { SpearClient, Intents, task, cron } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

// Every day at 03:00 local time.
client.register(
  task({ name: "nightly", cron: "0 3 * * *", run: (c) => c.logger.info("running nightly job") }),
);

// Every 5 minutes.
client.register(task({ name: "poll", cron: "*/5 * * * *", run: () => {} }));

// You can compute the next run without scheduling:
console.log("next nightly run:", cron("0 3 * * *").next(new Date()).toISOString());

async function main(): Promise<void> {
  await client.start();
}

void main();
