---
title: "filterChoices()"
description: "Filter a choice list by the user's current autocomplete query. Empty query returns the first limit items. Matching is case-insensitive and looks at both name…"
---

> **filterChoices**\<`V`\>(`items`, `query`, `options?`): [`OptionChoice`](../../commands/interfaces/OptionChoice)\<`V`\>[]

Defined in: [src/choices.ts:47](https://github.com/byigitt/spearkit/blob/main/src/choices.ts#L47)

Filter a choice list by the user's current autocomplete query.

Empty query returns the first `limit` items. Matching is case-insensitive
and looks at both `name` and `value`.

## Type Parameters

| Type Parameter |
| :------ |
| `V` *extends* `string` \| `number` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `items` | readonly `string`[] \| readonly [`OptionChoice`](../../commands/interfaces/OptionChoice)\<`V`\>[] |
| `query` | `string` |
| `options` | [`FilterChoicesOptions`](../interfaces/FilterChoicesOptions) |

## Returns

[`OptionChoice`](../../commands/interfaces/OptionChoice)\<`V`\>[]
