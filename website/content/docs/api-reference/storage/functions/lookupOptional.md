---
title: "lookupOptional()"
description: "Build a non-throwing lookup that returns undefined for missing keys."
---

> **lookupOptional**\<`K`, `V`\>(`table`): (`key`) => `V` \| `undefined`

Defined in: [src/config.ts:66](https://github.com/byigitt/spearkit/blob/main/src/config.ts#L66)

Build a non-throwing lookup that returns `undefined` for missing keys.

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

(`key`) => `V` \| `undefined`
