/**
 * Multi-host shard assignment + backpressure.
 *
 * Set SHARD_IDS and SHARD_COUNT together in each container. With neither set,
 * this is still an ordinary single-process bot.
 */
import {
  Intents,
  QueueFullError,
  SpearClient,
  WorkQueue,
  command,
  shardOptionsFromEnv,
} from "spearkit";

export const expensiveWork = new WorkQueue({
  concurrency: 50,
  maxQueued: 5_000,
});

export const client = new SpearClient({
  intents: Intents.default,
  ...shardOptionsFromEnv(),
  autoDefer: true,
});

export const analyse = command({
  name: "analyse",
  description: "Run bounded expensive work",
  run: async (ctx) => {
    try {
      const result = await expensiveWork.run(async () => "Analysis complete.");
      await ctx.send(result);
    } catch (error) {
      if (error instanceof QueueFullError) {
        await ctx.error("Busy right now — try again shortly.");
        return;
      }
      throw error;
    }
  },
});

client.register(analyse);
