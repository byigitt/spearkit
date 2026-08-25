---
title: "AwaitModalOptions"
description: "Options for showAndAwaitModal."
---

Defined in: [src/collectors.ts:117](https://github.com/byigitt/spearkit/blob/main/src/collectors.ts#L117)

Options for [showAndAwaitModal](../functions/showAndAwaitModal).

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-filter"></a> `filter?` | (`interaction`) => `boolean` | Extra predicate on the submitted modal (already scoped to this user + modal). |
| <a id="property-time"></a> `time?` | `number` | How long to wait for submission, in ms. Default `120000`. |
