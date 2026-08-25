---
title: "Subcommand"
description: "A type-erased, ready-to-run subcommand created with subcommand."
---

Defined in: [src/commands/command.ts:75](https://github.com/byigitt/spearkit/blob/main/src/commands/command.ts#L75)

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-autocomplete"></a> `autocomplete` | `readonly` | (`interaction`: `AutocompleteInteraction`) => `Promise`\<`void`\> |
| <a id="property-description"></a> `description` | `readonly` | `string` |
| <a id="property-descriptionlocalizations"></a> `descriptionLocalizations?` | `readonly` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> |
| <a id="property-execute"></a> `execute` | `readonly` | (`interaction`: `ChatInputCommandInteraction`) => `Promise`\<`void`\> |
| <a id="property-hasautocomplete"></a> `hasAutocomplete` | `readonly` | `boolean` |
| <a id="property-kind"></a> `kind` | `readonly` | `"subcommand"` |
| <a id="property-namelocalizations"></a> `nameLocalizations?` | `readonly` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> |
| <a id="property-options"></a> `options` | `readonly` | [`OptionMap`](../type-aliases/OptionMap) |
