---
title: "MemoryStore"
description: "In-memory KeyValueStore. Values are deep-cloned on read and write so callers can't accidentally mutate stored state — matching what a persistent backend would…"
---

Defined in: [src/store.ts:56](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L56)

In-memory [KeyValueStore](../interfaces/KeyValueStore). Values are deep-cloned on read and write so
callers can't accidentally mutate stored state — matching what a persistent
backend would do. Ideal for tests and ephemeral data.

## Implements

- [`KeyValueStore`](../interfaces/KeyValueStore)

## Constructors

### Constructor

> **new MemoryStore**(): `MemoryStore`

#### Returns

`MemoryStore`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [src/store.ts:74](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L74)

Remove every key.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`clear`](../interfaces/KeyValueStore#clear)

***

### delete()

> **delete**(`key`): `Promise`\<`boolean`\>

Defined in: [src/store.ts:68](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L68)

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

Defined in: [src/store.ts:59](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L59)

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

Defined in: [src/store.ts:65](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L65)

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

Defined in: [src/store.ts:71](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L71)

Every key currently stored.

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`keys`](../interfaces/KeyValueStore#keys)

***

### set()

> **set**\<`T`\>(`key`, `value`): `Promise`\<`void`\>

Defined in: [src/store.ts:62](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L62)

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
