---
title: "OptionDef"
description: "A fully-described slash command option. The two type parameters are phantom markers used purely for compile-time inference of the resolved value: - TValue is the type produced for the command handler. - TRequired controls nullability (true => value, false => | undefined)."
---

Defined in: [src/commands/options.ts:61](https://github.com/byigitt/spearkit/blob/main/src/commands/options.ts#L61)

## Type Parameters

| Type Parameter |
| :------ |
| `TValue` *extends* [`OptionValue`](../type-aliases/OptionValue) |
| `TRequired` *extends* `boolean` |

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-__value"></a> `__value?` | `readonly` | `TValue` | Phantom-only marker. Never populated at runtime. |
| <a id="property-autocomplete"></a> `autocomplete?` | `readonly` | [`AutocompleteHandler`](../type-aliases/AutocompleteHandler)\<`string` \| `number`\> | - |
| <a id="property-channeltypes"></a> `channelTypes?` | `readonly` | readonly `ApplicationCommandOptionAllowedChannelType`[] | - |
| <a id="property-choices"></a> `choices?` | `readonly` | readonly [`OptionChoice`](OptionChoice)\<`string` \| `number`\>[] | - |
| <a id="property-description"></a> `description` | `readonly` | `string` | - |
| <a id="property-descriptionlocalizations"></a> `descriptionLocalizations?` | `readonly` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> | - |
| <a id="property-filetypes"></a> `fileTypes?` | `readonly` | readonly `FileUploadType`[] | - |
| <a id="property-maxlength"></a> `maxLength?` | `readonly` | `number` | - |
| <a id="property-maxvalue"></a> `maxValue?` | `readonly` | `number` | - |
| <a id="property-minlength"></a> `minLength?` | `readonly` | `number` | - |
| <a id="property-minvalue"></a> `minValue?` | `readonly` | `number` | - |
| <a id="property-namelocalizations"></a> `nameLocalizations?` | `readonly` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> | - |
| <a id="property-required"></a> `required` | `readonly` | `TRequired` | - |
| <a id="property-type"></a> `type` | `readonly` | `ApplicationCommandOptionType` | - |
