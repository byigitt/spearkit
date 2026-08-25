---
title: "AwaitComponentOptions"
description: "Options for awaitComponent."
---

Defined in: [src/collectors.ts:72](https://github.com/byigitt/spearkit/blob/main/src/collectors.ts#L72)

Options for [awaitComponent](../functions/awaitComponent).

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-componenttype"></a> `componentType?` | `ComponentType` | Restrict to one component kind (e.g. `ComponentType.Button`). |
| <a id="property-filter"></a> `filter?` | (`interaction`) => `boolean` | Only accept interactions passing this predicate. |
| <a id="property-time"></a> `time?` | `number` | How long to wait, in ms. Default `60000`. |
