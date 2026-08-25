---
title: "ModalFieldDef"
description: "Base of every modal field definition. The two type parameters are phantom markers used purely for compile-time inference of the submitted value: - TValue is the type produced for the modal handler. - TRequired controls nullability (false => value may be missing)."
---

Defined in: [src/components/builders.ts:320](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L320)

Every field renders as a Discord **Label** component (the recommended modal
surface); legacy Action Row + Text Input modals are no longer emitted.

## Extended by

- [`TextInputDef`](TextInputDef)
- [`RadioGroupDef`](RadioGroupDef)
- [`CheckboxGroupDef`](CheckboxGroupDef)
- [`CheckboxDef`](CheckboxDef)
- [`FileUploadDef`](FileUploadDef)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `TValue` | `unknown` |
| `TRequired` *extends* `boolean` | `boolean` |

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-__value"></a> `__value?` | `readonly` | `TValue` | Phantom-only marker. Never populated at runtime. |
| <a id="property-description"></a> `description?` | `readonly` | `string` | - |
| <a id="property-kind"></a> `kind` | `readonly` | [`ModalFieldKind`](../type-aliases/ModalFieldKind) | - |
| <a id="property-label"></a> `label` | `readonly` | `string` | - |
| <a id="property-required"></a> `required` | `readonly` | `TRequired` | - |
