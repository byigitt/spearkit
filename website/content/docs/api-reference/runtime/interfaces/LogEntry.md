---
title: "LogEntry"
description: "A fully-resolved record handed to a LogSink."
---

Defined in: [src/logger.ts:32](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L32)

A fully-resolved record handed to a [LogSink](../type-aliases/LogSink).

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-data"></a> `data?` | `readonly` | `Readonly`\<`Record`\<`string`, [`LogValue`](../type-aliases/LogValue)\>\> |
| <a id="property-error"></a> `error?` | `readonly` | `Error` |
| <a id="property-level"></a> `level` | `readonly` | [`LogLevel`](../type-aliases/LogLevel) |
| <a id="property-message"></a> `message` | `readonly` | `string` |
| <a id="property-scope"></a> `scope?` | `readonly` | `string` |
| <a id="property-timestamp"></a> `timestamp` | `readonly` | `Date` |
