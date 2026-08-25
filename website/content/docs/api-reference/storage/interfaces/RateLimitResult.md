---
title: "RateLimitResult"
description: "Result of a fixed-window CacheStore.rateLimit hit."
---

Defined in: [src/cache.ts:13](https://github.com/byigitt/spearkit/blob/main/src/cache.ts#L13)

Result of a fixed-window [CacheStore.rateLimit](CacheStore#ratelimit) hit.

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-allowed"></a> `allowed` | `boolean` | `true` if this hit was within the window's budget. |
| <a id="property-remaining"></a> `remaining` | `number` | Remaining hits in the current window (`0` once `allowed` is false). |
| <a id="property-resetat"></a> `resetAt` | `number` | Epoch ms at which the current window resets. |
