# Scaling: one process to many hosts

The same command/component definitions should work in a hobby bot and a large
verified app. Scaling changes the runtime around handlers, not spearkit's
definition API.

User count alone is not a capacity number. Discord Gateway allocation is based
primarily on **guild count and events**, while command concurrency depends on
traffic shape, enabled intents, cache policy, database latency, and handler
cost. “20 million users” may mean a quiet bot in a few large guilds; “100k
simultaneous requests” is a separate load-testing and infrastructure problem.
No library can guarantee either number without measurements.

## Deployment tiers

### 1. Small bot — one process

```ts
const client = new SpearClient();
client.register(...handlers);
await client.start();
```

This remains the default. Do not introduce Redis, queues, or shards before
traffic needs them.

### 2. One machine — ShardingManager

Discord requires sharding at 2,500+ guilds. `startShards` wraps discord.js'
`ShardingManager`, asks Discord for the recommended shard count, respects its
session-start concurrency, and respawns crashed local shards:

```ts
// launcher.ts — run compiled JavaScript
import { startShards } from "spearkit";

await startShards("./dist/bot.js", {
  mode: "process", // strongest fault isolation; "worker" is also supported
  onShardCreate: (shard) => console.log(`Starting shard ${shard.id}`),
});
```

Only the launcher uses `startShards`. `bot.ts` still creates a normal
`SpearClient`.

### 3. Several hosts/containers — explicit shard assignment

A local `ShardingManager` does not coordinate machines. Your scheduler assigns
each replica shard ids and the same total count:

```bash
# replica 0
SHARD_IDS=0,3,6,9 SHARD_COUNT=12 node dist/bot.js

# replica 1
SHARD_IDS=1,4,7,10 SHARD_COUNT=12 node dist/bot.js
```

```ts
const client = new SpearClient({
  ...shardOptionsFromEnv(),
});
```

`shardListForWorker(total, index, workers)` produces those lists.
`shardIdForGuild(guildId, total)` routes guild-specific work to its owner.
Every process must agree on `shardCount`; changing it is a coordinated rollout.

For Kubernetes, a StatefulSet index is a convenient stable `workerIndex`. The
library intentionally does not invent a cross-host process manager; Kubernetes,
Nomad, ECS, systemd, or your platform already owns process placement/restarts.

## Shared state

Handlers should be stateless. Anything that must survive a process or be visible
to another shard belongs outside memory:

- `RedisStore`: tokens, ephemeral state, distributed settings/cache.
- `SqliteStore`: one host and restart durability; **not** a multi-host database.
- PostgreSQL/MySQL: durable relational product data (implement
  `KeyValueStore` only for genuinely key/value data).
- `redisCooldownBackend(redis)`: atomic `SET NX PX` cooldowns across shards.

Do not depend on another shard's discord.js cache. Fetch or route by guild id,
and treat cached user counts as cache cardinality—not unique global users.

## Backpressure

Sharding distributes Gateway traffic; it does not make your database or AI API
infinitely concurrent. Bound expensive work:

```ts
const expensive = new WorkQueue({
  concurrency: 50,
  maxQueued: 5_000,
});

const analyse = command({
  name: "analyse",
  description: "Analyse a file",
  autoDefer: true,
  run: async (ctx) => {
    try {
      const result = await expensive.run(() => analyseFile(ctx.options.file));
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
```

`WorkQueue` gives explicit `active`, `queued`, `pending`, `onIdle()`, and
`close()`. For jobs that must survive restarts, use a real broker/worker system
(BullMQ, SQS, RabbitMQ, Kafka, etc.); spearkit should not choose one in core.

## Health and readiness

Containers need separate liveness and readiness:

```ts
const health = await startHealthServer({
  client,
  port: 3001,
  checks: {
    database: () => db.ping(),
    redis: async () => (await redis.ping()) === "PONG",
  },
});

client.enableGracefulShutdown({
  onShutdown: async () => {
    expensive.close();
    await expensive.onIdle();
    await health.close();
  },
});
```

- `GET /healthz`: process is alive.
- `GET /readyz`: Discord is ready and every custom check passes.
- `GET /stats`: cheap local process/shard snapshot.

Use `fetchShardStats(client)` for a local manager-wide report. It aggregates
guild/channel/cache/memory values with `broadcastEval`; do not put it on a hot
request path.

## Cache and intents

At large scale, memory is often the first bottleneck:

- Request only the Gateway intents the product needs.
- Configure discord.js `makeCache`, sweepers, and partials through
  `SpearClientOptions` (all discord.js options pass through).
- Prefer interaction payload data and zero-fetch permission helpers.
- Avoid enabling `GuildMembers` or `MessageContent` “just in case”.
- Use `safeFetch` when a cache miss is normal.

## Operational rules for high scale

1. Auto-defer slow interactions; Discord still requires acknowledgement within
   roughly three seconds.
2. Keep database pools bounded per process. `shards × poolSize` is the real
   connection count.
3. Batch telemetry/usage writes; never make observability block a handler.
4. Make jobs idempotent. Gateway reconnects and worker retries are normal.
5. Roll shards gradually. Discord's Get Gateway Bot response controls
   `max_concurrency` and identify budgets.
6. Load-test the handler path—including Redis/database/external APIs—not just
   the router.
7. Alert on queue depth, p95/p99 handler duration, event-loop lag, memory,
   reconnects, REST 429s, and readiness failures.

Official references:

- [Discord Gateway sharding](https://docs.discord.com/developers/events/gateway#sharding)
- [Discord session start limits](https://docs.discord.com/developers/events/gateway#session-start-limit-object)
- [discord.js `ShardingManager` 14.21](https://discord.js.org/docs/packages/discord.js/14.21.0/ShardingManager:Class)
- [discord.js `ShardClientUtil` 14.21](https://discord.js.org/docs/packages/discord.js/14.21.0/ShardClientUtil:Class)
