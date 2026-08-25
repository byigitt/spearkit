---
title: "ContextMenuRegistry"
description: "Holds context-menu commands and routes incoming interactions to them."
---

Defined in: [src/context-menus.ts:181](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L181)

Holds context-menu commands and routes incoming interactions to them.

## Constructors

### Constructor

> **new ContextMenuRegistry**(): `ContextMenuRegistry`

#### Returns

`ContextMenuRegistry`

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/context-menus.ts:202](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L202)

Total number of registered context-menu commands.

##### Returns

`number`

## Methods

### add()

> **add**(...`commands`): `this`

Defined in: [src/context-menus.ts:193](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L193)

Register one or more context-menu commands.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`commands` | readonly [`ContextMenuCommand`](../type-aliases/ContextMenuCommand)[] |

#### Returns

`this`

***

### all()

> **all**(): [`ContextMenuCommand`](../type-aliases/ContextMenuCommand)[]

Defined in: [src/context-menus.ts:207](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L207)

Every registered command, both kinds.

#### Returns

[`ContextMenuCommand`](../type-aliases/ContextMenuCommand)[]

***

### handleMessage()

> **handleMessage**(`interaction`): `Promise`\<`void`\>

Defined in: [src/context-menus.ts:257](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L257)

Dispatch a message-target interaction.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `MessageContextMenuCommandInteraction` |

#### Returns

`Promise`\<`void`\>

***

### handleUser()

> **handleUser**(`interaction`): `Promise`\<`void`\>

Defined in: [src/context-menus.ts:250](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L250)

Dispatch a user-target interaction.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `UserContextMenuCommandInteraction` |

#### Returns

`Promise`\<`void`\>

***

### onError()

> **onError**(`handler`): `this`

Defined in: [src/context-menus.ts:244](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L244)

Set the handler used when a context-menu command throws.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `handler` | [`ContextMenuErrorHandler`](../type-aliases/ContextMenuErrorHandler) |

#### Returns

`this`

***

### setAutoDefer()

> **setAutoDefer**(`config?`): `this`

Defined in: [src/context-menus.ts:233](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L233)

Default auto-defer applied to menus that don't set their own.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config?` | [`AutoDeferConfig`](../interfaces/AutoDeferConfig) |

#### Returns

`this`

***

### setCooldowns()

> **setCooldowns**(`manager`, `defaultCooldown?`): `this`

Defined in: [src/context-menus.ts:221](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L221)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `manager` | [`CooldownManager`](../../cooldowns-and-scaling/classes/CooldownManager) |
| `defaultCooldown?` | [`CooldownConfig`](../../cooldowns-and-scaling/interfaces/CooldownConfig) |

#### Returns

`this`

***

### setDefaultGuards()

> **setDefaultGuards**(`guards`): `this`

Defined in: [src/context-menus.ts:227](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L227)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `guards` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] |

#### Returns

`this`

***

### setLogger()

> **setLogger**(`logger`): `this`

Defined in: [src/context-menus.ts:216](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L216)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `logger` | [`Logger`](../../runtime/classes/Logger) |

#### Returns

`this`

***

### setUsageHook()

> **setUsageHook**(`hook`): `this`

Defined in: [src/context-menus.ts:238](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L238)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `hook` | (`event`) => `void` |

#### Returns

`this`

***

### toJSON()

> **toJSON**(): `RESTPostAPIContextMenuApplicationCommandsJSONBody`[]

Defined in: [src/context-menus.ts:212](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L212)

Serialise every command for the REST `applicationCommands` PUT body.

#### Returns

`RESTPostAPIContextMenuApplicationCommandsJSONBody`[]
