---
title: "createSettings()"
description: "Build a typed, defaults-merged settings accessor over a KeyValueStore. get always returns a complete object (stored overrides on top of defaults), and set only…"
---

> **createSettings**\<`T`\>(`options`): [`SettingsManager`](../interfaces/SettingsManager)\<`T`\>

Defined in: [src/store.ts:198](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L198)

Build a typed, defaults-merged settings accessor over a [KeyValueStore](../interfaces/KeyValueStore).
`get` always returns a complete object (stored overrides on top of defaults),
and `set` only persists the overrides — so widening `defaults` later is safe.

## Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* `Record`\<`string`, `unknown`\> |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`CreateSettingsOptions`](../interfaces/CreateSettingsOptions)\<`T`\> |

## Returns

[`SettingsManager`](../interfaces/SettingsManager)\<`T`\>
