---
title: "RoleSelect\\<P\\>"
description: "A registrable role select."
---

Defined in: [src/components/builders.ts:220](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L220)

A registrable role select.

## Extends

- [`RoleSelectRoute`](RoleSelectRoute)

## Type Parameters

| Type Parameter |
| :------ |
| `P` *extends* `string` |

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | [`RoleSelectRoute`](RoleSelectRoute).[`guards`](RoleSelectRoute#property-guards) |
| <a id="property-kind"></a> `kind` | `readonly` | `"roleSelect"` | [`RoleSelectRoute`](RoleSelectRoute).[`kind`](RoleSelectRoute#property-kind) |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | [`RoleSelectRoute`](RoleSelectRoute).[`namespace`](RoleSelectRoute#property-namespace) |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | [`RoleSelectRoute`](RoleSelectRoute).[`paramNames`](RoleSelectRoute#property-paramnames) |

## Methods

### build()

> **build**(...`args`): `RoleSelectMenuBuilder`

Defined in: [src/components/builders.ts:221](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L221)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`args` | [`BuildArgs`](../type-aliases/BuildArgs)\<`P`\> |

#### Returns

`RoleSelectMenuBuilder`

***

### handle()

> **handle**(`interaction`, `params`): `Promise`\<`void`\>

Defined in: [src/components/registry.ts:46](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L46)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `RoleSelectMenuInteraction` |
| `params` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`RoleSelectRoute`](RoleSelectRoute).[`handle`](RoleSelectRoute#handle)
