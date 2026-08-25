---
title: "Button\\<P\\>"
description: "A registrable button with a typed build."
---

Defined in: [src/components/builders.ts:84](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L84)

A registrable button with a typed [build](#build).

## Extends

- [`ButtonRoute`](ButtonRoute)

## Type Parameters

| Type Parameter |
| :------ |
| `P` *extends* `string` |

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | [`ButtonRoute`](ButtonRoute).[`guards`](ButtonRoute#property-guards) |
| <a id="property-kind"></a> `kind` | `readonly` | `"button"` | [`ButtonRoute`](ButtonRoute).[`kind`](ButtonRoute#property-kind) |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | [`ButtonRoute`](ButtonRoute).[`namespace`](ButtonRoute#property-namespace) |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | [`ButtonRoute`](ButtonRoute).[`paramNames`](ButtonRoute#property-paramnames) |

## Methods

### build()

> **build**(...`args`): `ButtonBuilder`

Defined in: [src/components/builders.ts:85](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L85)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`args` | [`BuildArgs`](../type-aliases/BuildArgs)\<`P`\> |

#### Returns

`ButtonBuilder`

***

### handle()

> **handle**(`interaction`, `params`): `Promise`\<`void`\>

Defined in: [src/components/registry.ts:31](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L31)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `ButtonInteraction` |
| `params` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`ButtonRoute`](ButtonRoute).[`handle`](ButtonRoute#handle)
