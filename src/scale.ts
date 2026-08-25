/**
 * Scaling primitives: gateway shard orchestration, multi-host shard assignment,
 * bounded work queues, shard statistics, and container health endpoints.
 *
 * Small bots need none of this. Large bots opt in without changing command or
 * component definitions.
 */
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import {
  ShardingManager,
  type Awaitable,
  type Client,
  type ClientOptions,
  type MultipleShardSpawnOptions,
  type Shard,
  type ShardingManagerOptions,
} from "discord.js";

/** Options for {@link startShards}. */
export interface StartShardsOptions
  extends Omit<ShardingManagerOptions, "token"> {
  /** Bot token. Falls back to `DISCORD_TOKEN`. */
  token?: string;
  /** Spawn timing; defaults to Discord/discord.js automatic shard count. */
  spawn?: MultipleShardSpawnOptions;
  /** Observe each local child process / worker as it is created. */
  onShardCreate?: (shard: Shard) => void;
}

/**
 * Spawn a compiled bot entry with discord.js' {@link ShardingManager}.
 *
 * This manager is for one machine. For several machines/containers, assign
 * each replica a shard list with {@link shardListForWorker} or
 * {@link shardOptionsFromEnv}.
 */
export async function startShards(
  file: string,
  options: StartShardsOptions = {},
): Promise<ShardingManager> {
  const {
    token = process.env.DISCORD_TOKEN,
    spawn,
    onShardCreate,
    ...managerOptions
  } = options;
  if (token === undefined || token.length === 0) {
    throw new Error(
      "spearkit: startShards() needs a token (pass one or set DISCORD_TOKEN)",
    );
  }
  const manager = new ShardingManager(file, {
    totalShards: "auto",
    respawn: true,
    ...managerOptions,
    token,
  });
  if (onShardCreate !== undefined) {
    manager.on("shardCreate", onShardCreate);
  }
  await manager.spawn(spawn);
  return manager;
}

function positiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`spearkit: ${label} must be a positive integer`);
  }
}

/** Discord's deterministic guild → shard routing formula. */
export function shardIdForGuild(
  guildId: string,
  totalShards: number,
): number {
  positiveInteger(totalShards, "totalShards");
  if (!/^\d{17,20}$/.test(guildId)) {
    throw new Error("spearkit: guildId must be a Discord snowflake");
  }
  return Number((BigInt(guildId) >> 22n) % BigInt(totalShards));
}

/**
 * Assign shard ids to one worker/replica with round-robin partitioning.
 *
 * Every worker must use the same `totalShards` and `workerCount`.
 */
export function shardListForWorker(
  totalShards: number,
  workerIndex: number,
  workerCount: number,
): number[] {
  positiveInteger(totalShards, "totalShards");
  positiveInteger(workerCount, "workerCount");
  if (
    !Number.isInteger(workerIndex) ||
    workerIndex < 0 ||
    workerIndex >= workerCount
  ) {
    throw new RangeError(
      "spearkit: workerIndex must be between 0 and workerCount - 1",
    );
  }
  return Array.from({ length: totalShards }, (_value, shardId) => shardId).filter(
    (shardId) => shardId % workerCount === workerIndex,
  );
}

/** Environment read by {@link shardOptionsFromEnv}. */
export interface ShardEnvironment {
  SHARD_IDS?: string;
  SHARD_COUNT?: string;
}

/**
 * Convert `SHARD_IDS=0,4,8` + `SHARD_COUNT=12` into `SpearClient` options.
 *
 * Returns `{}` when neither variable exists, keeping small-bot startup intact.
 */
export function shardOptionsFromEnv(
  env: ShardEnvironment = process.env,
): Pick<ClientOptions, "shards" | "shardCount"> {
  const ids = env.SHARD_IDS;
  const count = env.SHARD_COUNT;
  if (ids === undefined && count === undefined) return {};
  if (ids === undefined || count === undefined) {
    throw new Error(
      "spearkit: SHARD_IDS and SHARD_COUNT must be configured together",
    );
  }
  const shardCount = Number(count);
  positiveInteger(shardCount, "SHARD_COUNT");
  const shards = ids
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value, index, all) => all.indexOf(value) === index);
  if (
    shards.length === 0 ||
    shards.some(
      (value) =>
        !Number.isInteger(value) || value < 0 || value >= shardCount,
    )
  ) {
    throw new Error(
      "spearkit: SHARD_IDS must be comma-separated ids below SHARD_COUNT",
    );
  }
  return { shards, shardCount };
}

/** One process/worker's cheap operational snapshot. */
export interface ShardStats {
  shardIds: readonly number[];
  guilds: number;
  cachedUsers: number;
  channels: number;
  pingMs: number;
  uptimeMs: number;
  memoryMb: number;
}

/** Aggregate returned by {@link fetchShardStats}. */
export interface ShardStatsReport {
  processes: readonly ShardStats[];
  totals: {
    processes: number;
    shards: number;
    guilds: number;
    cachedUsers: number;
    channels: number;
    memoryMb: number;
  };
}

function currentStats(client: Client): ShardStats {
  return {
    shardIds: client.shard?.ids ?? [0],
    guilds: client.guilds.cache.size,
    cachedUsers: client.users.cache.size,
    channels: client.channels.cache.size,
    pingMs: client.ws.ping,
    uptimeMs: client.uptime ?? 0,
    memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
  };
}

/**
 * Fetch operational snapshots from all locally managed shards.
 *
 * `cachedUsers` is cache cardinality, not a unique global user count.
 */
export async function fetchShardStats(client: Client): Promise<ShardStatsReport> {
  const processes =
    client.shard === null
      ? [currentStats(client)]
      : await client.shard.broadcastEval((shardClient) => ({
          shardIds: shardClient.shard?.ids ?? [0],
          guilds: shardClient.guilds.cache.size,
          cachedUsers: shardClient.users.cache.size,
          channels: shardClient.channels.cache.size,
          pingMs: shardClient.ws.ping,
          uptimeMs: shardClient.uptime ?? 0,
          memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
        }));

  return {
    processes,
    totals: {
      processes: processes.length,
      shards: processes.reduce(
        (total, processStats) => total + processStats.shardIds.length,
        0,
      ),
      guilds: processes.reduce(
        (total, processStats) => total + processStats.guilds,
        0,
      ),
      cachedUsers: processes.reduce(
        (total, processStats) => total + processStats.cachedUsers,
        0,
      ),
      channels: processes.reduce(
        (total, processStats) => total + processStats.channels,
        0,
      ),
      memoryMb: processes.reduce(
        (total, processStats) => total + processStats.memoryMb,
        0,
      ),
    },
  };
}

/** Thrown when a {@link WorkQueue} has no remaining waiting capacity. */
export class QueueFullError extends Error {
  constructor(readonly maxQueued: number) {
    super(`spearkit: work queue is full (${maxQueued} waiting)`);
    this.name = "QueueFullError";
  }
}

interface PendingJob {
  start(): void;
  reject(error: Error): void;
}

/** Options for {@link WorkQueue}. */
export interface WorkQueueOptions {
  /** Jobs running simultaneously. Default 10. */
  concurrency?: number;
  /** Jobs allowed to wait. Default 1000. */
  maxQueued?: number;
}

/**
 * Bounded concurrency with explicit backpressure.
 *
 * Use around database, AI, image-rendering, or third-party API work so a burst
 * queues predictably instead of creating 100k simultaneous promises.
 */
export class WorkQueue {
  private readonly concurrency: number;
  private readonly maxQueued: number;
  private readonly waiting: PendingJob[] = [];
  private readonly idleWaiters: (() => void)[] = [];
  private activeCount = 0;
  private closed = false;

  constructor(options: WorkQueueOptions = {}) {
    this.concurrency = options.concurrency ?? 10;
    this.maxQueued = options.maxQueued ?? 1000;
    positiveInteger(this.concurrency, "WorkQueue concurrency");
    if (!Number.isInteger(this.maxQueued) || this.maxQueued < 0) {
      throw new RangeError(
        "spearkit: WorkQueue maxQueued must be a non-negative integer",
      );
    }
  }

  get active(): number {
    return this.activeCount;
  }

  get queued(): number {
    return this.waiting.length;
  }

  get pending(): number {
    return this.activeCount + this.waiting.length;
  }

  run<T>(job: () => Awaitable<T>): Promise<T> {
    if (this.closed) {
      return Promise.reject(new Error("spearkit: work queue is closed"));
    }
    if (
      this.activeCount >= this.concurrency &&
      this.waiting.length >= this.maxQueued
    ) {
      return Promise.reject(new QueueFullError(this.maxQueued));
    }

    return new Promise<T>((resolve, reject) => {
      const pending: PendingJob = {
        reject,
        start: () => {
          this.activeCount += 1;
          void Promise.resolve()
            .then(job)
            .then(resolve, reject)
            .finally(() => {
              this.activeCount -= 1;
              this.startNext();
            });
        },
      };
      if (this.activeCount < this.concurrency) pending.start();
      else this.waiting.push(pending);
    });
  }

  /** Resolve when all running and queued jobs finish. */
  onIdle(): Promise<void> {
    if (this.pending === 0) return Promise.resolve();
    return new Promise((resolve) => this.idleWaiters.push(resolve));
  }

  /** Reject queued jobs and stop accepting new work; running jobs finish. */
  close(error: Error = new Error("spearkit: work queue closed")): void {
    this.closed = true;
    for (const pending of this.waiting.splice(0)) pending.reject(error);
    this.resolveIdle();
  }

  private startNext(): void {
    const next = this.waiting.shift();
    if (next !== undefined) next.start();
    else this.resolveIdle();
  }

  private resolveIdle(): void {
    if (this.pending !== 0) return;
    for (const resolve of this.idleWaiters.splice(0)) resolve();
  }
}

/** Named readiness probe. */
export type HealthCheck = () => Awaitable<boolean>;

/** Options for {@link startHealthServer}. */
export interface HealthServerOptions {
  /** Bind port. Default 3001; pass 0 in tests. */
  port?: number;
  /** Bind host. Default `"0.0.0.0"`. */
  host?: string;
  /** Optional Discord client; readiness requires `client.isReady()`. */
  client?: Client;
  /** Database/Redis/etc checks included in `/readyz`. */
  checks?: Readonly<Record<string, HealthCheck>>;
}

/** Running health server. */
export interface HealthServerHandle {
  server: Server;
  host: string;
  port: number;
  close(): Promise<void>;
}

/**
 * Start dependency-free Kubernetes/container probes:
 *
 * - `GET /healthz` — process is alive
 * - `GET /readyz` — Discord ready + custom checks
 * - `GET /stats` — cheap local shard/process snapshot
 */
export async function startHealthServer(
  options: HealthServerOptions = {},
): Promise<HealthServerHandle> {
  const host = options.host ?? "0.0.0.0";
  const checks = options.checks ?? {};
  const server = createServer(async (request, response) => {
    response.setHeader("content-type", "application/json; charset=utf-8");
    if (request.method !== "GET") {
      response.statusCode = 405;
      response.end(JSON.stringify({ status: "method-not-allowed" }));
      return;
    }
    if (request.url === "/healthz") {
      response.statusCode = 200;
      response.end(
        JSON.stringify({ status: "ok", uptimeMs: Math.round(process.uptime() * 1000) }),
      );
      return;
    }
    if (request.url === "/stats") {
      response.statusCode = 200;
      response.end(
        JSON.stringify({
          status: "ok",
          process:
            options.client === undefined
              ? undefined
              : currentStats(options.client),
        }),
      );
      return;
    }
    if (request.url !== "/readyz") {
      response.statusCode = 404;
      response.end(JSON.stringify({ status: "not-found" }));
      return;
    }

    const results: Record<string, boolean> = {};
    if (options.client !== undefined) {
      results.discord = options.client.isReady();
    }
    for (const [name, check] of Object.entries(checks)) {
      try {
        results[name] = await check();
      } catch {
        results[name] = false;
      }
    }
    const ready = Object.values(results).every(Boolean);
    response.statusCode = ready ? 200 : 503;
    response.end(JSON.stringify({ status: ready ? "ready" : "not-ready", checks: results }));
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(options.port ?? 3001, host, () => {
      server.off("error", reject);
      resolve();
    });
  });
  const address = server.address() as AddressInfo;
  return {
    server,
    host,
    port: address.port,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error === undefined ? resolve() : reject(error)));
      }),
  };
}
