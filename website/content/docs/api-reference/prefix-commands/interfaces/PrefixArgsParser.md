---
title: "PrefixArgsParser\\<T\\>"
description: "The compiled parser produced by PrefixArgsBuilder.compile."
---

Defined in: [src/prefix-args.ts:56](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L56)

The compiled parser produced by [PrefixArgsBuilder.compile](../classes/PrefixArgsBuilder#compile).

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

> **parse**(`tokens`, `rest`): [`PrefixArgError`](PrefixArgError) \| [`PrefixArgsOk`](PrefixArgsOk)\<`T`\>

Defined in: [src/prefix-args.ts:58](https://github.com/byigitt/spearkit/blob/main/src/prefix-args.ts#L58)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tokens` | readonly `string`[] |
| `rest` | `string` |

#### Returns

[`PrefixArgError`](PrefixArgError) \| [`PrefixArgsOk`](PrefixArgsOk)\<`T`\>
