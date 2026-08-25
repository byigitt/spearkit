---
title: "RedisCommands"
description: "Minimal Redis commands used by RedisStore and redisCooldownBackend. Compatible with node-redis:"
---

Defined in: [src/redis-store.ts:29](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L29)

```ts
import { createClient } from "redis";
const redis = createClient();
await redis.connect();
const store = new RedisStore(redis);
```

## Methods

### del()

```ts
del(key: string | readonly string[]): Promise<unknown>;
```

Defined in: [src/redis-store.ts:32](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L32)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` \| readonly `string`[] |

#### Returns

`Promise`\<`unknown`\>

***

### get()

```ts
get(key: string): Promise<string | null>;
```

Defined in: [src/redis-store.ts:30](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L30)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`string` \| `null`\>

***

### keys()

```ts
keys(pattern: string): Promise<string[]>;
```

Defined in: [src/redis-store.ts:33](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L33)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `pattern` | `string` |

#### Returns

`Promise`\<`string`[]\>

***

### pttl()?

```ts
optional pttl(key: string): Promise<number>;
```

Defined in: [src/redis-store.ts:34](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L34)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`number`\>

***

### set()

```ts
set(
   key: string, 
   value: string, 
options?: RedisSetOptions): Promise<unknown>;
```

Defined in: [src/redis-store.ts:31](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L31)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` |
| `options?` | [`RedisSetOptions`](RedisSetOptions) |

#### Returns

`Promise`\<`unknown`\>
