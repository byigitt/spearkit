---
title: "buildHelpEntries()"
description: "Collect command metadata from a client without sending anything."
---

> **buildHelpEntries**(`client`, `options?`): [`HelpEntry`](../interfaces/HelpEntry)[]

Defined in: [src/help.ts:43](https://github.com/byigitt/spearkit/blob/main/src/help.ts#L43)

Collect command metadata from a client without sending anything.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `Pick`\<[`SpearClient`](../../core/classes/SpearClient), `"commands"` \| `"prefix"` \| `"contextMenus"`\> |
| `options` | `Pick`\<[`HelpCommandOptions`](../interfaces/HelpCommandOptions), `"includePrefix"` \| `"includeContextMenus"`\> & `object` |

## Returns

[`HelpEntry`](../interfaces/HelpEntry)[]
