---
title: "AwaitMessageOptions"
description: "Options for awaitMessage."
---

Defined in: [src/collectors.ts:36](https://github.com/byigitt/spearkit/blob/main/src/collectors.ts#L36)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-filter"></a> `filter?` | (`message`: `Message`) => `boolean` | Only accept messages passing this predicate. |
| <a id="property-time"></a> `time?` | `number` | How long to wait, in ms. Default `60000`. |
