---
title: "fetchShardStats()"
description: "Fetch operational snapshots from all locally managed shards. cachedUsers is cache cardinality, not a unique global user count."
---

> **fetchShardStats**(`client`): `Promise`\<[`ShardStatsReport`](../interfaces/ShardStatsReport)\>

Defined in: [src/scale.ts:193](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L193)

Fetch operational snapshots from all locally managed shards.

`cachedUsers` is cache cardinality, not a unique global user count.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `Client` |

## Returns

`Promise`\<[`ShardStatsReport`](../interfaces/ShardStatsReport)\>
