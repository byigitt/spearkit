---
title: "RedisStore"
description: "A minimal async key-value store. Values must be JSON-serialisable. All backends share these semantics so you can develop against MemoryStore and ship with…"
---

Defined in: [src/redis-store.ts:59](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L59)

A minimal async key-value store. Values must be JSON-serialisable. All
backends share these semantics so you can develop against [MemoryStore](MemoryStore)
and ship with [JsonStore](JsonStore) (or your own) without code changes.

## Implements

- [`KeyValueStore`](../interfaces/KeyValueStore)

## Constructors

### Constructor

> **new RedisStore**(`client`): `RedisStore`

Defined in: [src/redis-store.ts:63](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L63)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | [`RedisCommands`](../interfaces/RedisCommands) \| [`RedisStoreOptions`](../interfaces/RedisStoreOptions) |

#### Returns

`RedisStore`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [src/redis-store.ts:100](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L100)

Remove every key.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`clear`](../interfaces/KeyValueStore#clear)

***

### delete()

> **delete**(`key`): `Promise`\<`boolean`\>

Defined in: [src/redis-store.ts:90](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L90)

Remove `key`. Resolves `true` if it existed.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`delete`](../interfaces/KeyValueStore#delete)

***

### get()

> **get**\<`T`\>(`key`): `Promise`\<`T` \| `undefined`\>

Defined in: [src/redis-store.ts:77](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L77)

Resolve the value for `key`, or `undefined` if absent.

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`T` \| `undefined`\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`get`](../interfaces/KeyValueStore#get)

***

### has()

> **has**(`key`): `Promise`\<`boolean`\>

Defined in: [src/redis-store.ts:86](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L86)

Whether `key` currently has a value.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`has`](../interfaces/KeyValueStore#has)

***

### keys()

> **keys**(): `Promise`\<`string`[]\>

Defined in: [src/redis-store.ts:95](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L95)

Every key currently stored.

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`keys`](../interfaces/KeyValueStore#keys)

***

### set()

> **set**\<`T`\>(`key`, `value`): `Promise`\<`void`\>

Defined in: [src/redis-store.ts:82](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L82)

Store `value` under `key`, overwriting any previous value.

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `T` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`set`](../interfaces/KeyValueStore#set)
