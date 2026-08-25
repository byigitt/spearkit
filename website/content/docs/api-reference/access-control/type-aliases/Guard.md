---
title: "Guard"
description: "A precondition evaluated before a handler runs."
---

```ts
type Guard<TCtx> = (ctx: TCtx) => Awaitable<GuardResult>;
```

Defined in: [src/guards.ts:41](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L41)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `TCtx` *extends* [`GuardContext`](../interfaces/GuardContext) | [`GuardContext`](../interfaces/GuardContext) |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `ctx` | `TCtx` |

## Returns

`Awaitable`\<[`GuardResult`](GuardResult)\>
