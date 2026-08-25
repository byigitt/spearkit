---
title: "TaskConfig"
description: "Configuration for a scheduled task. Provide exactly one of cron/interval."
---

Defined in: [src/scheduler.ts:154](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L154)

Configuration for a scheduled task. Provide exactly one of `cron`/`interval`.

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-cron"></a> `cron?` | `string` | A cron expression (local time). |
| <a id="property-interval"></a> `interval?` | `number` | A fixed interval in milliseconds. |
| <a id="property-name"></a> `name` | `string` | Unique task name. |
| <a id="property-run"></a> `run` | (`client`) => `Awaitable`\<`void`\> | The work to perform. |
| <a id="property-runonstart"></a> `runOnStart?` | `boolean` | Also run once immediately when the scheduler starts. Default `false`. |
