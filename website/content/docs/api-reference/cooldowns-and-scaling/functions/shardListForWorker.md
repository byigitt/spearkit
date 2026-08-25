---
title: "shardListForWorker()"
description: "Assign shard ids to one worker/replica with round-robin partitioning."
---

```ts
function shardListForWorker(
   totalShards: number, 
   workerIndex: number, 
   workerCount: number): number[];
```

Defined in: [src/scale.ts:89](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L89)

Every worker must use the same `totalShards` and `workerCount`.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `totalShards` | `number` |
| `workerIndex` | `number` |
| `workerCount` | `number` |

## Returns

`number`[]
