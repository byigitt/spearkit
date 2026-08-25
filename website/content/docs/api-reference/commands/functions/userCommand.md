---
title: "userCommand()"
description: "Define a user-target (\"Apps → user\") context-menu command."
---

```ts
function userCommand<R>(config: UserCommandConfig<R>): UserContextMenu;
```

Defined in: [src/context-menus.ts:145](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L145)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `R` | `void` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`UserCommandConfig`](../interfaces/UserCommandConfig)\<`R`\> |

## Returns

[`UserContextMenu`](../interfaces/UserContextMenu)
