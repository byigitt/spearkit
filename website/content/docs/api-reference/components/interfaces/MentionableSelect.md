---
title: "MentionableSelect\\<P\\>"
description: "A registrable mentionable select."
---

Defined in: [src/components/builders.ts:266](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L266)

A registrable mentionable select.

## Extends

- [`MentionableSelectRoute`](MentionableSelectRoute)

## Type Parameters

| Type Parameter |
| :------ |
| `P` *extends* `string` |

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | [`MentionableSelectRoute`](MentionableSelectRoute).[`guards`](MentionableSelectRoute#property-guards) |
| <a id="property-kind"></a> `kind` | `readonly` | `"mentionableSelect"` | [`MentionableSelectRoute`](MentionableSelectRoute).[`kind`](MentionableSelectRoute#property-kind) |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | [`MentionableSelectRoute`](MentionableSelectRoute).[`namespace`](MentionableSelectRoute#property-namespace) |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | [`MentionableSelectRoute`](MentionableSelectRoute).[`paramNames`](MentionableSelectRoute#property-paramnames) |

## Methods

### build()

> **build**(...`args`): `MentionableSelectMenuBuilder`

Defined in: [src/components/builders.ts:267](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L267)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`args` | [`BuildArgs`](../type-aliases/BuildArgs)\<`P`\> |

#### Returns

`MentionableSelectMenuBuilder`

***

### handle()

> **handle**(`interaction`, `params`): `Promise`\<`void`\>

Defined in: [src/components/registry.ts:56](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L56)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `MentionableSelectMenuInteraction` |
| `params` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`MentionableSelectRoute`](MentionableSelectRoute).[`handle`](MentionableSelectRoute#handle)
