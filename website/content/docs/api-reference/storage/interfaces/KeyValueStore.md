---
title: "KeyValueStore"
description: "A minimal async key-value store. Values must be JSON-serialisable. All backends share these semantics so you can develop against MemoryStore and ship with JsonStore (or your own) without code changes."
---

Defined in: [src/store.ts:30](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L30)

## Methods

### clear()

```ts
clear(): Promise<void>;
```

Defined in: [src/store.ts:42](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L42)

Remove every key.

#### Returns

`Promise`\<`void`\>

***

### delete()

```ts
delete(key: string): Promise<boolean>;
```

Defined in: [src/store.ts:38](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L38)

Remove `key`. Resolves `true` if it existed.

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

Defined in: [src/store.ts:32](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L32)

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

***

### has()

```ts
has(key: string): Promise<boolean>;
```

Defined in: [src/store.ts:36](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L36)

Whether `key` currently has a value.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`boolean`\>

***

### keys()

```ts
keys(): Promise<string[]>;
```

Defined in: [src/store.ts:40](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L40)

Every key currently stored.

#### Returns

`Promise`\<`string`[]\>

***

### set()

```ts
set<T>(key: string, value: T): Promise<void>;
```

Defined in: [src/store.ts:34](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L34)

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
