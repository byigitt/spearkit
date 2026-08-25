---
title: "CacheStore"
description: "A swappable cache backend. All operations are async to allow remote stores."
---

Defined in: [src/cache.ts:29](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L29)

## Methods

### clear()

```ts
clear(): Promise<void>;
```

Defined in: [src/cache.ts:43](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L43)

Drop every entry.

#### Returns

`Promise`\<`void`\>

***

### delete()

```ts
delete(key: string): Promise<boolean>;
```

Defined in: [src/cache.ts:35](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L35)

Remove a key. Resolves to `true` if it existed.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`boolean`\>

***

### get()

```ts
get<T>(key: string): Promise<T | undefined>;
```

Defined in: [src/cache.ts:31](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L31)

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

***

### has()

```ts
has(key: string): Promise<boolean>;
```

Defined in: [src/cache.ts:37](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L37)

Whether a non-expired key is present.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`boolean`\>

***

### increment()

```ts
increment(
   key: string, 
   delta?: number, 
options?: CacheSetOptions): Promise<number>;
```

Defined in: [src/cache.ts:39](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L39)

Atomically increment a numeric counter. Returns the new value.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `delta?` | `number` |
| `options?` | [`CacheSetOptions`](CacheSetOptions) |

#### Returns

`Promise`\<`number`\>

***

### rateLimit()

```ts
rateLimit(key: string, options: object): Promise<RateLimitResult>;
```

Defined in: [src/cache.ts:41](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L41)

Fixed-window rate limit hit. Atomic per key.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `options` | \{ `limit`: `number`; `windowMs`: `number`; \} |
| `options.limit` | `number` |
| `options.windowMs` | `number` |

#### Returns

`Promise`\<[`RateLimitResult`](RateLimitResult)\>

***

### set()

```ts
set<T>(
   key: string, 
   value: T, 
options?: CacheSetOptions): Promise<void>;
```

Defined in: [src/cache.ts:33](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L33)

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
| `options?` | [`CacheSetOptions`](CacheSetOptions) |

#### Returns

`Promise`\<`void`\>
