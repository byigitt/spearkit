---
title: "MessageContextMenu"
description: "A message-target context-menu command."
---

Defined in: [src/context-menus.ts:87](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L87)

A message-target context-menu command.

## Extends

- [`BaseContextMenuCommand`](BaseContextMenuCommand)

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-autodefer"></a> `autoDefer?` | `readonly` | [`AutoDeferConfig`](AutoDeferConfig) | [`BaseContextMenuCommand`](BaseContextMenuCommand).[`autoDefer`](BaseContextMenuCommand#property-autodefer) |
| <a id="property-cooldown"></a> `cooldown?` | `readonly` | [`CooldownConfig`](../../cooldowns-and-scaling/interfaces/CooldownConfig) | [`BaseContextMenuCommand`](BaseContextMenuCommand).[`cooldown`](BaseContextMenuCommand#property-cooldown) |
| <a id="property-enabled"></a> `enabled` | `readonly` | `boolean` | [`BaseContextMenuCommand`](BaseContextMenuCommand).[`enabled`](BaseContextMenuCommand#property-enabled) |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | [`BaseContextMenuCommand`](BaseContextMenuCommand).[`guards`](BaseContextMenuCommand#property-guards) |
| <a id="property-kind"></a> `kind` | `readonly` | `"messageMenu"` | - |
| <a id="property-name"></a> `name` | `readonly` | `string` | [`BaseContextMenuCommand`](BaseContextMenuCommand).[`name`](BaseContextMenuCommand#property-name) |

## Methods

### execute()

> **execute**(`interaction`): `Promise`\<`void`\>

Defined in: [src/context-menus.ts:89](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L89)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `MessageContextMenuCommandInteraction` |

#### Returns

`Promise`\<`void`\>

***

### toJSON()

> **toJSON**(): `RESTPostAPIContextMenuApplicationCommandsJSONBody`

Defined in: [src/context-menus.ts:77](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L77)

#### Returns

`RESTPostAPIContextMenuApplicationCommandsJSONBody`

#### Inherited from

[`BaseContextMenuCommand`](BaseContextMenuCommand).[`toJSON`](BaseContextMenuCommand#tojson)
