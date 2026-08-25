---
title: "StringSelectConfig\\<P, R\\>"
description: "Config for a string select created with stringSelect."
---

Defined in: [src/components/builders.ts:164](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L164)

Config for a string select created with [stringSelect](../functions/stringSelect).

## Extends

- `SelectConfigBase`

## Type Parameters

| Type Parameter |
| :------ |
| `P` *extends* `string` |
| `R` |

## Properties

| Property | Type | Description | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-disabled"></a> `disabled?` | `boolean` | - | `SelectConfigBase.disabled` |
| <a id="property-guards"></a> `guards?` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | Preconditions evaluated before the handler runs. | `SelectConfigBase.guards` |
| <a id="property-id"></a> `id` | `P` | - | - |
| <a id="property-maxvalues"></a> `maxValues?` | `number` | - | `SelectConfigBase.maxValues` |
| <a id="property-minvalues"></a> `minValues?` | `number` | - | `SelectConfigBase.minValues` |
| <a id="property-options"></a> `options` | readonly `SelectMenuComponentOptionData`[] | - | - |
| <a id="property-placeholder"></a> `placeholder?` | `string` | - | `SelectConfigBase.placeholder` |
| <a id="property-run"></a> `run` | (`ctx`) => `Awaitable`\<`R`\> | - | - |
