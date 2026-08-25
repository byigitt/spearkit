---
title: "SqliteStore"
description: "File- or memory-backed KeyValueStore over node:sqlite."
---

Defined in: [src/sqlite-store.ts:55](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L55)

File- or memory-backed [KeyValueStore](../interfaces/KeyValueStore) over `node:sqlite`.

## Example

```ts
const store = new SqliteStore("data/bot.sqlite");
await store.set("prefix", "?");
```

## Implements

- [`KeyValueStore`](../interfaces/KeyValueStore)

## Constructors

### Constructor

> **new SqliteStore**(`path`): `SqliteStore`

Defined in: [src/sqlite-store.ts:59](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L59)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `path` | `string` \| [`SqliteStoreOptions`](../interfaces/SqliteStoreOptions) |

#### Returns

`SqliteStore`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [src/sqlite-store.ts:103](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L103)

Remove every key.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`clear`](../interfaces/KeyValueStore#clear)

***

### close()

> **close**(): `void`

Defined in: [src/sqlite-store.ts:69](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L69)

Close the underlying database.

#### Returns

`void`

***

### delete()

> **delete**(`key`): `Promise`\<`boolean`\>

Defined in: [src/sqlite-store.ts:93](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L93)

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

Defined in: [src/sqlite-store.ts:73](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L73)

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

Defined in: [src/sqlite-store.ts:88](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L88)

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

Defined in: [src/sqlite-store.ts:98](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L98)

Every key currently stored.

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`keys`](../interfaces/KeyValueStore#keys)

***

### set()

> **set**\<`T`\>(`key`, `value`): `Promise`\<`void`\>

Defined in: [src/sqlite-store.ts:80](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L80)

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
