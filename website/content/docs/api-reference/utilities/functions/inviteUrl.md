---
title: "inviteUrl()"
description: "Build a Discord OAuth2 invite URL."
---

```ts
function inviteUrl(options: InviteUrlOptions): string;
```

Defined in: [src/invite.ts:34](https://github.com/byigitt/spearkit/blob/main/src/invite.ts#L34)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`InviteUrlOptions`](../interfaces/InviteUrlOptions) |

## Returns

`string`

## Example

```ts
inviteUrl({
  clientId: "123",
  permissions: ["BanMembers", "KickMembers"],
});
```
