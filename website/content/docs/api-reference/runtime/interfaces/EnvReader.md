---
title: "EnvReader"
description: "Typed, ergonomic reader over process.env."
---

Defined in: [src/env.ts:123](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L123)

## Methods

### boolean()

#### Call Signature

```ts
boolean(key: string): boolean | undefined;
```

Defined in: [src/env.ts:131](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L131)

A boolean (`true/1/yes/on` vs `false/0/no/off`), or `undefined`/`fallback`.

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

##### Returns

`boolean` \| `undefined`

#### Call Signature

```ts
boolean(key: string, fallback: boolean): boolean;
```

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

```ts
number(key: string): number | undefined;
```

Defined in: [src/env.ts:128](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L128)

A numeric value, or `undefined`/`fallback` when missing or non-numeric.

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

##### Returns

`number` \| `undefined`

#### Call Signature

```ts
number(key: string, fallback: number): number;
```

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

```ts
require(key: string): string;
```

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

```ts
string(key: string): string | undefined;
```

Defined in: [src/env.ts:125](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L125)

A string value (empty strings count as missing), or `undefined`/`fallback`.

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

##### Returns

`string` \| `undefined`

#### Call Signature

```ts
string(key: string, fallback: string): string;
```

Defined in: [src/env.ts:126](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L126)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `fallback` | `string` |

##### Returns

`string`
