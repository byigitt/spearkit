---
title: "PrefixArgsBuilder\\<TShape\\>"
description: "Build a typed argument schema for prefixCommand. Chain calls positionally — first token → first arg, second → second arg, etc."
---

Defined in: [src/prefix-args.ts:106](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L106)

Build a typed argument schema for [prefixCommand](../functions/prefixCommand). Chain calls
positionally — first token → first arg, second → second arg, etc.

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `TShape` *extends* `Record`\<`string`, `unknown`\> | `object` |

## Methods

### boolean()

> **boolean**\<`K`, `Req`\>(`name`, `options?`): `PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `boolean`, `Req`\>\>

Defined in: [src/prefix-args.ts:139](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L139)

A boolean (`true`/`yes`/`1`/`on` vs `false`/`no`/`0`/`off`).

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `K` *extends* `string` | - |
| `Req` *extends* `boolean` | `false` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `K` |
| `options?` | `BooleanOpts` & `object` |

#### Returns

`PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `boolean`, `Req`\>\>

***

### compile()

> **compile**(): [`PrefixArgsParser`](../interfaces/PrefixArgsParser)\<`TShape`\>

Defined in: [src/prefix-args.ts:175](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L175)

Compile this builder into a parser.

#### Returns

[`PrefixArgsParser`](../interfaces/PrefixArgsParser)\<`TShape`\>

***

### duration()

> **duration**\<`K`, `Req`\>(`name`, `options?`): `PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `number`, `Req`\>\>

Defined in: [src/prefix-args.ts:155](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L155)

A duration like `"1h30m"` or `"1 saat"` parsed to milliseconds.

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `K` *extends* `string` | - |
| `Req` *extends* `boolean` | `false` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `K` |
| `options?` | `BaseOpts` & `object` |

#### Returns

`PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `number`, `Req`\>\>

***

### integer()

> **integer**\<`K`, `Req`\>(`name`, `options?`): `PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `number`, `Req`\>\>

Defined in: [src/prefix-args.ts:123](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L123)

A whole integer.

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `K` *extends* `string` | - |
| `Req` *extends* `boolean` | `false` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `K` |
| `options?` | `NumericOpts` & `object` |

#### Returns

`PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `number`, `Req`\>\>

***

### number()

> **number**\<`K`, `Req`\>(`name`, `options?`): `PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `number`, `Req`\>\>

Defined in: [src/prefix-args.ts:131](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L131)

A floating-point number.

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `K` *extends* `string` | - |
| `Req` *extends* `boolean` | `false` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `K` |
| `options?` | `NumericOpts` & `object` |

#### Returns

`PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `number`, `Req`\>\>

***

### rest()

> **rest**\<`K`, `Req`\>(`name`, `options?`): `PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `string`, `Req`\>\>

Defined in: [src/prefix-args.ts:163](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L163)

The remainder of the message (everything after previous args).

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `K` *extends* `string` | - |
| `Req` *extends* `boolean` | `false` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `K` |
| `options?` | `RestOpts` & `object` |

#### Returns

`PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `string`, `Req`\>\>

***

### snowflake()

> **snowflake**\<`K`, `Req`\>(`name`, `options?`): `PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `string`, `Req`\>\>

Defined in: [src/prefix-args.ts:147](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L147)

A Discord snowflake id — accepts raw ids and `<@u>` / `<#c>` / `<@&r>` mentions.

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `K` *extends* `string` | - |
| `Req` *extends* `boolean` | `false` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `K` |
| `options?` | `BaseOpts` & `object` |

#### Returns

`PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `string`, `Req`\>\>

***

### string()

> **string**\<`K`, `Req`\>(`name`, `options?`): `PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `string`, `Req`\>\>

Defined in: [src/prefix-args.ts:115](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L115)

A raw string token.

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `K` *extends* `string` | - |
| `Req` *extends* `boolean` | `false` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `K` |
| `options?` | `StringOpts` & `object` |

#### Returns

`PrefixArgsBuilder`\<`AddField`\<`TShape`, `K`, `string`, `Req`\>\>
