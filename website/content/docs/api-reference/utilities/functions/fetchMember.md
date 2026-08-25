---
title: "fetchMember()"
description: "Resolve a guild member with a cache-hit fast path. Returns null on failure."
---

```ts
function fetchMember(
   guild: Guild | null | undefined, 
   userId: string | null | undefined, 
options?: SafeFetchOptions): Promise<GuildMember | null>;
```

Defined in: [src/safe-fetch.ts:43](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L43)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `guild` | `Guild` \| `null` \| `undefined` |
| `userId` | `string` \| `null` \| `undefined` |
| `options` | [`SafeFetchOptions`](../interfaces/SafeFetchOptions) |

## Returns

`Promise`\<`GuildMember` \| `null`\>
