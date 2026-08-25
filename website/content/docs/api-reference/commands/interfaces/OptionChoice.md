---
title: "OptionChoice"
description: "A single choice for string/integer/number options."
---

Defined in: [src/commands/options.ts:44](https://github.com/byigitt/spearkit/blob/main/src/commands/options.ts#L44)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `V` *extends* `string` \| `number` | `string` \| `number` |

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-name"></a> `name` | `readonly` | `string` |
| <a id="property-namelocalizations"></a> `nameLocalizations?` | `readonly` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> |
| <a id="property-value"></a> `value` | `readonly` | `V` |
