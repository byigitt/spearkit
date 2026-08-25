---
title: "WorkQueue"
description: "Bounded concurrency with explicit backpressure."
---

Defined in: [src/scale.ts:262](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L262)

Use around database, AI, image-rendering, or third-party API work so a burst
queues predictably instead of creating 100k simultaneous promises.

## Constructors

### Constructor

```ts
new WorkQueue(options?: WorkQueueOptions): WorkQueue;
```

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

```ts
get active(): number;
```

Defined in: [src/scale.ts:281](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L281)

##### Returns

`number`

***

### pending

#### Get Signature

```ts
get pending(): number;
```

Defined in: [src/scale.ts:289](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L289)

##### Returns

`number`

***

### queued

#### Get Signature

```ts
get queued(): number;
```

Defined in: [src/scale.ts:285](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L285)

##### Returns

`number`

## Methods

### close()

```ts
close(error?: Error): void;
```

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

```ts
onIdle(): Promise<void>;
```

Defined in: [src/scale.ts:324](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L324)

Resolve when all running and queued jobs finish.

#### Returns

`Promise`\<`void`\>

***

### run()

```ts
run<T>(job: () => Awaitable<T>): Promise<T>;
```

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
