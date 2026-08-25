---
title: "CommandRegistry"
description: "Holds every slash command and routes interactions to them."
---

Defined in: [src/commands/registry.ts:51](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L51)

Holds every slash command and routes interactions to them.

## Constructors

### Constructor

> **new CommandRegistry**(): `CommandRegistry`

#### Returns

`CommandRegistry`

## Accessors

### names

#### Get Signature

> **get** **names**(): `string`[]

Defined in: [src/commands/registry.ts:83](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L83)

All registered command names.

##### Returns

`string`[]

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/commands/registry.ts:88](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L88)

Number of registered commands.

##### Returns

`number`

## Methods

### add()

> **add**(...`commands`): `this`

Defined in: [src/commands/registry.ts:62](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L62)

Register one or more commands. Later registrations override by name.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`commands` | [`SlashCommand`](SlashCommand)[] |

#### Returns

`this`

***

### all()

> **all**(): [`SlashCommand`](SlashCommand)[]

Defined in: [src/commands/registry.ts:78](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L78)

All registered commands.

#### Returns

[`SlashCommand`](SlashCommand)[]

***

### deploy()

> **deploy**(`options`): `Promise`\<[`DeployResult`](../type-aliases/DeployResult)\>

Defined in: [src/commands/registry.ts:221](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L221)

Push the registered commands to discord. Returns the API response.

Guild deploys apply instantly and are ideal during development; global
deploys can take up to an hour to propagate.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`DeployOptions`](../interfaces/DeployOptions) |

#### Returns

`Promise`\<[`DeployResult`](../type-aliases/DeployResult)\>

***

### get()

> **get**(`name`): [`SlashCommand`](SlashCommand) \| `undefined`

Defined in: [src/commands/registry.ts:73](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L73)

Look up a command by name.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`SlashCommand`](SlashCommand) \| `undefined`

***

### handle()

> **handle**(`interaction`): `Promise`\<`void`\>

Defined in: [src/commands/registry.ts:135](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L135)

Dispatch an incoming chat-input interaction to its command.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `ChatInputCommandInteraction` |

#### Returns

`Promise`\<`void`\>

***

### handleAutocomplete()

> **handleAutocomplete**(`interaction`): `Promise`\<`void`\>

Defined in: [src/commands/registry.ts:205](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L205)

Dispatch an autocomplete interaction to its command.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `AutocompleteInteraction` |

#### Returns

`Promise`\<`void`\>

***

### onError()

> **onError**(`handler`): `this`

Defined in: [src/commands/registry.ts:93](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L93)

Set the handler used when a command throws.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `handler` | [`CommandErrorHandler`](../type-aliases/CommandErrorHandler) |

#### Returns

`this`

***

### remove()

> **remove**(`name`): `boolean`

Defined in: [src/commands/registry.ts:68](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L68)

Remove a command by name.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`boolean`

***

### setAutoDefer()

> **setAutoDefer**(`config?`): `this`

Defined in: [src/commands/registry.ts:118](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L118)

Default auto-defer applied to commands that don't set their own.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config?` | [`AutoDeferConfig`](../interfaces/AutoDeferConfig) |

#### Returns

`this`

***

### setCooldowns()

> **setCooldowns**(`manager`, `defaultCooldown?`): `this`

Defined in: [src/commands/registry.ts:105](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L105)

Wire a shared cooldown manager and an optional default cooldown for every command.

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

Defined in: [src/commands/registry.ts:112](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L112)

Guards that run before every command's own guards.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `guards` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] |

#### Returns

`this`

***

### setLogger()

> **setLogger**(`logger`): `this`

Defined in: [src/commands/registry.ts:99](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L99)

Attach a logger used for dispatch tracing (debug level).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `logger` | [`Logger`](../../runtime/classes/Logger) |

#### Returns

`this`

***

### setUsageHook()

> **setUsageHook**(`hook`): `this`

Defined in: [src/commands/registry.ts:124](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L124)

Attach a hook called after each successful command execution.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `hook` | (`event`) => `void` |

#### Returns

`this`

***

### toJSON()

> **toJSON**(): `RESTPostAPIApplicationCommandsJSONBody`[]

Defined in: [src/commands/registry.ts:130](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L130)

Serialise every command to discord REST payloads.

#### Returns

`RESTPostAPIApplicationCommandsJSONBody`[]
