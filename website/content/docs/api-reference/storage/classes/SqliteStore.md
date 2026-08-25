---
title: "SqliteStore"
description: "File- or memory-backed KeyValueStore over node:sqlite."
---

Defined in: [src/sqlite-store.ts:55](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L55)

## Example

```ts
const store = new SqliteStore("data/bot.sqlite");
await store.set("prefix", "?");
```

## Implements

- [`KeyValueStore`](../interfaces/KeyValueStore)

## Constructors

### Constructor

```ts
new SqliteStore(path: string | SqliteStoreOptions): SqliteStore;
```

Defined in: [src/sqlite-store.ts:59](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L59)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `path` | `string` \| [`SqliteStoreOptions`](../interfaces/SqliteStoreOptions) |

#### Returns

`SqliteStore`

## Methods

### clear()

```ts
clear(): Promise<void>;
```

Defined in: [src/sqlite-store.ts:103](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L103)

Remove every key.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`clear`](../interfaces/KeyValueStore#clear)

***

### close()

```ts
close(): void;
```

Defined in: [src/sqlite-store.ts:69](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L69)

Close the underlying database.

#### Returns

`void`

***

### delete()

```ts
delete(key: string): Promise<boolean>;
```

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

```ts
get<T>(key: string): Promise<T | undefined>;
```

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

```ts
has(key: string): Promise<boolean>;
```

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

```ts
keys(): Promise<string[]>;
```

Defined in: [src/sqlite-store.ts:98](https://github.com/byigitt/spearkit/blob/main/src/sqlite-store.ts#L98)

Every key currently stored.

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`KeyValueStore`](../interfaces/KeyValueStore).[`keys`](../interfaces/KeyValueStore#keys)

***

### set()

```ts
set<T>(key: string, value: T): Promise<void>;
```

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
