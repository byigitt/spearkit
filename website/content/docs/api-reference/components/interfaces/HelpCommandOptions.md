---
title: "HelpCommandOptions"
description: "Options for helpCommand."
---

Defined in: [src/help.ts:20](https://github.com/byigitt/spearkit/blob/main/src/help.ts#L20)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-description"></a> `description?` | `string` | Discord command description. |
| <a id="property-ephemeral"></a> `ephemeral?` | `boolean` | Make help visible only to the invoker. Default: true. |
| <a id="property-includecontextmenus"></a> `includeContextMenus?` | `boolean` | Include user/message context menus. Default: true. |
| <a id="property-includeprefix"></a> `includePrefix?` | `boolean` | Include prefix commands. Default: true. |
| <a id="property-name"></a> `name?` | `string` | Slash command name. Default: `"help"`. |
| <a id="property-pagesize"></a> `pageSize?` | `number` | Entries per page. Default: 10. |
| <a id="property-title"></a> `title?` | `string` | Embed title. Default: `"Commands"`. |
| <a id="property-transform"></a> `transform?` | (`entries`: readonly [`HelpEntry`](HelpEntry)[], `ctx`: [`CommandContext`](../../commands/classes/CommandContext)) => \| readonly [`HelpEntry`](HelpEntry)[] \| `Promise`\<readonly [`HelpEntry`](HelpEntry)[]\> | Filter or reorder entries before rendering. |
