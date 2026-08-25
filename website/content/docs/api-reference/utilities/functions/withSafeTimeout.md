---
title: "withSafeTimeout()"
description: "Time-bound an arbitrary promise; resolves to null on timeout or rejection."
---

> **withSafeTimeout**\<`T`\>(`promise`, `timeoutMs`): `Promise`\<`T` \| `null`\>

Defined in: [src/safe-fetch.ts:162](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L162)

Time-bound an arbitrary promise; resolves to `null` on timeout or rejection.

## Type Parameters

| Type Parameter |
| :------ |
| `T` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `promise` | `Promise`\<`T`\> |
| `timeoutMs` | `number` |

## Returns

`Promise`\<`T` \| `null`\>
