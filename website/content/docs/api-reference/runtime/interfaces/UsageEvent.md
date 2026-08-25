---
title: "UsageEvent"
description: "A single recorded use."
---

Defined in: [src/usage.ts:28](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L28)

A single recorded use.

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-channelid"></a> `channelId?` | `readonly` | `string` \| `null` | - |
| <a id="property-detail"></a> `detail?` | `readonly` | `string` | Free-form extra detail. |
| <a id="property-durationms"></a> `durationMs?` | `readonly` | `number` | Wall-clock duration of the handler in milliseconds. |
| <a id="property-errormessage"></a> `errorMessage?` | `readonly` | `string` | Error message if `outcome === "error"`. |
| <a id="property-guildid"></a> `guildId?` | `readonly` | `string` \| `null` | - |
| <a id="property-name"></a> `name` | `readonly` | `string` | Command/component name (or event name). |
| <a id="property-options"></a> `options?` | `readonly` | `Readonly`\<`Record`\<`string`, [`UsageMetaValue`](../type-aliases/UsageMetaValue)\>\> | Snapshot of the typed options the handler ran with. |
| <a id="property-outcome"></a> `outcome?` | `readonly` | [`UsageOutcome`](../type-aliases/UsageOutcome) | Outcome of the handler — `"success"` or `"error"`. |
| <a id="property-timestamp"></a> `timestamp` | `readonly` | `Date` | - |
| <a id="property-type"></a> `type` | `readonly` | [`UsageType`](../type-aliases/UsageType) | - |
| <a id="property-userid"></a> `userId?` | `readonly` | `string` | - |
| <a id="property-usertag"></a> `userTag?` | `readonly` | `string` | - |
