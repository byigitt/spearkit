---
title: "ContextMenuErrorHandler"
description: "Error hook invoked when a context-menu handler throws."
---

```ts
type ContextMenuErrorHandler = (error: Error, interaction: 
  | UserContextMenuCommandInteraction
| MessageContextMenuCommandInteraction, commandName: string) => Awaitable<void>;
```

Defined in: [src/context-menus.ts:96](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L96)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `Error` |
| `interaction` | \| `UserContextMenuCommandInteraction` \| `MessageContextMenuCommandInteraction` |
| `commandName` | `string` |

## Returns

`Awaitable`\<`void`\>
