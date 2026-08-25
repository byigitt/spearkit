---
title: "StringSelect\\<P\\>"
description: "A registrable string select with a typed build."
---

Defined in: [src/components/builders.ts:171](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L171)

A registrable string select with a typed [build](#build).

## Extends

- [`StringSelectRoute`](StringSelectRoute)

## Type Parameters

| Type Parameter |
| :------ |
| `P` *extends* `string` |

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | [`StringSelectRoute`](StringSelectRoute).[`guards`](StringSelectRoute#property-guards) |
| <a id="property-kind"></a> `kind` | `readonly` | `"stringSelect"` | [`StringSelectRoute`](StringSelectRoute).[`kind`](StringSelectRoute#property-kind) |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | [`StringSelectRoute`](StringSelectRoute).[`namespace`](StringSelectRoute#property-namespace) |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | [`StringSelectRoute`](StringSelectRoute).[`paramNames`](StringSelectRoute#property-paramnames) |

## Methods

### build()

> **build**(...`args`): `StringSelectMenuBuilder`

Defined in: [src/components/builders.ts:172](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L172)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`args` | [`BuildArgs`](../type-aliases/BuildArgs)\<`P`\> |

#### Returns

`StringSelectMenuBuilder`

***

### handle()

> **handle**(`interaction`, `params`): `Promise`\<`void`\>

Defined in: [src/components/registry.ts:36](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L36)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `StringSelectMenuInteraction` |
| `params` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StringSelectRoute`](StringSelectRoute).[`handle`](StringSelectRoute#handle)
