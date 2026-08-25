---
title: "InviteUrlOptions"
description: "Options for inviteUrl."
---

Defined in: [src/invite.ts:7](https://github.com/byigitt/spearkit/blob/main/src/invite.ts#L7)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-clientid"></a> `clientId` | `string` | Application / bot user id. |
| <a id="property-disableguildselect"></a> `disableGuildSelect?` | `boolean` | Hide the guild picker when `guildId` is set. |
| <a id="property-guildid"></a> `guildId?` | `string` | Pre-select this guild in the picker. |
| <a id="property-permissions"></a> `permissions?` | `PermissionResolvable` | Permission bitfield requested for the bot. |
| <a id="property-scopes"></a> `scopes?` | readonly `string`[] | OAuth2 scopes. Default `["bot", "applications.commands"]` so slash commands work after invite. |
