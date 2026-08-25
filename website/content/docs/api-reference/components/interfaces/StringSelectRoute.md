---
title: "StringSelectRoute"
description: "Routing entry for a string select."
---

Defined in: [src/components/registry.ts:34](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L34)

Routing entry for a string select.

## Extends

- `RouteBase`

## Extended by

- [`StringSelect`](StringSelect)

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | `RouteBase.guards` |
| <a id="property-kind"></a> `kind` | `readonly` | `"stringSelect"` | - |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | `RouteBase.namespace` |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | `RouteBase.paramNames` |

## Methods

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
