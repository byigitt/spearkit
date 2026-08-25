import { Client, GatewayIntentBits } from "discord.js";
import { describe, expect, it } from "vitest";
import {
  QueueFullError,
  WorkQueue,
  fetchShardStats,
  shardIdForGuild,
  shardListForWorker,
  shardOptionsFromEnv,
  startHealthServer,
} from "../src/scale.js";

describe("shard helpers", () => {
  it("routes a guild with Discord's snowflake formula", () => {
    const guildId = "81384788765712384";
    expect(shardIdForGuild(guildId, 16)).toBe(
      Number((BigInt(guildId) >> 22n) % 16n),
    );
  });

  it("partitions every shard exactly once across workers", () => {
    const lists = Array.from({ length: 3 }, (_value, worker) =>
      shardListForWorker(10, worker, 3),
    );
    expect(lists.flat().sort((a, b) => a - b)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
    expect(new Set(lists.flat()).size).toBe(10);
  });

  it("parses multi-host shard assignment from env", () => {
    expect(
      shardOptionsFromEnv({ SHARD_IDS: "0,4,8", SHARD_COUNT: "12" }),
    ).toEqual({ shards: [0, 4, 8], shardCount: 12 });
    expect(shardOptionsFromEnv({})).toEqual({});
    expect(() => shardOptionsFromEnv({ SHARD_COUNT: "12" })).toThrow(
      /together/,
    );
  });
});

describe("WorkQueue", () => {
  it("bounds concurrency and resolves idle", async () => {
    const queue = new WorkQueue({ concurrency: 2, maxQueued: 4 });
    let active = 0;
    let peak = 0;
    const releases: (() => void)[] = [];
    const jobs = Array.from({ length: 6 }, (_value, index) =>
      queue.run(
        () =>
          new Promise<number>((resolve) => {
            active += 1;
            peak = Math.max(peak, active);
            releases.push(() => {
              active -= 1;
              resolve(index);
            });
          }),
      ),
    );

    expect(queue.active).toBe(2);
    expect(queue.queued).toBe(4);
    while (releases.length > 0 || queue.pending > 0) {
      const release = releases.shift();
      if (release !== undefined) release();
      await Promise.resolve();
    }
    await queue.onIdle();
    expect(await Promise.all(jobs)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(peak).toBe(2);
  });

  it("rejects overflow instead of growing without bound", async () => {
    const queue = new WorkQueue({ concurrency: 1, maxQueued: 0 });
    let release!: () => void;
    const running = queue.run(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    );
    await expect(queue.run(() => undefined)).rejects.toBeInstanceOf(
      QueueFullError,
    );
    release();
    await running;
  });
});

describe("operational helpers", () => {
  it("reports unsharded client stats", async () => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    const report = await fetchShardStats(client);
    expect(report.totals.processes).toBe(1);
    expect(report.totals.shards).toBe(1);
    await client.destroy();
  });

  it("serves liveness and readiness endpoints", async () => {
    const health = await startHealthServer({
      host: "127.0.0.1",
      port: 0,
      checks: { database: () => true, redis: async () => false },
    });
    const base = `http://${health.host}:${health.port}`;
    const live = await fetch(`${base}/healthz`);
    expect(live.status).toBe(200);
    const ready = await fetch(`${base}/readyz`);
    expect(ready.status).toBe(503);
    expect(await ready.json()).toEqual({
      status: "not-ready",
      checks: { database: true, redis: false },
    });
    await health.close();
  });
});
