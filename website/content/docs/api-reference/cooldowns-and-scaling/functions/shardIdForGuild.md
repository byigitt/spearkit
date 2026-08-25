---
title: "shardIdForGuild()"
description: "Discord's deterministic guild → shard routing formula."
---

```ts
function shardIdForGuild(guildId: string, totalShards: number): number;
```

Defined in: [src/scale.ts:73](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L73)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `guildId` | `string` |
| `totalShards` | `number` |

## Returns

`number`
