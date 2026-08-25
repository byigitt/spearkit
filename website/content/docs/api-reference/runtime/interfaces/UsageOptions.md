---
title: "UsageOptions"
description: "Client-level usage configuration (the usage option)."
---

Defined in: [src/usage.ts:265](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L265)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-channel"></a> `channel?` | `string` | Mirror events into this Discord channel id. |
| <a id="property-format"></a> `format?` | (`event`: [`UsageEvent`](UsageEvent)) => `string` | Custom channel-line formatter. |
| <a id="property-store"></a> `store?` | [`UsageStore`](UsageStore) | Persist events to this store (a database). |
