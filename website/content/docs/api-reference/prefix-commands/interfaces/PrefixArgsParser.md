---
title: "PrefixArgsParser"
description: "The compiled parser produced by PrefixArgsBuilder.compile."
---

Defined in: [src/prefix-args.ts:56](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L56)

## Type Parameters

| Type Parameter |
| :------ |
| `T` |

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-specs"></a> `specs` | `readonly` | readonly [`PrefixArgSpec`](PrefixArgSpec)[] |

## Methods

### parse()

```ts
parse(tokens: readonly string[], rest: string): 
  | PrefixArgError
| PrefixArgsOk<T>;
```

Defined in: [src/prefix-args.ts:58](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L58)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tokens` | readonly `string`[] |
| `rest` | `string` |

#### Returns

  \| [`PrefixArgError`](PrefixArgError)
  \| [`PrefixArgsOk`](PrefixArgsOk)\<`T`\>
