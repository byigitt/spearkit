---
title: "ChannelSelect\\<P\\>"
description: "A registrable channel select."
---

Defined in: [src/components/builders.ts:241](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L241)

A registrable channel select.

## Extends

- [`ChannelSelectRoute`](ChannelSelectRoute)

## Type Parameters

| Type Parameter |
| :------ |
| `P` *extends* `string` |

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | [`ChannelSelectRoute`](ChannelSelectRoute).[`guards`](ChannelSelectRoute#property-guards) |
| <a id="property-kind"></a> `kind` | `readonly` | `"channelSelect"` | [`ChannelSelectRoute`](ChannelSelectRoute).[`kind`](ChannelSelectRoute#property-kind) |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | [`ChannelSelectRoute`](ChannelSelectRoute).[`namespace`](ChannelSelectRoute#property-namespace) |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | [`ChannelSelectRoute`](ChannelSelectRoute).[`paramNames`](ChannelSelectRoute#property-paramnames) |

## Methods

### build()

> **build**(...`args`): `ChannelSelectMenuBuilder`

Defined in: [src/components/builders.ts:242](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L242)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`args` | [`BuildArgs`](../type-aliases/BuildArgs)\<`P`\> |

#### Returns

`ChannelSelectMenuBuilder`

***

### handle()

> **handle**(`interaction`, `params`): `Promise`\<`void`\>

Defined in: [src/components/registry.ts:51](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L51)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `ChannelSelectMenuInteraction` |
| `params` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`ChannelSelectRoute`](ChannelSelectRoute).[`handle`](ChannelSelectRoute#handle)
