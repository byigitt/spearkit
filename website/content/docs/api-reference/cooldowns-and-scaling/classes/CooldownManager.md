---
title: "CooldownManager"
description: "Tracks last-use timestamps and decides whether an action is allowed. One instance is shared on client.cooldowns. The default backend is in-memory; pass a store so shards/restarts share the same clock."
---

Defined in: [src/cooldown.ts:279](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L279)

## Constructors

### Constructor

```ts
new CooldownManager(backend?: CooldownStoreInput): CooldownManager;
```

Defined in: [src/cooldown.ts:282](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L282)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `backend?` | [`CooldownStoreInput`](../type-aliases/CooldownStoreInput) |

#### Returns

`CooldownManager`

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [src/cooldown.ts:293](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L293)

Number of tracked buckets when the backend exposes `size`.

##### Returns

`number`

## Methods

### clear()

```ts
clear(): Awaitable<void>;
```

Defined in: [src/cooldown.ts:339](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L339)

Drop every tracked cooldown.

#### Returns

`Awaitable`\<`void`\>

***

### consume()

```ts
consume(
   bucket: string, 
   input: CooldownInput, 
   actor: CooldownActor, 
now?: number): Awaitable<CooldownResult>;
```

Defined in: [src/cooldown.ts:304](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L304)

Check whether `actor` may use `bucket`, recording the use when allowed.
Exempt actors and non-positive durations are always allowed (no record).
Returns a Promise when the backend is async; the in-memory backend stays
synchronous. Dispatch always `await`s this.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `bucket` | `string` |
| `input` | [`CooldownInput`](../type-aliases/CooldownInput) |
| `actor` | [`CooldownActor`](../interfaces/CooldownActor) |
| `now` | `number` |

#### Returns

`Awaitable`\<[`CooldownResult`](../type-aliases/CooldownResult)\>

***

### peek()

```ts
peek(
   bucket: string, 
   input: CooldownInput, 
   actor: CooldownActor, 
now?: number): Awaitable<CooldownResult>;
```

Defined in: [src/cooldown.ts:317](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L317)

Like [consume](#consume) but never records — a read-only check.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `bucket` | `string` |
| `input` | [`CooldownInput`](../type-aliases/CooldownInput) |
| `actor` | [`CooldownActor`](../interfaces/CooldownActor) |
| `now` | `number` |

#### Returns

`Awaitable`\<[`CooldownResult`](../type-aliases/CooldownResult)\>

***

### reset()

```ts
reset(
   bucket: string, 
   actor: CooldownActor, 
scope?: CooldownScope): Awaitable<boolean>;
```

Defined in: [src/cooldown.ts:330](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L330)

Clear a single actor's cooldown for a bucket. Returns whether one existed.

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `bucket` | `string` | `undefined` |
| `actor` | [`CooldownActor`](../interfaces/CooldownActor) | `undefined` |
| `scope` | [`CooldownScope`](../type-aliases/CooldownScope) | `"user"` |

#### Returns

`Awaitable`\<`boolean`\>

***

### setBackend()

```ts
setBackend(backend: CooldownStoreInput): this;
```

Defined in: [src/cooldown.ts:287](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L287)

Swap the persistence backend (tests, late Redis connect).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `backend` | [`CooldownStoreInput`](../type-aliases/CooldownStoreInput) |

#### Returns

`this`
