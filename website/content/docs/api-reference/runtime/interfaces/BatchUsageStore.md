---
title: "BatchUsageStore"
description: "Optional bulk-write extension used by BufferedUsageStore."
---

Defined in: [src/usage.ts:58](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L58)

Optional bulk-write extension used by [BufferedUsageStore](../classes/BufferedUsageStore).

## Extends

- [`UsageStore`](UsageStore)

## Methods

### all()

> **all**(): `Awaitable`\<readonly [`UsageEvent`](UsageEvent)[]\>

Defined in: [src/usage.ts:54](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L54)

Read every persisted event.

#### Returns

`Awaitable`\<readonly [`UsageEvent`](UsageEvent)[]\>

#### Inherited from

[`UsageStore`](UsageStore).[`all`](UsageStore#all)

***

### record()

> **record**(`event`): `Awaitable`\<`void`\>

Defined in: [src/usage.ts:52](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L52)

Persist one event.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `event` | [`UsageEvent`](UsageEvent) |

#### Returns

`Awaitable`\<`void`\>

#### Inherited from

[`UsageStore`](UsageStore).[`record`](UsageStore#record)

***

### recordMany()

> **recordMany**(`events`): `Awaitable`\<`void`\>

Defined in: [src/usage.ts:60](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L60)

Persist several events in one database/file round-trip.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | readonly [`UsageEvent`](UsageEvent)[] |

#### Returns

`Awaitable`\<`void`\>
