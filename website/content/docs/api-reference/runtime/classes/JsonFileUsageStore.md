---
title: "JsonFileUsageStore"
description: "File-backed store using newline-delimited JSON (.jsonl). Appends one line per event — durable, human-inspectable, and dependency-free."
---

Defined in: [src/usage.ts:216](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L216)

File-backed store using newline-delimited JSON (`.jsonl`). Appends one line
per event — durable, human-inspectable, and dependency-free.

## Implements

- [`BatchUsageStore`](../interfaces/BatchUsageStore)

## Constructors

### Constructor

> **new JsonFileUsageStore**(`path`): `JsonFileUsageStore`

Defined in: [src/usage.ts:217](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L217)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`JsonFileUsageStore`

## Methods

### all()

> **all**(): `Promise`\<readonly [`UsageEvent`](../interfaces/UsageEvent)[]\>

Defined in: [src/usage.ts:238](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L238)

Read every persisted event.

#### Returns

`Promise`\<readonly [`UsageEvent`](../interfaces/UsageEvent)[]\>

#### Implementation of

[`BatchUsageStore`](../interfaces/BatchUsageStore).[`all`](../interfaces/BatchUsageStore#all)

***

### record()

> **record**(`event`): `Promise`\<`void`\>

Defined in: [src/usage.ts:219](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L219)

Persist one event.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `event` | [`UsageEvent`](../interfaces/UsageEvent) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`BatchUsageStore`](../interfaces/BatchUsageStore).[`record`](../interfaces/BatchUsageStore#record)

***

### recordMany()

> **recordMany**(`events`): `Promise`\<`void`\>

Defined in: [src/usage.ts:223](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L223)

Persist several events in one database/file round-trip.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | readonly [`UsageEvent`](../interfaces/UsageEvent)[] |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`BatchUsageStore`](../interfaces/BatchUsageStore).[`recordMany`](../interfaces/BatchUsageStore#recordmany)
