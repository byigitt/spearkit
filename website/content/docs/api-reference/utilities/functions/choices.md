---
title: "choices()"
description: "choices() in the spearkit API."
---

## Call Signature

> **choices**\<`T`\>(`map`): `object`[]

Defined in: [src/choices.ts:10](https://github.com/byigitt/spearkit/blob/main/src/choices.ts#L10)

Build `{ name, value }` choices from a display→value map.

### Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* `Record`\<`string`, `string` \| `number`\> |

### Parameters

| Parameter | Type |
| :------ | :------ |
| `map` | `T` |

### Returns

`object`[]

## Call Signature

> **choices**\<`T`\>(...`values`): `object`[]

Defined in: [src/choices.ts:14](https://github.com/byigitt/spearkit/blob/main/src/choices.ts#L14)

Build choices where the Discord name and value are the same string.

### Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* readonly `string`[] |

### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`values` | `T` |

### Returns

`object`[]
