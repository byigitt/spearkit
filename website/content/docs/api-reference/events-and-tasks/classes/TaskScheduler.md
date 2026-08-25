---
title: "TaskScheduler"
description: "Runs ScheduledTasks. The client owns one as client.scheduler, starts it on clientReady and stops it on destroy. Tasks added while running are scheduled immediately."
---

Defined in: [src/scheduler.ts:202](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L202)

## Constructors

### Constructor

```ts
new TaskScheduler(): TaskScheduler;
```

#### Returns

`TaskScheduler`

## Accessors

### active

#### Get Signature

```ts
get active(): boolean;
```

Defined in: [src/scheduler.ts:216](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L216)

Whether the scheduler is currently running.

##### Returns

`boolean`

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [src/scheduler.ts:211](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L211)

Number of registered tasks.

##### Returns

`number`

## Methods

### add()

```ts
add(...tasks: ScheduledTask[]): this;
```

Defined in: [src/scheduler.ts:232](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L232)

Register one or more tasks. If already running, they are scheduled now.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`tasks` | [`ScheduledTask`](../interfaces/ScheduledTask)[] |

#### Returns

`this`

***

### delay()

```ts
delay(
   name: string, 
   ms: number, 
   fn: () => Awaitable<void>): object;
```

Defined in: [src/scheduler.ts:251](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L251)

Schedule a one-shot job: run `fn` once after `ms` milliseconds, then forget.
Returns a cancel handle. Replaces hand-rolled `setTimeout` calls for things
like "remind the moderator in 10 minutes if no claim happened".

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `ms` | `number` |
| `fn` | () => `Awaitable`\<`void`\> |

#### Returns

`object`

| Name | Type |
| :------ | :------ |
| `cancel()` | () => `boolean` |

***

### followUp()

```ts
followUp(
   name: string, 
   delays: readonly number[], 
   fn: (index: number) => Awaitable<void>): object;
```

Defined in: [src/scheduler.ts:278](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L278)

Schedule a series of follow-up fires from a single start point. Each
delay is measured from "now"; the callback receives the index of the
fire. Generalises the 10s/30s/60s retry pattern in real bots.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `delays` | readonly `number`[] |
| `fn` | (`index`: `number`) => `Awaitable`\<`void`\> |

#### Returns

`object`

| Name | Type |
| :------ | :------ |
| `cancel()` | () => `boolean` |

***

### list()

```ts
list(): ScheduledTask[];
```

Defined in: [src/scheduler.ts:221](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L221)

Every registered task.

#### Returns

[`ScheduledTask`](../interfaces/ScheduledTask)[]

***

### reconcile()

```ts
reconcile(name: string, fn: (client: SpearClient) => Awaitable<void>): void;
```

Defined in: [src/scheduler.ts:316](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L316)

Register a once-on-ready reconciler — runs the first time the scheduler
starts (typically when the client becomes ready) and never again. Use
for restart-recovery work like closing orphaned voice sessions or
reapplying cached channel state.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `fn` | (`client`: [`SpearClient`](../../core/classes/SpearClient)) => `Awaitable`\<`void`\> |

#### Returns

`void`

***

### remove()

```ts
remove(name: string): boolean;
```

Defined in: [src/scheduler.ts:241](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L241)

Remove a task and cancel its timer.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`boolean`

***

### setLogger()

```ts
setLogger(logger: Logger): this;
```

Defined in: [src/scheduler.ts:226](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L226)

Attach a logger for task error reporting.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `logger` | [`Logger`](../../runtime/classes/Logger) |

#### Returns

`this`

***

### start()

```ts
start(client: SpearClient): void;
```

Defined in: [src/scheduler.ts:338](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L338)

Start every task. Safe to call once; later calls are ignored.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | [`SpearClient`](../../core/classes/SpearClient) |

#### Returns

`void`

***

### stop()

```ts
stop(): void;
```

Defined in: [src/scheduler.ts:348](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L348)

Stop the scheduler and cancel every pending timer.

#### Returns

`void`
