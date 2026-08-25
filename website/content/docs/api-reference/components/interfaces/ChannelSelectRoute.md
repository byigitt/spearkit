---
title: "ChannelSelectRoute"
description: "Routing entry for a channel select."
---

Defined in: [src/components/registry.ts:49](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L49)

Routing entry for a channel select.

## Extends

- `RouteBase`

## Extended by

- [`ChannelSelect`](ChannelSelect)

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | `RouteBase.guards` |
| <a id="property-kind"></a> `kind` | `readonly` | `"channelSelect"` | - |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | `RouteBase.namespace` |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | `RouteBase.paramNames` |

## Methods

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
