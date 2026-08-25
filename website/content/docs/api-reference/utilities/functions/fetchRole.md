---
title: "fetchRole()"
description: "Resolve a role id from a guild's roles manager. Returns null on failure."
---

> **fetchRole**(`guild`, `roleId`, `options?`): `Promise`\<`Role` \| `null`\>

Defined in: [src/safe-fetch.ts:128](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L128)

Resolve a role id from a guild's roles manager. Returns `null` on failure.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `guild` | `Guild` \| `null` \| `undefined` |
| `roleId` | `string` \| `null` \| `undefined` |
| `options` | [`SafeFetchOptions`](../interfaces/SafeFetchOptions) |

## Returns

`Promise`\<`Role` \| `null`\>
