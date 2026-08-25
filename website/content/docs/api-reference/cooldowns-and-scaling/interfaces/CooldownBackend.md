---
title: "CooldownBackend"
description: "Pluggable last-hit storage for CooldownManager."
---

Defined in: [src/cooldown.ts:115](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L115)

The in-memory backend is the default. Pass a [KeyValueStore](../../storage/interfaces/KeyValueStore) via
[keyValueCooldownBackend](../functions/keyValueCooldownBackend) (SQLite/JSON, restart-safe) or
[redisCooldownBackend](../functions/redisCooldownBackend) (`SET NX PX`, shard-safe) so several processes
share one clock.

## Methods

### clear()

```ts
clear(): Awaitable<void>;
```

Defined in: [src/cooldown.ts:123](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L123)

Drop every tracked key.

#### Returns

`Awaitable`\<`void`\>

***

### delete()

```ts
delete(key: string): Awaitable<boolean>;
```

Defined in: [src/cooldown.ts:121](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L121)

Drop one key. Resolves `true` if it existed.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Awaitable`\<`boolean`\>

***

### hit()

```ts
hit(
   key: string, 
   durationMs: number, 
now: number): Awaitable<CooldownResult>;
```

Defined in: [src/cooldown.ts:117](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L117)

Record a hit unless `key` is still cooling down.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `durationMs` | `number` |
| `now` | `number` |

#### Returns

`Awaitable`\<[`CooldownResult`](../type-aliases/CooldownResult)\>

***

### peek()

```ts
peek(
   key: string, 
   durationMs: number, 
now: number): Awaitable<CooldownResult>;
```

Defined in: [src/cooldown.ts:119](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L119)

Read-only check.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `durationMs` | `number` |
| `now` | `number` |

#### Returns

`Awaitable`\<[`CooldownResult`](../type-aliases/CooldownResult)\>

***

### size()?

```ts
optional size(): Awaitable<number>;
```

Defined in: [src/cooldown.ts:125](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L125)

Number of tracked keys, when cheap to compute.

#### Returns

`Awaitable`\<`number`\>
