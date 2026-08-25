---
title: "guard()"
description: "Inline custom predicate; sugar so a one-off check still types as a Guard."
---

```ts
function guard<TCtx>(predicate: Guard<TCtx>): Guard<TCtx>;
```

Defined in: [src/guards.ts:181](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L181)

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
