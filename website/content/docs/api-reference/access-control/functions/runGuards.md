---
title: "runGuards()"
description: "Run guards in order, short-circuiting on the first denial."
---

> **runGuards**\<`TCtx`\>(`ctx`, `guards`): `Promise`\<[`RunGuardsResult`](../type-aliases/RunGuardsResult)\>

Defined in: [src/guards.ts:52](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L52)

Run guards in order, short-circuiting on the first denial.

## Type Parameters

| Type Parameter |
| :------ |
| `TCtx` *extends* [`GuardContext`](../interfaces/GuardContext) |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `ctx` | `TCtx` |
| `guards` | readonly [`Guard`](../type-aliases/Guard)\<`TCtx`\>[] \| `undefined` |

## Returns

`Promise`\<[`RunGuardsResult`](../type-aliases/RunGuardsResult)\>
