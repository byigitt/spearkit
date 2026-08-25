---
title: "buildHelpEntries()"
description: "Collect command metadata from a client without sending anything."
---

```ts
function buildHelpEntries(client: Pick<SpearClient, "commands" | "prefix" | "contextMenus">, options?: Pick<HelpCommandOptions, "includePrefix" | "includeContextMenus"> & object): HelpEntry[];
```

Defined in: [src/help.ts:43](https://github.com/byigitt/spearkit/blob/main/src/help.ts#L43)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `Pick`\<[`SpearClient`](../../core/classes/SpearClient), `"commands"` \| `"prefix"` \| `"contextMenus"`\> |
| `options` | `Pick`\<[`HelpCommandOptions`](../interfaces/HelpCommandOptions), `"includePrefix"` \| `"includeContextMenus"`\> & `object` |

## Returns

[`HelpEntry`](../interfaces/HelpEntry)[]
