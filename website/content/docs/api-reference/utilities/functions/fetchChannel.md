---
title: "fetchChannel()"
description: "Resolve a channel by id from the client. Returns null on failure."
---

```ts
function fetchChannel(
   client: Client<boolean> | null | undefined, 
   channelId: string | null | undefined, 
options?: SafeFetchOptions): Promise<Channel | null>;
```

Defined in: [src/safe-fetch.ts:60](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L60)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `Client`\<`boolean`\> \| `null` \| `undefined` |
| `channelId` | `string` \| `null` \| `undefined` |
| `options` | [`SafeFetchOptions`](../interfaces/SafeFetchOptions) |

## Returns

`Promise`\<`Channel` \| `null`\>
