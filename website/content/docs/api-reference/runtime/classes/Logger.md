---
title: "Logger"
description: "A leveled, scoped logger. Create one directly or read client.logger. child loggers share the parent's threshold and transports, so calling setLevel on any of…"
---

Defined in: [src/logger.ts:178](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L178)

A leveled, scoped logger. Create one directly or read `client.logger`.
[child](#child) loggers share the parent's threshold and transports, so calling
[setLevel](#setlevel) on any of them affects the whole tree.

## Example

```ts
const log = new Logger({ level: "debug", transports: [consoleSink, jsonlSink("./logs/bot.jsonl")] });
log.info("ready", { data: { shard: 0 } });
log.child("commands").error("handler failed", { error });
```

## Constructors

### Constructor

> **new Logger**(`options?`): `Logger`

Defined in: [src/logger.ts:183](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L183)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`LoggerOptions`](../interfaces/LoggerOptions) |

#### Returns

`Logger`

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-scope"></a> `scope?` | `readonly` | `string` | The scope prefix applied to every entry, if any. |

## Accessors

### level

#### Get Signature

> **get** **level**(): [`LogThreshold`](../type-aliases/LogThreshold)

Defined in: [src/logger.ts:192](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L192)

The current minimum threshold.

##### Returns

[`LogThreshold`](../type-aliases/LogThreshold)

## Methods

### addTransport()

> **addTransport**(`sink`): `this`

Defined in: [src/logger.ts:209](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L209)

Append a transport to the existing list.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `sink` | [`LogSink`](../type-aliases/LogSink) |

#### Returns

`this`

***

### child()

> **child**(`scope`): `Logger`

Defined in: [src/logger.ts:220](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L220)

A child logger with an extra scope segment, sharing this logger's state.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `scope` | `string` |

#### Returns

`Logger`

***

### debug()

> **debug**(`message`, `options?`): `void`

Defined in: [src/logger.ts:248](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L248)

Verbose diagnostics, off by default.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `options?` | [`LogOptions`](../interfaces/LogOptions) |

#### Returns

`void`

***

### enabled()

> **enabled**(`level`): `boolean`

Defined in: [src/logger.ts:215](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L215)

Whether an entry of `level` would currently be emitted.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `level` | [`LogLevel`](../type-aliases/LogLevel) |

#### Returns

`boolean`

***

### error()

> **error**(`message`, `options?`): `void`

Defined in: [src/logger.ts:263](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L263)

Failures. Attach the cause via `{ error }`.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `options?` | [`LogOptions`](../interfaces/LogOptions) |

#### Returns

`void`

***

### info()

> **info**(`message`, `options?`): `void`

Defined in: [src/logger.ts:253](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L253)

Normal operational messages.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `options?` | [`LogOptions`](../interfaces/LogOptions) |

#### Returns

`void`

***

### log()

> **log**(`level`, `message`, `options?`): `void`

Defined in: [src/logger.ts:228](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L228)

Emit an entry at an explicit level.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `level` | [`LogLevel`](../type-aliases/LogLevel) |
| `message` | `string` |
| `options?` | [`LogOptions`](../interfaces/LogOptions) |

#### Returns

`void`

***

### setLevel()

> **setLevel**(`level`): `this`

Defined in: [src/logger.ts:197](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L197)

Change the threshold for this logger and every child sharing its state.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `level` | [`LogThreshold`](../type-aliases/LogThreshold) |

#### Returns

`this`

***

### setTransports()

> **setTransports**(`transports`): `this`

Defined in: [src/logger.ts:203](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L203)

Replace the transport list for this logger and every child sharing its state.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `transports` | readonly [`LogSink`](../type-aliases/LogSink)[] |

#### Returns

`this`

***

### warn()

> **warn**(`message`, `options?`): `void`

Defined in: [src/logger.ts:258](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L258)

Recoverable problems worth attention.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `options?` | [`LogOptions`](../interfaces/LogOptions) |

#### Returns

`void`
