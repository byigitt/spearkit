---
title: "BatchUsageStore"
description: "Optional bulk-write extension used by BufferedUsageStore."
---

Defined in: [src/usage.ts:58](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L58)

## Extends

- [`UsageStore`](UsageStore)

## Methods

### all()

```ts
all(): Awaitable<readonly UsageEvent[]>;
```

Defined in: [src/usage.ts:54](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L54)

Read every persisted event.

#### Returns

`Awaitable`\<readonly [`UsageEvent`](UsageEvent)[]\>

#### Inherited from

[`UsageStore`](UsageStore).[`all`](UsageStore#all)

***

### record()

```ts
record(event: UsageEvent): Awaitable<void>;
```

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

```ts
recordMany(events: readonly UsageEvent[]): Awaitable<void>;
```

Defined in: [src/usage.ts:60](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L60)

Persist several events in one database/file round-trip.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | readonly [`UsageEvent`](UsageEvent)[] |

#### Returns

`Awaitable`\<`void`\>
