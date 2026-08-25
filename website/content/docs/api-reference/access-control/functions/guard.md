---
title: "guard()"
description: "Inline custom predicate; sugar so a one-off check still types as a Guard."
---

> **guard**\<`TCtx`\>(`predicate`): [`Guard`](../type-aliases/Guard)\<`TCtx`\>

Defined in: [src/guards.ts:181](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L181)

Inline custom predicate; sugar so a one-off check still types as a Guard.

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `TCtx` *extends* [`GuardContext`](../interfaces/GuardContext) | [`GuardContext`](../interfaces/GuardContext) |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `predicate` | [`Guard`](../type-aliases/Guard)\<`TCtx`\> |

## Returns

[`Guard`](../type-aliases/Guard)\<`TCtx`\>
