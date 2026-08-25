---
title: "task()"
description: "Define a scheduled task. Throws if neither cron nor interval is given."
---

```ts
function task(config: TaskConfig): ScheduledTask;
```

Defined in: [src/scheduler.ts:178](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L178)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`TaskConfig`](../interfaces/TaskConfig) |

## Returns

[`ScheduledTask`](../interfaces/ScheduledTask)
