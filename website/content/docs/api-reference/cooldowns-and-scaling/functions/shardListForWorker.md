---
title: "shardListForWorker()"
description: "Assign shard ids to one worker/replica with round-robin partitioning. Every worker must use the same totalShards and workerCount."
---

> **shardListForWorker**(`totalShards`, `workerIndex`, `workerCount`): `number`[]

Defined in: [src/scale.ts:89](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L89)

Assign shard ids to one worker/replica with round-robin partitioning.

Every worker must use the same `totalShards` and `workerCount`.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `totalShards` | `number` |
| `workerIndex` | `number` |
| `workerCount` | `number` |

## Returns

`number`[]
