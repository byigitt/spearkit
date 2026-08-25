---
title: "namespaced()"
description: "Wrap a store so every key is transparently prefixed with ${prefix}:. Lets several features share one backing file without key collisions."
---

> **namespaced**(`store`, `prefix`): [`KeyValueStore`](../interfaces/KeyValueStore)

Defined in: [src/store.ts:153](https://github.com/byigitt/spearkit/blob/main/src/store.ts#L153)

Wrap a store so every key is transparently prefixed with `${prefix}:`. Lets
several features share one backing file without key collisions.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `store` | [`KeyValueStore`](../interfaces/KeyValueStore) |
| `prefix` | `string` |

## Returns

[`KeyValueStore`](../interfaces/KeyValueStore)
