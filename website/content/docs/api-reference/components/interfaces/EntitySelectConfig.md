---
title: "EntitySelectConfig\\<P\\>"
description: "Config shared by the entity-select builders (user/role/channel/mentionable)."
---

Defined in: [src/components/builders.ts:194](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L194)

Config shared by the entity-select builders (user/role/channel/mentionable).

## Extends

- `SelectConfigBase`

## Type Parameters

| Type Parameter |
| :------ |
| `P` *extends* `string` |

## Properties

| Property | Type | Description | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-disabled"></a> `disabled?` | `boolean` | - | `SelectConfigBase.disabled` |
| <a id="property-guards"></a> `guards?` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | Preconditions evaluated before the handler runs. | `SelectConfigBase.guards` |
| <a id="property-id"></a> `id` | `P` | - | - |
| <a id="property-maxvalues"></a> `maxValues?` | `number` | - | `SelectConfigBase.maxValues` |
| <a id="property-minvalues"></a> `minValues?` | `number` | - | `SelectConfigBase.minValues` |
| <a id="property-placeholder"></a> `placeholder?` | `string` | - | `SelectConfigBase.placeholder` |
