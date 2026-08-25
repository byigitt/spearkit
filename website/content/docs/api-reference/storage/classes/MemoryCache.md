---
title: "MemoryCache"
description: "In-memory implementation of CacheStore. Lazy TTL expiration."
---

Defined in: [src/cache.ts:52](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L52)

## Implements

- [`CacheStore`](../interfaces/CacheStore)

## Constructors

### Constructor

```ts
new MemoryCache(): MemoryCache;
```

#### Returns

`MemoryCache`

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [src/cache.ts:56](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L56)

Total number of stored (possibly expired) entries — primarily for tests.

##### Returns

`number`

## Methods

### clear()

```ts
clear(): Promise<void>;
```

Defined in: [src/cache.ts:121](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L121)

Drop every entry.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`CacheStore`](../interfaces/CacheStore).[`clear`](../interfaces/CacheStore#clear)

***

### delete()

```ts
delete(key: string): Promise<boolean>;
```

Defined in: [src/cache.ts:78](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L78)

Remove a key. Resolves to `true` if it existed.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`CacheStore`](../interfaces/CacheStore).[`delete`](../interfaces/CacheStore#delete)

***

### get()

```ts
get<T>(key: string): Promise<T | undefined>;
```

Defined in: [src/cache.ts:60](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L60)

Read a previously set value, or `undefined` if missing/expired.

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`T` \| `undefined`\>

#### Implementation of

[`CacheStore`](../interfaces/CacheStore).[`get`](../interfaces/CacheStore#get)

***

### has()

```ts
has(key: string): Promise<boolean>;
```

Defined in: [src/cache.ts:82](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L82)

Whether a non-expired key is present.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`CacheStore`](../interfaces/CacheStore).[`has`](../interfaces/CacheStore#has)

***

### increment()

```ts
increment(
   key: string, 
   delta?: number, 
options?: CacheSetOptions): Promise<number>;
```

Defined in: [src/cache.ts:86](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L86)

Atomically increment a numeric counter. Returns the new value.

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `key` | `string` | `undefined` |
| `delta` | `number` | `1` |
| `options?` | [`CacheSetOptions`](../interfaces/CacheSetOptions) | `undefined` |

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`CacheStore`](../interfaces/CacheStore).[`increment`](../interfaces/CacheStore#increment)

***

### rateLimit()

```ts
rateLimit(key: string, options: object): Promise<RateLimitResult>;
```

Defined in: [src/cache.ts:102](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L102)

Fixed-window rate limit hit. Atomic per key.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `options` | \{ `limit`: `number`; `windowMs`: `number`; \} |
| `options.limit` | `number` |
| `options.windowMs` | `number` |

#### Returns

`Promise`\<[`RateLimitResult`](../interfaces/RateLimitResult)\>

#### Implementation of

[`CacheStore`](../interfaces/CacheStore).[`rateLimit`](../interfaces/CacheStore#ratelimit)

***

### set()

```ts
set<T>(
   key: string, 
   value: T, 
options?: CacheSetOptions): Promise<void>;
```

Defined in: [src/cache.ts:70](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L70)

Write a value, optionally with a TTL in ms.

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `T` |
| `options?` | [`CacheSetOptions`](../interfaces/CacheSetOptions) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`CacheStore`](../interfaces/CacheStore).[`set`](../interfaces/CacheStore#set)
