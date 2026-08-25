---
title: "safeFetch"
description: "Cache-first, timeout-bounded fetch helpers grouped for ergonomic imports."
---

> `const` **safeFetch**: `object`

Defined in: [src/safe-fetch.ts:170](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L170)

Cache-first, timeout-bounded fetch helpers grouped for ergonomic imports.

## Type Declaration

| Name | Type | Default value |
| :------ | :------ | :------ |
| <a id="property-channel"></a> `channel()` | (`client`, `channelId`, `options`) => `Promise`\<`Channel` \| `null`\> | `fetchChannel` |
| <a id="property-guild"></a> `guild()` | (`client`, `guildId`, `options`) => `Promise`\<`Guild` \| `null`\> | `fetchGuild` |
| <a id="property-member"></a> `member()` | (`guild`, `userId`, `options`) => `Promise`\<`GuildMember` \| `null`\> | `fetchMember` |
| <a id="property-message"></a> `message()` | (`messages`, `messageId`, `options`) => `Promise`\<`Message`\<`boolean`\> \| `null`\> | `fetchMessage` |
| <a id="property-role"></a> `role()` | (`guild`, `roleId`, `options`) => `Promise`\<`Role` \| `null`\> | `fetchRole` |
| <a id="property-try"></a> `try()` | \<`T`\>(`op`) => `Promise`\<`T` \| `null`\> | `safeTry` |
| <a id="property-user"></a> `user()` | (`client`, `userId`, `options`) => `Promise`\<`User` \| `null`\> | `fetchUser` |
