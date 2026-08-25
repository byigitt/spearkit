---
title: "CreateSettingsOptions\\<T\\>"
description: "Options for createSettings."
---

Defined in: [src/store.ts:184](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L184)

Options for [createSettings](../functions/createSettings).

## Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* `Record`\<`string`, `unknown`\> |

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-defaults"></a> `defaults` | `T` | Default values applied to ids with no (or partial) stored settings. |
| <a id="property-namespace"></a> `namespace?` | `string` | Key prefix; lets one store hold several settings groups. Default `"settings"`. |
| <a id="property-store"></a> `store` | [`KeyValueStore`](KeyValueStore) | Backing store (e.g. `new JsonStore(path)`). |
