---
title: "FileUploadDef"
description: "A file upload field definition. Submits the uploaded Attachments."
---

Defined in: [src/components/builders.ts:369](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L369)

A file upload field definition. Submits the uploaded Attachments.

## Extends

- [`ModalFieldDef`](ModalFieldDef)\<`Attachment`[], `true`\>

## Properties

| Property | Modifier | Type | Description | Overrides | Inherited from |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="property-__value"></a> `__value?` | `readonly` | `Attachment`[] | Phantom-only marker. Never populated at runtime. | - | [`ModalFieldDef`](ModalFieldDef).[`__value`](ModalFieldDef#property-__value) |
| <a id="property-allowedfiletypes"></a> `allowedFileTypes?` | `readonly` | readonly `FileUploadType`[] | Allowed MIME types / dot-prefixed extensions (Discord file-type filter). | - | - |
| <a id="property-description"></a> `description?` | `readonly` | `string` | - | - | [`ModalFieldDef`](ModalFieldDef).[`description`](ModalFieldDef#property-description) |
| <a id="property-kind"></a> `kind` | `readonly` | `"fileUpload"` | - | [`ModalFieldDef`](ModalFieldDef).[`kind`](ModalFieldDef#property-kind) | - |
| <a id="property-label"></a> `label` | `readonly` | `string` | - | - | [`ModalFieldDef`](ModalFieldDef).[`label`](ModalFieldDef#property-label) |
| <a id="property-maxvalues"></a> `maxValues?` | `readonly` | `number` | - | - | - |
| <a id="property-minvalues"></a> `minValues?` | `readonly` | `number` | - | - | - |
| <a id="property-required"></a> `required` | `readonly` | `true` | - | - | [`ModalFieldDef`](ModalFieldDef).[`required`](ModalFieldDef#property-required) |
