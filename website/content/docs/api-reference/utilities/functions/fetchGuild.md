---
title: "fetchGuild()"
description: "Resolve a guild by id from the client. Returns null on failure."
---

> **fetchGuild**(`client`, `guildId`, `options?`): `Promise`\<`Guild` \| `null`\>

Defined in: [src/safe-fetch.ts:111](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L111)

Resolve a guild by id from the client. Returns `null` on failure.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `Client`\<`boolean`\> \| `null` \| `undefined` |
| `guildId` | `string` \| `null` \| `undefined` |
| `options` | [`SafeFetchOptions`](../interfaces/SafeFetchOptions) |

## Returns

`Promise`\<`Guild` \| `null`\>
