---
title: "shardOptionsFromEnv()"
description: "Convert SHARDIDS=0,4,8 + SHARDCOUNT=12 into SpearClient options."
---

```ts
function shardOptionsFromEnv(env?: ShardEnvironment): Pick<ClientOptions, "shards" | "shardCount">;
```

Defined in: [src/scale.ts:121](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L121)

Returns `{}` when neither variable exists, keeping small-bot startup intact.

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `env` | [`ShardEnvironment`](../interfaces/ShardEnvironment) | `process.env` |

## Returns

`Pick`\<`ClientOptions`, `"shards"` \| `"shardCount"`\>
