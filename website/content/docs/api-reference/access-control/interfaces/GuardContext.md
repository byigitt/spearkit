---
title: "GuardContext"
description: "Minimal context a guard reads. Every spearkit handler (slash/prefix/component /modal) already exposes these — guards work uniformly across all of them."
---

Defined in: [src/guards.ts:28](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L28)

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-channelid"></a> `channelId` | `readonly` | `string` \| `null` |
| <a id="property-client"></a> `client` | `readonly` | `Client` |
| <a id="property-guild"></a> `guild` | `readonly` | `Guild` \| `null` |
| <a id="property-guildid"></a> `guildId` | `readonly` | `string` \| `null` |
| <a id="property-member"></a> `member` | `readonly` | `GuildMember` \| `APIInteractionGuildMember` \| `null` |
| <a id="property-user"></a> `user` | `readonly` | `User` |
