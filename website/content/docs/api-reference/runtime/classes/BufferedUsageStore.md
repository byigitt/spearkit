---
title: "BufferedUsageStore"
description: "Bounded, batched wrapper for high-volume usage telemetry. Handler dispatch remains fire-and-forget, but one event no longer means one database/file call…"
---

Defined in: [src/usage.ts:84](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L84)

Bounded, batched wrapper for high-volume usage telemetry.

Handler dispatch remains fire-and-forget, but one event no longer means one
database/file call. Downstreams implementing [BatchUsageStore](../interfaces/BatchUsageStore) receive
real bulk writes; other stores are written sequentially inside each batch.

## Implements

- [`UsageStore`](../interfaces/UsageStore)

## Constructors

### Constructor

> **new BufferedUsageStore**(`downstream`, `options?`): `BufferedUsageStore`

Defined in: [src/usage.ts:92](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L92)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `downstream` | [`UsageStore`](../interfaces/UsageStore) |
| `options` | [`BufferedUsageStoreOptions`](../interfaces/BufferedUsageStoreOptions) |

#### Returns

`BufferedUsageStore`

## Accessors

### dropped

#### Get Signature

> **get** **dropped**(): `number`

Defined in: [src/usage.ts:123](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L123)

Total events discarded because the buffer hit `maxBuffered`.

##### Returns

`number`

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/usage.ts:118](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L118)

Events waiting for a downstream write.

##### Returns

`number`

## Methods

### all()

> **all**(): `Promise`\<readonly [`UsageEvent`](../interfaces/UsageEvent)[]\>

Defined in: [src/usage.ts:139](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L139)

Read every persisted event.

#### Returns

`Promise`\<readonly [`UsageEvent`](../interfaces/UsageEvent)[]\>

#### Implementation of

[`UsageStore`](../interfaces/UsageStore).[`all`](../interfaces/UsageStore#all)

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [src/usage.ts:160](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L160)

Stop the timer and flush remaining events.

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [src/usage.ts:145](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L145)

Drain all currently buffered events through serialized batches.

#### Returns

`Promise`\<`void`\>

***

### record()

> **record**(`event`): `void`

Defined in: [src/usage.ts:127](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L127)

Persist one event.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `event` | [`UsageEvent`](../interfaces/UsageEvent) |

#### Returns

`void`

#### Implementation of

[`UsageStore`](../interfaces/UsageStore).[`record`](../interfaces/UsageStore#record)
