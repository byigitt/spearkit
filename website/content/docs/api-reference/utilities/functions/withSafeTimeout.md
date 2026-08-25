---
title: "withSafeTimeout()"
description: "Time-bound an arbitrary promise; resolves to null on timeout or rejection."
---

```ts
function withSafeTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null>;
```

Defined in: [src/safe-fetch.ts:162](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L162)

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
