---
title: "ContextMenuErrorHandler"
description: "Error hook invoked when a context-menu handler throws."
---

> **ContextMenuErrorHandler** = (`error`, `interaction`, `commandName`) => `Awaitable`\<`void`\>

Defined in: [src/context-menus.ts:96](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L96)

Error hook invoked when a context-menu handler throws.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `Error` |
| `interaction` | `UserContextMenuCommandInteraction` \| `MessageContextMenuCommandInteraction` |
| `commandName` | `string` |

## Returns

`Awaitable`\<`void`\>
