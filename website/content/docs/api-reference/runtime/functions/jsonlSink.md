---
title: "jsonlSink()"
description: "JSON-lines sink: appends one JSON object per entry to path. Fire-and-forget; filesystem errors are swallowed so logging never crashes the bot."
---

```ts
function jsonlSink(path: string, options?: object): LogSink;
```

Defined in: [src/logger.ts:86](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L86)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `path` | `string` |
| `options` | \{ `minLevel?`: [`LogLevel`](../type-aliases/LogLevel); \} |
| `options.minLevel?` | [`LogLevel`](../type-aliases/LogLevel) |

## Returns

[`LogSink`](../type-aliases/LogSink)
