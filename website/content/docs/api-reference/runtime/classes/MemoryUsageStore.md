---
title: "MemoryUsageStore"
description: "In-memory store; great for tests and dashboards. Optionally capped."
---

Defined in: [src/usage.ts:167](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L167)

## Implements

- [`BatchUsageStore`](../interfaces/BatchUsageStore)

## Constructors

### Constructor

```ts
new MemoryUsageStore(limit?: number): MemoryUsageStore;
```

Defined in: [src/usage.ts:170](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L170)

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `Number.POSITIVE_INFINITY` |

#### Returns

`MemoryUsageStore`

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [src/usage.ts:186](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L186)

Total recorded events.

##### Returns

`number`

## Methods

### all()

```ts
all(): readonly UsageEvent[];
```

Defined in: [src/usage.ts:181](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L181)

Read every persisted event.

#### Returns

readonly [`UsageEvent`](../interfaces/UsageEvent)[]

#### Implementation of

[`BatchUsageStore`](../interfaces/BatchUsageStore).[`all`](../interfaces/BatchUsageStore#all)

***

### byUser()

```ts
byUser(userId: string): UsageEvent[];
```

Defined in: [src/usage.ts:191](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L191)

Events recorded for a given user id.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

[`UsageEvent`](../interfaces/UsageEvent)[]

***

### clear()

```ts
clear(): void;
```

Defined in: [src/usage.ts:196](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L196)

Forget everything.

#### Returns

`void`

***

### record()

```ts
record(event: UsageEvent): void;
```

Defined in: [src/usage.ts:172](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L172)

Persist one event.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `event` | [`UsageEvent`](../interfaces/UsageEvent) |

#### Returns

`void`

#### Implementation of

[`BatchUsageStore`](../interfaces/BatchUsageStore).[`record`](../interfaces/BatchUsageStore#record)

***

### recordMany()

```ts
recordMany(events: readonly UsageEvent[]): void;
```

Defined in: [src/usage.ts:177](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L177)

Persist several events in one database/file round-trip.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | readonly [`UsageEvent`](../interfaces/UsageEvent)[] |

#### Returns

`void`

#### Implementation of

[`BatchUsageStore`](../interfaces/BatchUsageStore).[`recordMany`](../interfaces/BatchUsageStore#recordmany)
