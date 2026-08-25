---
title: "CooldownManager"
description: "Tracks last-use timestamps and decides whether an action is allowed. One instance is shared on client.cooldowns. The default backend is in-memory; pass a store…"
---

Defined in: [src/cooldown.ts:279](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L279)

Tracks last-use timestamps and decides whether an action is allowed.
One instance is shared on `client.cooldowns`. The default backend is
in-memory; pass a store so shards/restarts share the same clock.

## Constructors

### Constructor

> **new CooldownManager**(`backend?`): `CooldownManager`

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

> **get** **size**(): `number`

Defined in: [src/cooldown.ts:293](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L293)

Number of tracked buckets when the backend exposes `size`.

##### Returns

`number`

## Methods

### clear()

> **clear**(): `Awaitable`\<`void`\>

Defined in: [src/cooldown.ts:339](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L339)

Drop every tracked cooldown.

#### Returns

`Awaitable`\<`void`\>

***

### consume()

> **consume**(`bucket`, `input`, `actor`, `now?`): `Awaitable`\<[`CooldownResult`](../type-aliases/CooldownResult)\>

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

> **peek**(`bucket`, `input`, `actor`, `now?`): `Awaitable`\<[`CooldownResult`](../type-aliases/CooldownResult)\>

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

> **reset**(`bucket`, `actor`, `scope?`): `Awaitable`\<`boolean`\>

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

> **setBackend**(`backend`): `this`

Defined in: [src/cooldown.ts:287](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L287)

Swap the persistence backend (tests, late Redis connect).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `backend` | [`CooldownStoreInput`](../type-aliases/CooldownStoreInput) |

#### Returns

`this`
