---
title: "CommandRegistry"
description: "Holds every slash command and routes interactions to them."
---

Defined in: [src/commands/registry.ts:51](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L51)

## Constructors

### Constructor

```ts
new CommandRegistry(): CommandRegistry;
```

#### Returns

`CommandRegistry`

## Accessors

### names

#### Get Signature

```ts
get names(): string[];
```

Defined in: [src/commands/registry.ts:83](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L83)

All registered command names.

##### Returns

`string`[]

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [src/commands/registry.ts:88](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L88)

Number of registered commands.

##### Returns

`number`

## Methods

### add()

```ts
add(...commands: SlashCommand[]): this;
```

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

```ts
all(): SlashCommand[];
```

Defined in: [src/commands/registry.ts:78](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L78)

All registered commands.

#### Returns

[`SlashCommand`](SlashCommand)[]

***

### deploy()

```ts
deploy(options: DeployOptions): Promise<DeployResult>;
```

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

```ts
get(name: string): SlashCommand | undefined;
```

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

```ts
handle(interaction: ChatInputCommandInteraction): Promise<void>;
```

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

```ts
handleAutocomplete(interaction: AutocompleteInteraction): Promise<void>;
```

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

```ts
onError(handler: CommandErrorHandler): this;
```

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

```ts
remove(name: string): boolean;
```

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

```ts
setAutoDefer(config?: AutoDeferConfig): this;
```

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

```ts
setCooldowns(manager: CooldownManager, defaultCooldown?: CooldownConfig): this;
```

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

```ts
setDefaultGuards(guards: readonly Guard[]): this;
```

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

```ts
setLogger(logger: Logger): this;
```

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

```ts
setUsageHook(hook: (event: UsageEvent) => void): this;
```

Defined in: [src/commands/registry.ts:124](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L124)

Attach a hook called after each successful command execution.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `hook` | (`event`: [`UsageEvent`](../../runtime/interfaces/UsageEvent)) => `void` |

#### Returns

`this`

***

### toJSON()

```ts
toJSON(): RESTPostAPIApplicationCommandsJSONBody[];
```

Defined in: [src/commands/registry.ts:130](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L130)

Serialise every command to discord REST payloads.

#### Returns

`RESTPostAPIApplicationCommandsJSONBody`[]
