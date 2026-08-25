---
title: "SubcommandGroupConfig"
description: "Configuration for a subcommand group (a folder of subcommands)."
---

Defined in: [src/commands/command.ts:87](https://github.com/byigitt/spearkit/blob/main/src/commands/command.ts#L87)

Configuration for a subcommand group (a folder of subcommands).

## Extended by

- [`SubcommandGroup`](SubcommandGroup)

## Properties

| Property | Type |
| :------ | :------ |
| <a id="property-description"></a> `description` | `string` |
| <a id="property-descriptionlocalizations"></a> `descriptionLocalizations?` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> |
| <a id="property-namelocalizations"></a> `nameLocalizations?` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> |
| <a id="property-subcommands"></a> `subcommands` | `Record`\<`string`, [`Subcommand`](Subcommand)\> |
