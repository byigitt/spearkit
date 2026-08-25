---
title: "fileUpload()"
description: "Define a modal file-upload field. The handler receives the uploaded Attachments (CDN links — file bodies are not part of the interaction)."
---

> **fileUpload**(`config`): [`FileUploadDef`](../interfaces/FileUploadDef)

Defined in: [src/components/builders.ts:573](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L573)

Define a modal file-upload field. The handler receives the uploaded
Attachments (CDN links — file bodies are not part of the interaction).

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `FieldConfigBase` & `object` |

## Returns

[`FileUploadDef`](../interfaces/FileUploadDef)

## Example

```ts
fileUpload({ label: "Screenshots", minValues: 0, maxValues: 5 })
```
