---
title: "webhookSink()"
description: "Discord-webhook sink: POSTs an embed to a webhook URL for entries at or above minLevel (default \"warn\"). Useful for sending errors to a private #bot-errors…"
---

> **webhookSink**(`options`): [`LogSink`](../type-aliases/LogSink)

Defined in: [src/logger.ts:120](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L120)

Discord-webhook sink: POSTs an embed to a webhook URL for entries at or
above `minLevel` (default `"warn"`). Useful for sending errors to a private
`#bot-errors` channel.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `minLevel?`: [`LogLevel`](../type-aliases/LogLevel); `url`: `string`; `username?`: `string`; \} |
| `options.minLevel?` | [`LogLevel`](../type-aliases/LogLevel) |
| `options.url` | `string` |
| `options.username?` | `string` |

## Returns

[`LogSink`](../type-aliases/LogSink)
