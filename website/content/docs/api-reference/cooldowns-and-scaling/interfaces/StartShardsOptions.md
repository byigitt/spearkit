---
title: "StartShardsOptions"
description: "Options for startShards."
---

Defined in: [src/scale.ts:21](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L21)

Options for [startShards](../functions/startShards).

## Extends

- `Omit`\<`ShardingManagerOptions`, `"token"`\>

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-onshardcreate"></a> `onShardCreate?` | (`shard`) => `void` | Observe each local child process / worker as it is created. |
| <a id="property-spawn"></a> `spawn?` | `MultipleShardSpawnOptions` | Spawn timing; defaults to Discord/discord.js automatic shard count. |
| <a id="property-token"></a> `token?` | `string` | Bot token. Falls back to `DISCORD_TOKEN`. |
