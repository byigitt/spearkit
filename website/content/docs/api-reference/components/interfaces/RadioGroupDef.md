---
title: "RadioGroupDef"
description: "A radio group field definition. Submits one of its option values."
---

Defined in: [src/components/builders.ts:348](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L348)

## Extends

- [`ModalFieldDef`](ModalFieldDef)\<`V`, `TRequired`\>

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `V` *extends* `string` | `string` |
| `TRequired` *extends* `boolean` | `boolean` |

## Properties

| Property | Modifier | Type | Description | Overrides | Inherited from |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="property-__value"></a> `__value?` | `readonly` | `V` | Phantom-only marker. Never populated at runtime. | - | [`ModalFieldDef`](ModalFieldDef).[`__value`](ModalFieldDef#property-__value) |
| <a id="property-description"></a> `description?` | `readonly` | `string` | - | - | [`ModalFieldDef`](ModalFieldDef).[`description`](ModalFieldDef#property-description) |
| <a id="property-kind"></a> `kind` | `readonly` | `"radioGroup"` | - | [`ModalFieldDef`](ModalFieldDef).[`kind`](ModalFieldDef#property-kind) | - |
| <a id="property-label"></a> `label` | `readonly` | `string` | - | - | [`ModalFieldDef`](ModalFieldDef).[`label`](ModalFieldDef#property-label) |
| <a id="property-options"></a> `options` | `readonly` | readonly [`GroupOption`](GroupOption)[] | - | - | - |
| <a id="property-required"></a> `required` | `readonly` | `TRequired` | - | - | [`ModalFieldDef`](ModalFieldDef).[`required`](ModalFieldDef#property-required) |
