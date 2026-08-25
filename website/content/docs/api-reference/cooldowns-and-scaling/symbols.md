---
title: "cooldowns-and-scaling"
description: "cooldowns-and-scaling in the spearkit API."
---

## Classes

| Class | Description |
| :------ | :------ |
| [CooldownManager](classes/CooldownManager) | Tracks last-use timestamps and decides whether an action is allowed. One instance is shared on `client.cooldowns`. The default backend is in-memory; pass a store so shards/restarts share the same clock. |
| [MemoryCooldownBackend](classes/MemoryCooldownBackend) | In-process timestamp map — the historical [CooldownManager](classes/CooldownManager) behaviour. |
| [QueueFullError](classes/QueueFullError) | Thrown when a [WorkQueue](classes/WorkQueue) has no remaining waiting capacity. |
| [WorkQueue](classes/WorkQueue) | Bounded concurrency with explicit backpressure. |

## Interfaces

| Interface | Description |
| :------ | :------ |
| [CooldownActor](interfaces/CooldownActor) | The actor a cooldown is evaluated for. |
| [CooldownBackend](interfaces/CooldownBackend) | Pluggable last-hit storage for [CooldownManager](classes/CooldownManager). |
| [CooldownConfig](interfaces/CooldownConfig) | Full cooldown description. |
| [CooldownExemptions](interfaces/CooldownExemptions) | Users and roles that bypass a cooldown entirely. |
| [CooldownOverrides](interfaces/CooldownOverrides) | Per-user and per-role duration overrides (milliseconds; `0` disables). |
| [HealthServerHandle](interfaces/HealthServerHandle) | Running health server. |
| [HealthServerOptions](interfaces/HealthServerOptions) | Options for [startHealthServer](functions/startHealthServer). |
| [ShardEnvironment](interfaces/ShardEnvironment) | Environment read by [shardOptionsFromEnv](functions/shardOptionsFromEnv). |
| [ShardStats](interfaces/ShardStats) | One process/worker's cheap operational snapshot. |
| [ShardStatsReport](interfaces/ShardStatsReport) | Aggregate returned by [fetchShardStats](functions/fetchShardStats). |
| [StartShardsOptions](interfaces/StartShardsOptions) | Options for [startShards](functions/startShards). |
| [WorkQueueOptions](interfaces/WorkQueueOptions) | Options for [WorkQueue](classes/WorkQueue). |

## Type Aliases

| Type Alias | Description |
| :------ | :------ |
| [CooldownInput](type-aliases/CooldownInput) | A `CooldownConfig`, or a bare duration in milliseconds. |
| [CooldownResult](type-aliases/CooldownResult) | Whether an action is allowed now, and if not, how long remains. |
| [CooldownScope](type-aliases/CooldownScope) | What a cooldown is bucketed against. Default `"user"`. |
| [CooldownStoreInput](type-aliases/CooldownStoreInput) | A cooldown backend, or a store wrapped with [keyValueCooldownBackend](functions/keyValueCooldownBackend). |
| [HealthCheck](type-aliases/HealthCheck) | Named readiness probe. |

## Functions

| Function | Description |
| :------ | :------ |
| [effectiveDuration](functions/effectiveDuration) | Resolve the cooldown an actor should serve. `null` means exempt (no cooldown). Otherwise a duration in milliseconds (which may be `0`). |
| [fetchShardStats](functions/fetchShardStats) | Fetch operational snapshots from all locally managed shards. |
| [formatCooldownMessage](functions/formatCooldownMessage) | Build the user-facing message for a blocked action. |
| [keyValueCooldownBackend](functions/keyValueCooldownBackend) | Persist last-hit timestamps in any [KeyValueStore](../storage/interfaces/KeyValueStore). |
| [normalizeCooldown](functions/normalizeCooldown) | Normalise a [CooldownInput](type-aliases/CooldownInput) to a full [CooldownConfig](interfaces/CooldownConfig). |
| [redisCooldownBackend](functions/redisCooldownBackend) | Atomic cooldown clock over Redis `SET key NX PX duration`. |
| [resolveCooldownBackend](functions/resolveCooldownBackend) | Resolve [CooldownStoreInput](type-aliases/CooldownStoreInput) into a [CooldownBackend](interfaces/CooldownBackend). |
| [shardIdForGuild](functions/shardIdForGuild) | Discord's deterministic guild → shard routing formula. |
| [shardListForWorker](functions/shardListForWorker) | Assign shard ids to one worker/replica with round-robin partitioning. |
| [shardOptionsFromEnv](functions/shardOptionsFromEnv) | Convert `SHARD_IDS=0,4,8` + `SHARD_COUNT=12` into `SpearClient` options. |
| [startHealthServer](functions/startHealthServer) | Start dependency-free Kubernetes/container probes: |
| [startShards](functions/startShards) | Spawn a compiled bot entry with discord.js' ShardingManager. |
