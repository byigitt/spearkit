---
title: "LogSink"
description: "Receives every entry at or above the configured threshold."
---

```ts
type LogSink = (entry: LogEntry) => void;
```

Defined in: [src/logger.ts:42](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L42)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `entry` | [`LogEntry`](../interfaces/LogEntry) |

## Returns

`void`
