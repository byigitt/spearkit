---
title: "ButtonRoute"
description: "Routing entry for a button."
---

Defined in: [src/components/registry.ts:29](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L29)

Routing entry for a button.

## Extends

- `RouteBase`

## Extended by

- [`Button`](Button)

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | `RouteBase.guards` |
| <a id="property-kind"></a> `kind` | `readonly` | `"button"` | - |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | `RouteBase.namespace` |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | `RouteBase.paramNames` |

## Methods

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
