---
title: "missingPermissions()"
description: "Return the names of the required permissions that who does NOT have in channel (taking channel overwrites and Administrator into account). An empty array means every required permission is granted. When permissions can't be resolved (e.g. the member isn't cached) every required permission is…"
---

```ts
function missingPermissions(
   channel: GuildBasedChannel, 
   who: PermissionHolder, 
   required: PermissionResolvable): (
  | "CreateInstantInvite"
  | "KickMembers"
  | "BanMembers"
  | "Administrator"
  | "ManageChannels"
  | "ManageGuild"
  | "AddReactions"
  | "ViewAuditLog"
  | "PrioritySpeaker"
  | "Stream"
  | "ViewChannel"
  | "SendMessages"
  | "SendTTSMessages"
  | "ManageMessages"
  | "EmbedLinks"
  | "AttachFiles"
  | "ReadMessageHistory"
  | "MentionEveryone"
  | "UseExternalEmojis"
  | "ViewGuildInsights"
  | "Connect"
  | "Speak"
  | "MuteMembers"
  | "DeafenMembers"
  | "MoveMembers"
  | "UseVAD"
  | "ChangeNickname"
  | "ManageNicknames"
  | "ManageRoles"
  | "ManageWebhooks"
  | "ManageEmojisAndStickers"
  | "ManageGuildExpressions"
  | "UseApplicationCommands"
  | "RequestToSpeak"
  | "ManageEvents"
  | "ManageThreads"
  | "CreatePublicThreads"
  | "CreatePrivateThreads"
  | "UseExternalStickers"
  | "SendMessagesInThreads"
  | "UseEmbeddedActivities"
  | "ModerateMembers"
  | "ViewCreatorMonetizationAnalytics"
  | "UseSoundboard"
  | "CreateGuildExpressions"
  | "CreateEvents"
  | "UseExternalSounds"
  | "SendVoiceMessages"
  | "SetVoiceChannelStatus"
  | "SendPolls"
  | "UseExternalApps"
  | "PinMessages"
  | "BypassSlowmode")[];
```

Defined in: [src/permissions.ts:39](https://github.com/byigitt/spearkit/blob/main/src/permissions.ts#L39)

Return the names of the `required` permissions that `who` does NOT have in
`channel` (taking channel overwrites and Administrator into account). An empty
array means every required permission is granted. When permissions can't be
resolved (e.g. the member isn't cached) every required permission is reported
missing.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `channel` | `GuildBasedChannel` |
| `who` | [`PermissionHolder`](../type-aliases/PermissionHolder) |
| `required` | `PermissionResolvable` |

## Returns

(
  \| `"CreateInstantInvite"`
  \| `"KickMembers"`
  \| `"BanMembers"`
  \| `"Administrator"`
  \| `"ManageChannels"`
  \| `"ManageGuild"`
  \| `"AddReactions"`
  \| `"ViewAuditLog"`
  \| `"PrioritySpeaker"`
  \| `"Stream"`
  \| `"ViewChannel"`
  \| `"SendMessages"`
  \| `"SendTTSMessages"`
  \| `"ManageMessages"`
  \| `"EmbedLinks"`
  \| `"AttachFiles"`
  \| `"ReadMessageHistory"`
  \| `"MentionEveryone"`
  \| `"UseExternalEmojis"`
  \| `"ViewGuildInsights"`
  \| `"Connect"`
  \| `"Speak"`
  \| `"MuteMembers"`
  \| `"DeafenMembers"`
  \| `"MoveMembers"`
  \| `"UseVAD"`
  \| `"ChangeNickname"`
  \| `"ManageNicknames"`
  \| `"ManageRoles"`
  \| `"ManageWebhooks"`
  \| `"ManageEmojisAndStickers"`
  \| `"ManageGuildExpressions"`
  \| `"UseApplicationCommands"`
  \| `"RequestToSpeak"`
  \| `"ManageEvents"`
  \| `"ManageThreads"`
  \| `"CreatePublicThreads"`
  \| `"CreatePrivateThreads"`
  \| `"UseExternalStickers"`
  \| `"SendMessagesInThreads"`
  \| `"UseEmbeddedActivities"`
  \| `"ModerateMembers"`
  \| `"ViewCreatorMonetizationAnalytics"`
  \| `"UseSoundboard"`
  \| `"CreateGuildExpressions"`
  \| `"CreateEvents"`
  \| `"UseExternalSounds"`
  \| `"SendVoiceMessages"`
  \| `"SetVoiceChannelStatus"`
  \| `"SendPolls"`
  \| `"UseExternalApps"`
  \| `"PinMessages"`
  \| `"BypassSlowmode"`)[]
