---
title: "fetchUser()"
description: "Resolve a user by id from the client. Returns null on failure."
---

```ts
function fetchUser(
   client: Client<boolean> | null | undefined, 
   userId: string | null | undefined, 
options?: SafeFetchOptions): Promise<User | null>;
```

Defined in: [src/safe-fetch.ts:94](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L94)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `Client`\<`boolean`\> \| `null` \| `undefined` |
| `userId` | `string` \| `null` \| `undefined` |
| `options` | [`SafeFetchOptions`](../interfaces/SafeFetchOptions) |

## Returns

`Promise`\<`User` \| `null`\>
