---
title: "resolveCommandScope()"
description: "Resolve scope metadata into its REST payload form. Throws when guildOnly conflicts with an explicit contexts list."
---

> **resolveCommandScope**(`meta`): [`ResolvedCommandScope`](../interfaces/ResolvedCommandScope)

Defined in: [src/scope.ts:51](https://github.com/byigitt/spearkit/blob/main/src/scope.ts#L51)

Resolve scope metadata into its REST payload form. Throws when
`guildOnly` conflicts with an explicit `contexts` list.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `meta` | [`CommandScopeMeta`](../interfaces/CommandScopeMeta) |

## Returns

[`ResolvedCommandScope`](../interfaces/ResolvedCommandScope)
