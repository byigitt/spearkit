---
title: "SafeFetchOptions"
description: "Shared options for every safe-fetch helper."
---

Defined in: [src/safe-fetch.ts:19](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L19)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-cache"></a> `cache?` | `boolean` | Use the cache when present and not `force`. Default `true`. |
| <a id="property-force"></a> `force?` | `boolean` | Bypass the cache and force a REST hit. Default `false`. |
| <a id="property-timeoutms"></a> `timeoutMs?` | `number` | Resolve to `null` if Discord takes longer than this (ms). Default `5000`. |
