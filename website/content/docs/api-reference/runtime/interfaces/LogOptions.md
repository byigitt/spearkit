---
title: "LogOptions"
description: "Extra context passed alongside a log message."
---

Defined in: [src/logger.ts:24](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L24)

Extra context passed alongside a log message.

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-data"></a> `data?` | `Record`\<`string`, [`LogValue`](../type-aliases/LogValue)\> | Structured key/value metadata. |
| <a id="property-error"></a> `error?` | `Error` | An error to attach; the default sink renders its stack. |
