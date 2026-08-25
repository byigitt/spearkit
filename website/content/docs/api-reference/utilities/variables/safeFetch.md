---
title: "safeFetch"
description: "Cache-first, timeout-bounded fetch helpers grouped for ergonomic imports."
---

```ts
const safeFetch: object;
```

Defined in: [src/safe-fetch.ts:170](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L170)

## Type Declaration

| Name | Type | Default value |
| :------ | :------ | :------ |
| <a id="property-channel"></a> `channel()` | (`client`: `Client`\<`boolean`\> \| `null` \| `undefined`, `channelId`: `string` \| `null` \| `undefined`, `options`: [`SafeFetchOptions`](../interfaces/SafeFetchOptions)) => `Promise`\<`Channel` \| `null`\> | `fetchChannel` |
| <a id="property-guild"></a> `guild()` | (`client`: `Client`\<`boolean`\> \| `null` \| `undefined`, `guildId`: `string` \| `null` \| `undefined`, `options`: [`SafeFetchOptions`](../interfaces/SafeFetchOptions)) => `Promise`\<`Guild` \| `null`\> | `fetchGuild` |
| <a id="property-member"></a> `member()` | (`guild`: `Guild` \| `null` \| `undefined`, `userId`: `string` \| `null` \| `undefined`, `options`: [`SafeFetchOptions`](../interfaces/SafeFetchOptions)) => `Promise`\<`GuildMember` \| `null`\> | `fetchMember` |
| <a id="property-message"></a> `message()` | (`messages`: `MessageManager`\<`boolean`\> \| `null` \| `undefined`, `messageId`: `string` \| `null` \| `undefined`, `options`: [`SafeFetchOptions`](../interfaces/SafeFetchOptions)) => `Promise`\<`Message`\<`boolean`\> \| `null`\> | `fetchMessage` |
| <a id="property-role"></a> `role()` | (`guild`: `Guild` \| `null` \| `undefined`, `roleId`: `string` \| `null` \| `undefined`, `options`: [`SafeFetchOptions`](../interfaces/SafeFetchOptions)) => `Promise`\<`Role` \| `null`\> | `fetchRole` |
| <a id="property-try"></a> `try()` | \<`T`\>(`op`: () => `T` \| `Promise`\<`T`\>) => `Promise`\<`T` \| `null`\> | `safeTry` |
| <a id="property-user"></a> `user()` | (`client`: `Client`\<`boolean`\> \| `null` \| `undefined`, `userId`: `string` \| `null` \| `undefined`, `options`: [`SafeFetchOptions`](../interfaces/SafeFetchOptions)) => `Promise`\<`User` \| `null`\> | `fetchUser` |
