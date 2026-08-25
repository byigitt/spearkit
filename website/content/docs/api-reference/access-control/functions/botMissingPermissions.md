---
title: "botMissingPermissions()"
description: "Like missingPermissions but for the bot's own member in channel. Resolves channel.guild.members.me; if that isn't available, every required permission is…"
---

> **botMissingPermissions**(`channel`, `required`): (`"CreateInstantInvite"` \| `"KickMembers"` \| `"BanMembers"` \| `"Administrator"` \| `"ManageChannels"` \| `"ManageGuild"` \| `"AddReactions"` \| `"ViewAuditLog"` \| `"PrioritySpeaker"` \| `"Stream"` \| `"ViewChannel"` \| `"SendMessages"` \| `"SendTTSMessages"` \| `"ManageMessages"` \| `"EmbedLinks"` \| `"AttachFiles"` \| `"ReadMessageHistory"` \| `"MentionEveryone"` \| `"UseExternalEmojis"` \| `"ViewGuildInsights"` \| `"Connect"` \| `"Speak"` \| `"MuteMembers"` \| `"DeafenMembers"` \| `"MoveMembers"` \| `"UseVAD"` \| `"ChangeNickname"` \| `"ManageNicknames"` \| `"ManageRoles"` \| `"ManageWebhooks"` \| `"ManageEmojisAndStickers"` \| `"ManageGuildExpressions"` \| `"UseApplicationCommands"` \| `"RequestToSpeak"` \| `"ManageEvents"` \| `"ManageThreads"` \| `"CreatePublicThreads"` \| `"CreatePrivateThreads"` \| `"UseExternalStickers"` \| `"SendMessagesInThreads"` \| `"UseEmbeddedActivities"` \| `"ModerateMembers"` \| `"ViewCreatorMonetizationAnalytics"` \| `"UseSoundboard"` \| `"CreateGuildExpressions"` \| `"CreateEvents"` \| `"UseExternalSounds"` \| `"SendVoiceMessages"` \| `"SetVoiceChannelStatus"` \| `"SendPolls"` \| `"UseExternalApps"` \| `"PinMessages"` \| `"BypassSlowmode"`)[]

Defined in: [src/permissions.ts:54](https://github.com/byigitt/spearkit/blob/main/src/permissions.ts#L54)

Like [missingPermissions](missingPermissions) but for the bot's own member in `channel`.
Resolves `channel.guild.members.me`; if that isn't available, every required
permission is reported missing.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `channel` | `GuildBasedChannel` |
| `required` | `PermissionResolvable` |

## Returns

(`"CreateInstantInvite"` \| `"KickMembers"` \| `"BanMembers"` \| `"Administrator"` \| `"ManageChannels"` \| `"ManageGuild"` \| `"AddReactions"` \| `"ViewAuditLog"` \| `"PrioritySpeaker"` \| `"Stream"` \| `"ViewChannel"` \| `"SendMessages"` \| `"SendTTSMessages"` \| `"ManageMessages"` \| `"EmbedLinks"` \| `"AttachFiles"` \| `"ReadMessageHistory"` \| `"MentionEveryone"` \| `"UseExternalEmojis"` \| `"ViewGuildInsights"` \| `"Connect"` \| `"Speak"` \| `"MuteMembers"` \| `"DeafenMembers"` \| `"MoveMembers"` \| `"UseVAD"` \| `"ChangeNickname"` \| `"ManageNicknames"` \| `"ManageRoles"` \| `"ManageWebhooks"` \| `"ManageEmojisAndStickers"` \| `"ManageGuildExpressions"` \| `"UseApplicationCommands"` \| `"RequestToSpeak"` \| `"ManageEvents"` \| `"ManageThreads"` \| `"CreatePublicThreads"` \| `"CreatePrivateThreads"` \| `"UseExternalStickers"` \| `"SendMessagesInThreads"` \| `"UseEmbeddedActivities"` \| `"ModerateMembers"` \| `"ViewCreatorMonetizationAnalytics"` \| `"UseSoundboard"` \| `"CreateGuildExpressions"` \| `"CreateEvents"` \| `"UseExternalSounds"` \| `"SendVoiceMessages"` \| `"SetVoiceChannelStatus"` \| `"SendPolls"` \| `"UseExternalApps"` \| `"PinMessages"` \| `"BypassSlowmode"`)[]
