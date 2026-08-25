---
title: "CheckboxGroupDef"
description: "A checkbox group field definition. Submits an array of its option values."
---

Defined in: [src/components/builders.ts:355](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L355)

## Extends

- [`ModalFieldDef`](ModalFieldDef)\<`V`[], `true`\>

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `V` *extends* `string` | `string` |

## Properties

| Property | Modifier | Type | Description | Overrides | Inherited from |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="property-__value"></a> `__value?` | `readonly` | `V`[] | Phantom-only marker. Never populated at runtime. | - | [`ModalFieldDef`](ModalFieldDef).[`__value`](ModalFieldDef#property-__value) |
| <a id="property-description"></a> `description?` | `readonly` | `string` | - | - | [`ModalFieldDef`](ModalFieldDef).[`description`](ModalFieldDef#property-description) |
| <a id="property-kind"></a> `kind` | `readonly` | `"checkboxGroup"` | - | [`ModalFieldDef`](ModalFieldDef).[`kind`](ModalFieldDef#property-kind) | - |
| <a id="property-label"></a> `label` | `readonly` | `string` | - | - | [`ModalFieldDef`](ModalFieldDef).[`label`](ModalFieldDef#property-label) |
| <a id="property-maxvalues"></a> `maxValues?` | `readonly` | `number` | - | - | - |
| <a id="property-minvalues"></a> `minValues?` | `readonly` | `number` | - | - | - |
| <a id="property-options"></a> `options` | `readonly` | readonly [`GroupOption`](GroupOption)[] | - | - | - |
| <a id="property-required"></a> `required` | `readonly` | `true` | - | - | [`ModalFieldDef`](ModalFieldDef).[`required`](ModalFieldDef#property-required) |
