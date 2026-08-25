---
title: "resolveCommandScope()"
description: "Resolve scope metadata into its REST payload form. Throws when guildOnly conflicts with an explicit contexts list."
---

```ts
function resolveCommandScope(meta: CommandScopeMeta): ResolvedCommandScope;
```

Defined in: [src/scope.ts:51](https://github.com/byigitt/spearkit/blob/main/src/scope.ts#L51)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `meta` | [`CommandScopeMeta`](../interfaces/CommandScopeMeta) |

## Returns

[`ResolvedCommandScope`](../interfaces/ResolvedCommandScope)
