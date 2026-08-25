---
title: "ConfirmResult"
description: "Result of confirm."
---

Defined in: [src/confirm.ts:59](https://github.com/byigitt/spearkit/blob/main/src/confirm.ts#L59)

Result of [confirm](../functions/confirm).

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-confirmed"></a> `confirmed` | `boolean` | Whether the user confirmed (clicked the confirm button before timeout). |
| <a id="property-interaction"></a> `interaction?` | `ButtonInteraction`\<`CacheType`\> | The triggering button interaction when `reason !== "timeout"`. |
| <a id="property-reason"></a> `reason` | `"timeout"` \| `"confirm"` \| `"cancel"` | How the prompt ended. |
