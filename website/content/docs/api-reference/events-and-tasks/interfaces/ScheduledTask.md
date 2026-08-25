---
title: "ScheduledTask"
description: "A compiled, registrable scheduled task. Build it with task."
---

Defined in: [src/scheduler.ts:168](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L168)

A compiled, registrable scheduled task. Build it with [task](../functions/task).

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-cron"></a> `cron?` | `readonly` | [`CronExpression`](../classes/CronExpression) |
| <a id="property-interval"></a> `interval?` | `readonly` | `number` |
| <a id="property-kind"></a> `kind` | `readonly` | `"task"` |
| <a id="property-name"></a> `name` | `readonly` | `string` |
| <a id="property-run"></a> `run` | `readonly` | (`client`) => `Awaitable`\<`void`\> |
| <a id="property-runonstart"></a> `runOnStart` | `readonly` | `boolean` |
