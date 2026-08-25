---
title: "EnvReader"
description: "Typed, ergonomic reader over process.env."
---

Defined in: [src/env.ts:123](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L123)

Typed, ergonomic reader over `process.env`.

## Methods

### boolean()

#### Call Signature

> **boolean**(`key`): `boolean` \| `undefined`

Defined in: [src/env.ts:131](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L131)

A boolean (`true/1/yes/on` vs `false/0/no/off`), or `undefined`/`fallback`.

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

##### Returns

`boolean` \| `undefined`

#### Call Signature

> **boolean**(`key`, `fallback`): `boolean`

Defined in: [src/env.ts:132](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L132)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `fallback` | `boolean` |

##### Returns

`boolean`

***

### number()

#### Call Signature

> **number**(`key`): `number` \| `undefined`

Defined in: [src/env.ts:128](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L128)

A numeric value, or `undefined`/`fallback` when missing or non-numeric.

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

##### Returns

`number` \| `undefined`

#### Call Signature

> **number**(`key`, `fallback`): `number`

Defined in: [src/env.ts:129](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L129)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `fallback` | `number` |

##### Returns

`number`

***

### require()

> **require**(`key`): `string`

Defined in: [src/env.ts:134](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L134)

A string value, throwing if the variable is missing or empty.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`string`

***

### string()

#### Call Signature

> **string**(`key`): `string` \| `undefined`

Defined in: [src/env.ts:125](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L125)

A string value (empty strings count as missing), or `undefined`/`fallback`.

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

##### Returns

`string` \| `undefined`

#### Call Signature

> **string**(`key`, `fallback`): `string`

Defined in: [src/env.ts:126](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L126)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `fallback` | `string` |

##### Returns

`string`
