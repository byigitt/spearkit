---
title: "UsageTracker"
description: "Routes each UsageEvent to a store and/or a Discord channel. The client owns one as client.usage. Tracking is fire-and-forget: a slow store or channel never…"
---

Defined in: [src/usage.ts:283](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L283)

Routes each [UsageEvent](../interfaces/UsageEvent) to a store and/or a Discord channel. The
client owns one as `client.usage`. Tracking is fire-and-forget: a slow store
or channel never blocks command handling, and failures are logged.

## Constructors

### Constructor

> **new UsageTracker**(): `UsageTracker`

#### Returns

`UsageTracker`

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-store"></a> `store?` | [`UsageStore`](../interfaces/UsageStore) | The configured store, if any. Directly queryable. |

## Accessors

### enabled

#### Get Signature

> **get** **enabled**(): `boolean`

Defined in: [src/usage.ts:291](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L291)

Whether anything will happen on [track](#track).

##### Returns

`boolean`

## Methods

### reportTo()

> **reportTo**(`channelId`, `format?`): `this`

Defined in: [src/usage.ts:313](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L313)

Mirror events into a Discord channel.

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `channelId` | `string` | `undefined` |
| `format` | (`event`) => `string` | `formatUsage` |

#### Returns

`this`

***

### setLogger()

> **setLogger**(`logger`): `this`

Defined in: [src/usage.ts:301](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L301)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `logger` | [`Logger`](Logger) |

#### Returns

`this`

***

### setStore()

> **setStore**(`store`): `this`

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

> **track**(`event`): `void`

Defined in: [src/usage.ts:319](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L319)

Record a use. Returns immediately; storing/reporting happen in the background.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `event` | [`UsageEvent`](../interfaces/UsageEvent) |

#### Returns

`void`
