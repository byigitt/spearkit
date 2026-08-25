---
title: "SubcommandGroup"
description: "A subcommand group created with subcommandGroup."
---

Defined in: [src/commands/command.ts:95](https://github.com/byigitt/spearkit/blob/main/src/commands/command.ts#L95)

A subcommand group created with [subcommandGroup](../functions/subcommandGroup).

## Extends

- [`SubcommandGroupConfig`](SubcommandGroupConfig)

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-description"></a> `description` | `public` | `string` | [`SubcommandGroupConfig`](SubcommandGroupConfig).[`description`](SubcommandGroupConfig#property-description) |
| <a id="property-descriptionlocalizations"></a> `descriptionLocalizations?` | `public` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> | [`SubcommandGroupConfig`](SubcommandGroupConfig).[`descriptionLocalizations`](SubcommandGroupConfig#property-descriptionlocalizations) |
| <a id="property-kind"></a> `kind` | `readonly` | `"group"` | - |
| <a id="property-namelocalizations"></a> `nameLocalizations?` | `public` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> | [`SubcommandGroupConfig`](SubcommandGroupConfig).[`nameLocalizations`](SubcommandGroupConfig#property-namelocalizations) |
| <a id="property-subcommands"></a> `subcommands` | `public` | `Record`\<`string`, [`Subcommand`](Subcommand)\> | [`SubcommandGroupConfig`](SubcommandGroupConfig).[`subcommands`](SubcommandGroupConfig#property-subcommands) |
