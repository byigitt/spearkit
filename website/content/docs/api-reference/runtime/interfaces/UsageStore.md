---
title: "UsageStore"
description: "A pluggable persistence backend for UsageEvents."
---

Defined in: [src/usage.ts:50](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L50)

A pluggable persistence backend for [UsageEvent](UsageEvent)s.

## Extended by

- [`BatchUsageStore`](BatchUsageStore)

## Methods

### all()

> **all**(): `Awaitable`\<readonly [`UsageEvent`](UsageEvent)[]\>

Defined in: [src/usage.ts:54](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L54)

Read every persisted event.

#### Returns

`Awaitable`\<readonly [`UsageEvent`](UsageEvent)[]\>

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
