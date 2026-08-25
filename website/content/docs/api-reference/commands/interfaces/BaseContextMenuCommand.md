---
title: "BaseContextMenuCommand"
description: "Common shape for any context-menu command (user or message)."
---

Defined in: [src/context-menus.ts:71](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L71)

Common shape for any context-menu command (user or message).

## Extended by

- [`UserContextMenu`](UserContextMenu)
- [`MessageContextMenu`](MessageContextMenu)

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-autodefer"></a> `autoDefer?` | `readonly` | [`AutoDeferConfig`](AutoDeferConfig) |
| <a id="property-cooldown"></a> `cooldown?` | `readonly` | [`CooldownConfig`](../../cooldowns-and-scaling/interfaces/CooldownConfig) |
| <a id="property-enabled"></a> `enabled` | `readonly` | `boolean` |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] |
| <a id="property-name"></a> `name` | `readonly` | `string` |

## Methods

### toJSON()

> **toJSON**(): `RESTPostAPIContextMenuApplicationCommandsJSONBody`

Defined in: [src/context-menus.ts:77](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L77)

#### Returns

`RESTPostAPIContextMenuApplicationCommandsJSONBody`
