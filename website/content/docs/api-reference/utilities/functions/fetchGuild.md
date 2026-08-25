---
title: "fetchGuild()"
description: "Resolve a guild by id from the client. Returns null on failure."
---

```ts
function fetchGuild(
   client: Client<boolean> | null | undefined, 
   guildId: string | null | undefined, 
options?: SafeFetchOptions): Promise<Guild | null>;
```

Defined in: [src/safe-fetch.ts:111](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L111)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `Client`\<`boolean`\> \| `null` \| `undefined` |
| `guildId` | `string` \| `null` \| `undefined` |
| `options` | [`SafeFetchOptions`](../interfaces/SafeFetchOptions) |

## Returns

`Promise`\<`Guild` \| `null`\>
