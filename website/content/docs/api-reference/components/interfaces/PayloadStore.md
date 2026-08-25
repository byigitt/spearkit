---
title: "PayloadStore\\<T\\>"
description: "A token → payload map backed by a KeyValueStore."
---

Defined in: [src/payload.ts:15](https://github.com/byigitt/spearkit/blob/main/src/payload.ts#L15)

A token → payload map backed by a [KeyValueStore](../../storage/interfaces/KeyValueStore).

## Type Parameters

| Type Parameter |
| :------ |
| `T` |

## Methods

### delete()

> **delete**(`token`): `Promise`\<`boolean`\>

Defined in: [src/payload.ts:21](https://github.com/byigitt/spearkit/blob/main/src/payload.ts#L21)

Drop `token`. Resolves `true` if it existed.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `token` | `string` |

#### Returns

`Promise`\<`boolean`\>

***

### get()

> **get**(`token`): `Promise`\<`T` \| `undefined`\>

Defined in: [src/payload.ts:19](https://github.com/byigitt/spearkit/blob/main/src/payload.ts#L19)

Resolve `token`, or `undefined` if missing/expired.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `token` | `string` |

#### Returns

`Promise`\<`T` \| `undefined`\>

***

### put()

> **put**(`value`): `Promise`\<`string`\>

Defined in: [src/payload.ts:17](https://github.com/byigitt/spearkit/blob/main/src/payload.ts#L17)

Persist `value` and return a short opaque token.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`Promise`\<`string`\>
