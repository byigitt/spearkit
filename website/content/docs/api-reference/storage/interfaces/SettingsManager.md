---
title: "SettingsManager"
description: "A typed settings accessor returned by createSettings."
---

Defined in: [src/store.ts:170](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L170)

## Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* `Record`\<`string`, `unknown`\> |

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-defaults"></a> `defaults` | `readonly` | `T` | The defaults merged into every [get](#get). |
| <a id="property-store"></a> `store` | `readonly` | [`KeyValueStore`](KeyValueStore) | The underlying store. |

## Methods

### get()

```ts
get(id: string): Promise<T>;
```

Defined in: [src/store.ts:176](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L176)

Read `id`'s settings, always fully populated from [defaults](#property-defaults).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`T`\>

***

### reset()

```ts
reset(id: string): Promise<void>;
```

Defined in: [src/store.ts:180](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L180)

Restore `id` to defaults by removing its stored overrides.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`void`\>

***

### set()

```ts
set(id: string, patch: Partial<T>): Promise<T>;
```

Defined in: [src/store.ts:178](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L178)

Shallow-merge `patch` into `id`'s stored settings and persist; returns the merged result.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `id` | `string` |
| `patch` | `Partial`\<`T`\> |

#### Returns

`Promise`\<`T`\>
