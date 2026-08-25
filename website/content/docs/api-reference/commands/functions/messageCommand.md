---
title: "messageCommand()"
description: "Define a message-target (\"Apps → message\") context-menu command."
---

```ts
function messageCommand<R>(config: MessageCommandConfig<R>): MessageContextMenu;
```

Defined in: [src/context-menus.ts:163](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L163)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `R` | `void` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`MessageCommandConfig`](../interfaces/MessageCommandConfig)\<`R`\> |

## Returns

[`MessageContextMenu`](../interfaces/MessageContextMenu)
