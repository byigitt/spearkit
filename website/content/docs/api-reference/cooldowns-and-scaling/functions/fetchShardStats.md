---
title: "fetchShardStats()"
description: "Fetch operational snapshots from all locally managed shards."
---

```ts
function fetchShardStats(client: Client): Promise<ShardStatsReport>;
```

Defined in: [src/scale.ts:193](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L193)

`cachedUsers` is cache cardinality, not a unique global user count.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `Client` |

## Returns

`Promise`\<[`ShardStatsReport`](../interfaces/ShardStatsReport)\>
