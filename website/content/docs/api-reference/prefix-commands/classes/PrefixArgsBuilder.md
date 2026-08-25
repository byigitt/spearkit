---
title: "PrefixArgsBuilder"
description: "Build a typed argument schema for prefixCommand. Chain calls positionally — first token → first arg, second → second arg, etc."
---

Defined in: [src/prefix-args.ts:106](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L106)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `TShape` *extends* `Record`\<`string`, `unknown`\> | `object` |

## Methods

### boolean()

```ts
boolean<K, Req>(name: K, options?: BooleanOpts & object): PrefixArgsBuilder<AddField<TShape, K, boolean, Req>>;
```

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

```ts
compile(): PrefixArgsParser<TShape>;
```

Defined in: [src/prefix-args.ts:175](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L175)

Compile this builder into a parser.

#### Returns

[`PrefixArgsParser`](../interfaces/PrefixArgsParser)\<`TShape`\>

***

### duration()

```ts
duration<K, Req>(name: K, options?: BaseOpts & object): PrefixArgsBuilder<AddField<TShape, K, number, Req>>;
```

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

```ts
integer<K, Req>(name: K, options?: NumericOpts & object): PrefixArgsBuilder<AddField<TShape, K, number, Req>>;
```

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

```ts
number<K, Req>(name: K, options?: NumericOpts & object): PrefixArgsBuilder<AddField<TShape, K, number, Req>>;
```

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

```ts
rest<K, Req>(name: K, options?: RestOpts & object): PrefixArgsBuilder<AddField<TShape, K, string, Req>>;
```

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

```ts
snowflake<K, Req>(name: K, options?: BaseOpts & object): PrefixArgsBuilder<AddField<TShape, K, string, Req>>;
```

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

```ts
string<K, Req>(name: K, options?: StringOpts & object): PrefixArgsBuilder<AddField<TShape, K, string, Req>>;
```

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
