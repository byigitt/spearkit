---
title: "UsageTracker"
description: "Routes each UsageEvent to a store and/or a Discord channel. The client owns one as client.usage. Tracking is fire-and-forget: a slow store or channel never blocks command handling, and failures are logged."
---

Defined in: [src/usage.ts:283](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L283)

## Constructors

### Constructor

```ts
new UsageTracker(): UsageTracker;
```

#### Returns

`UsageTracker`

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-store"></a> `store?` | [`UsageStore`](../interfaces/UsageStore) | The configured store, if any. Directly queryable. |

## Accessors

### enabled

#### Get Signature

```ts
get enabled(): boolean;
```

Defined in: [src/usage.ts:291](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L291)

Whether anything will happen on [track](#track).

##### Returns

`boolean`

## Methods

### reportTo()

```ts
reportTo(channelId: string, format?: (event: UsageEvent) => string): this;
```

Defined in: [src/usage.ts:313](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L313)

Mirror events into a Discord channel.

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `channelId` | `string` | `undefined` |
| `format` | (`event`: [`UsageEvent`](../interfaces/UsageEvent)) => `string` | `formatUsage` |

#### Returns

`this`

***

### setLogger()

```ts
setLogger(logger: Logger): this;
```

Defined in: [src/usage.ts:301](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L301)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `logger` | [`Logger`](Logger) |

#### Returns

`this`

***

### setStore()

```ts
setStore(store: UsageStore): this;
```

Defined in: [src/usage.ts:307](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L307)

Persist events to a store (a database).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `store` | [`UsageStore`](../interfaces/UsageStore) |

#### Returns

`this`

***

### track()

```ts
track(event: UsageEvent): void;
```

Defined in: [src/usage.ts:319](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L319)

Record a use. Returns immediately; storing/reporting happen in the background.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `event` | [`UsageEvent`](../interfaces/UsageEvent) |

#### Returns

`void`
