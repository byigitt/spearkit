---
title: "startShards()"
description: "Spawn a compiled bot entry with discord.js' ShardingManager."
---

```ts
function startShards(file: string, options?: StartShardsOptions): Promise<ShardingManager>;
```

Defined in: [src/scale.ts:38](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L38)

This manager is for one machine. For several machines/containers, assign
each replica a shard list with [shardListForWorker](shardListForWorker) or
[shardOptionsFromEnv](shardOptionsFromEnv).

## Parameters

| Parameter | Type |
| :------ | :------ |
| `file` | `string` |
| `options` | [`StartShardsOptions`](../interfaces/StartShardsOptions) |

## Returns

`Promise`\<`ShardingManager`\>
