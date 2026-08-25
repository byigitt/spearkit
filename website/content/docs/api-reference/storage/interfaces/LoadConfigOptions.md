---
title: "LoadConfigOptions"
description: "Options accepted by loadConfig / loadConfigAsync."
---

Defined in: [src/config.ts:15](https://github.com/byigitt/spearkit/blob/main/src/config.ts#L15)

## Type Parameters

| Type Parameter |
| :------ |
| `T` |

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-encoding"></a> `encoding?` | `BufferEncoding` | File encoding. Default `"utf8"`. |
| <a id="property-file"></a> `file` | `string` | Absolute or cwd-relative path to the config file. |
| <a id="property-parser"></a> `parser?` | (`text`: `string`) => `unknown` | Custom parser. Default `JSON.parse`. Pass `JSON5.parse` (etc.) for other formats. |
| <a id="property-schema"></a> `schema?` | (`value`: `unknown`) => `T` | Validation function — receives the parsed value, returns the typed config. |
