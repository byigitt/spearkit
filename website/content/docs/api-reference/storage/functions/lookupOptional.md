---
title: "lookupOptional()"
description: "Build a non-throwing lookup that returns undefined for missing keys."
---

```ts
function lookupOptional<K, V>(table: Readonly<Record<K, V>>): (key: K) => V | undefined;
```

Defined in: [src/config.ts:66](https://github.com/byigitt/spearkit/blob/main/src/config.ts#L66)

## Type Parameters

| Type Parameter |
| :------ |
| `K` *extends* `string` |
| `V` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `table` | `Readonly`\<`Record`\<`K`, `V`\>\> |

## Returns

(`key`: `K`) => `V` \| `undefined`
