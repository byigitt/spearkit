---
title: "SubcommandConfig"
description: "Configuration for one subcommand."
---

Defined in: [src/commands/command.ts:66](https://github.com/byigitt/spearkit/blob/main/src/commands/command.ts#L66)

## Type Parameters

| Type Parameter |
| :------ |
| `O` *extends* [`OptionMap`](../type-aliases/OptionMap) |
| `R` |

## Properties

| Property | Type |
| :------ | :------ |
| <a id="property-description"></a> `description` | `string` |
| <a id="property-descriptionlocalizations"></a> `descriptionLocalizations?` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> |
| <a id="property-namelocalizations"></a> `nameLocalizations?` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> |
| <a id="property-options"></a> `options?` | `O` |
| <a id="property-run"></a> `run` | (`ctx`: [`CommandContext`](../classes/CommandContext)\<`O`\>) => `Awaitable`\<`R`\> |
