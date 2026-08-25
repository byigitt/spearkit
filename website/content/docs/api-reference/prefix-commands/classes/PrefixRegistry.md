---
title: "PrefixRegistry"
description: "Holds prefix commands and dispatches matching messages to them."
---

Defined in: [src/prefix.ts:265](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L265)

## Constructors

### Constructor

```ts
new PrefixRegistry(): PrefixRegistry;
```

#### Returns

`PrefixRegistry`

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [src/prefix.ts:338](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L338)

Number of registered commands (excluding aliases).

##### Returns

`number`

## Methods

### add()

```ts
add(...commands: PrefixCommand[]): this;
```

Defined in: [src/prefix.ts:319](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L319)

Register one or more prefix commands (and their aliases).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`commands` | [`PrefixCommand`](../interfaces/PrefixCommand)[] |

#### Returns

`this`

***

### get()

```ts
get(nameOrAlias: string): PrefixCommand | undefined;
```

Defined in: [src/prefix.ts:333](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L333)

Look up a command by name or alias.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `nameOrAlias` | `string` |

#### Returns

[`PrefixCommand`](../interfaces/PrefixCommand) \| `undefined`

***

### handle()

```ts
handle(message: Message): Promise<boolean>;
```

Defined in: [src/prefix.ts:376](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L376)

Parse and dispatch a message. Returns `true` when a command ran (or was
blocked by a cooldown), `false` when the message was not a prefix command.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `Message` |

#### Returns

`Promise`\<`boolean`\>

***

### list()

```ts
list(): PrefixCommand[];
```

Defined in: [src/prefix.ts:343](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L343)

Every registered command.

#### Returns

[`PrefixCommand`](../interfaces/PrefixCommand)[]

***

### onError()

```ts
onError(handler: PrefixErrorHandler): this;
```

Defined in: [src/prefix.ts:313](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L313)

Set the handler used when a prefix command throws.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `handler` | [`PrefixErrorHandler`](../type-aliases/PrefixErrorHandler) |

#### Returns

`this`

***

### setCooldowns()

```ts
setCooldowns(manager: CooldownManager, defaultCooldown?: CooldownConfig): this;
```

Defined in: [src/prefix.ts:300](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L300)

Share a cooldown manager and an optional default cooldown.

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

Defined in: [src/prefix.ts:307](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L307)

Guards that run before every prefix command's own guards.

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

Defined in: [src/prefix.ts:288](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L288)

Attach a logger for dispatch tracing and error reporting.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `logger` | [`Logger`](../../runtime/classes/Logger) |

#### Returns

`this`

***

### setOptions()

```ts
setOptions(input: 
  | string
  | readonly string[]
  | PrefixOptions): this;
```

Defined in: [src/prefix.ts:282](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L282)

Configure prefixes and matching behaviour.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | \| `string` \| readonly `string`[] \| [`PrefixOptions`](../interfaces/PrefixOptions) |

#### Returns

`this`

***

### setUsageHook()

```ts
setUsageHook(hook: (event: UsageEvent) => void): this;
```

Defined in: [src/prefix.ts:294](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L294)

Attach a hook called after each successful prefix command run.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `hook` | (`event`: [`UsageEvent`](../../runtime/interfaces/UsageEvent)) => `void` |

#### Returns

`this`
