---
title: "WorkQueue"
description: "Bounded concurrency with explicit backpressure. Use around database, AI, image-rendering, or third-party API work so a burst queues predictably instead of…"
---

Defined in: [src/scale.ts:262](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L262)

Bounded concurrency with explicit backpressure.

Use around database, AI, image-rendering, or third-party API work so a burst
queues predictably instead of creating 100k simultaneous promises.

## Constructors

### Constructor

> **new WorkQueue**(`options?`): `WorkQueue`

Defined in: [src/scale.ts:270](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L270)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`WorkQueueOptions`](../interfaces/WorkQueueOptions) |

#### Returns

`WorkQueue`

## Accessors

### active

#### Get Signature

> **get** **active**(): `number`

Defined in: [src/scale.ts:281](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L281)

##### Returns

`number`

***

### pending

#### Get Signature

> **get** **pending**(): `number`

Defined in: [src/scale.ts:289](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L289)

##### Returns

`number`

***

### queued

#### Get Signature

> **get** **queued**(): `number`

Defined in: [src/scale.ts:285](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L285)

##### Returns

`number`

## Methods

### close()

> **close**(`error?`): `void`

Defined in: [src/scale.ts:330](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L330)

Reject queued jobs and stop accepting new work; running jobs finish.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `Error` |

#### Returns

`void`

***

### onIdle()

> **onIdle**(): `Promise`\<`void`\>

Defined in: [src/scale.ts:324](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L324)

Resolve when all running and queued jobs finish.

#### Returns

`Promise`\<`void`\>

***

### run()

> **run**\<`T`\>(`job`): `Promise`\<`T`\>

Defined in: [src/scale.ts:293](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L293)

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `job` | () => `Awaitable`\<`T`\> |

#### Returns

`Promise`\<`T`\>
