---
title: "JsonStore"
description: "File-backed KeyValueStore persisting the whole map as one JSON object. Reads are served from an in-memory cache (loaded once, lazily); writes are serialised…"
---

Defined in: [src/store.ts:85](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L85)

File-backed [KeyValueStore](../interfaces/KeyValueStore) persisting the whole map as one JSON object.
Reads are served from an in-memory cache (loaded once, lazily); writes are
serialised through a queue and committed atomically (temp file + rename) so a
crash mid-write can never corrupt the file.

## Implements

- [`KeyValueStore`](../interfaces/KeyValueStore)

## Constructors

### Constructor

> **new JsonStore**(`path`): `JsonStore`

Defined in: [src/store.ts:90](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L90)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`JsonStore`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [src/store.ts:142](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L142)

Remove every key.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`clear`](../interfaces/KeyValueStore#clear)

***

### delete()

> **delete**(`key`): `Promise`\<`boolean`\>

Defined in: [src/store.ts:132](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L132)

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

Defined in: [src/store.ts:119](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L119)

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

Defined in: [src/store.ts:128](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L128)

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

Defined in: [src/store.ts:138](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L138)

Every key currently stored.

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`keys`](../interfaces/KeyValueStore#keys)

***

### set()

> **set**\<`T`\>(`key`, `value`): `Promise`\<`void`\>

Defined in: [src/store.ts:123](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L123)

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
