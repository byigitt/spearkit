---
title: "slashMention()"
description: "Chat-input command mention (</name:id>). Subcommands use a space: </play song:123>."
---

```ts
function slashMention(
   name: string, 
   commandId: string, 
   subcommand?: string): string;
```

Defined in: [src/mentions.ts:57](https://github.com/byigitt/spearkit/blob/main/src/mentions.ts#L57)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `commandId` | `string` |
| `subcommand?` | `string` |

## Returns

`string`
