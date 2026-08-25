---
title: "UserContextMenuContext"
description: "Handler context for a user-target context menu."
---

Defined in: [src/context-menus.ts:106](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L106)

Handler context for a user-target context menu.

## Extends

- [`BaseContext`](../../contexts/classes/BaseContext)\<`UserContextMenuCommandInteraction`\>

## Constructors

### Constructor

> **new UserContextMenuContext**(`interaction`): `UserContextMenuContext`

Defined in: [src/context.ts:151](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L151)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `UserContextMenuCommandInteraction` |

#### Returns

`UserContextMenuContext`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`constructor`](../../contexts/classes/BaseContext#constructor)

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-interaction"></a> `interaction` | `readonly` | `UserContextMenuCommandInteraction` | [`BaseContext`](../../contexts/classes/BaseContext).[`interaction`](../../contexts/classes/BaseContext#property-interaction) |

## Accessors

### botPermissions

#### Get Signature

> **get** **botPermissions**(): `Readonly`\<`PermissionsBitField`\>

Defined in: [src/context.ts:252](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L252)

The bot's resolved permissions in the current channel.

##### Returns

`Readonly`\<`PermissionsBitField`\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`botPermissions`](../../contexts/classes/BaseContext#botpermissions)

***

### channel

#### Get Signature

> **get** **channel**(): `TextBasedChannel` \| `null`

Defined in: [src/context.ts:168](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L168)

##### Returns

`TextBasedChannel` \| `null`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`channel`](../../contexts/classes/BaseContext#channel)

***

### channelId

#### Get Signature

> **get** **channelId**(): `string` \| `null`

Defined in: [src/context.ts:171](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L171)

##### Returns

`string` \| `null`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`channelId`](../../contexts/classes/BaseContext#channelid)

***

### client

#### Get Signature

> **get** **client**(): `I`\[`"client"`\]

Defined in: [src/context.ts:153](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L153)

##### Returns

`I`\[`"client"`\]

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`client`](../../contexts/classes/BaseContext#client)

***

### deferred

#### Get Signature

> **get** **deferred**(): `boolean`

Defined in: [src/context.ts:201](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L201)

Whether the interaction is already deferred.

##### Returns

`boolean`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`deferred`](../../contexts/classes/BaseContext#deferred)

***

### guild

#### Get Signature

> **get** **guild**(): `Guild` \| `null`

Defined in: [src/context.ts:162](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L162)

##### Returns

`Guild` \| `null`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`guild`](../../contexts/classes/BaseContext#guild)

***

### guildId

#### Get Signature

> **get** **guildId**(): `string` \| `null`

Defined in: [src/context.ts:165](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L165)

##### Returns

`string` \| `null`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`guildId`](../../contexts/classes/BaseContext#guildid)

***

### locale

#### Get Signature

> **get** **locale**(): `Locale`

Defined in: [src/context.ts:174](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L174)

##### Returns

`Locale`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`locale`](../../contexts/classes/BaseContext#locale)

***

### member

#### Get Signature

> **get** **member**(): `GuildMember` \| `APIInteractionGuildMember` \| `null`

Defined in: [src/context.ts:159](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L159)

##### Returns

`GuildMember` \| `APIInteractionGuildMember` \| `null`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`member`](../../contexts/classes/BaseContext#member)

***

### replied

#### Get Signature

> **get** **replied**(): `boolean`

Defined in: [src/context.ts:205](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L205)

Whether the interaction already received an initial response.

##### Returns

`boolean`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`replied`](../../contexts/classes/BaseContext#replied)

***

### targetMember

#### Get Signature

> **get** **targetMember**(): `GuildMember` \| `APIInteractionGuildMember` \| `null`

Defined in: [src/context-menus.ts:112](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L112)

The member version of the target, if available.

##### Returns

`GuildMember` \| `APIInteractionGuildMember` \| `null`

***

### targetUser

#### Get Signature

> **get** **targetUser**(): `User`

Defined in: [src/context-menus.ts:108](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L108)

The user the menu was invoked on.

##### Returns

`User`

***

### user

#### Get Signature

> **get** **user**(): `User`

Defined in: [src/context.ts:156](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L156)

##### Returns

`User`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`user`](../../contexts/classes/BaseContext#user)

## Methods

### awaitMessageFrom()

> **awaitMessageFrom**(`userId?`, `options?`): `Promise`\<`Message`\<`boolean`\> \| `null`\>

Defined in: [src/context.ts:277](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L277)

Wait for the next message in this channel from `userId` (defaults to the
invoking user), resolving to it or `null` on timeout. The "type your answer"
flow without hand-rolling a collector.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `string` |
| `options` | [`AwaitMessageOptions`](../../contexts/interfaces/AwaitMessageOptions) |

#### Returns

`Promise`\<`Message`\<`boolean`\> \| `null`\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`awaitMessageFrom`](../../contexts/classes/BaseContext#awaitmessagefrom)

***

### botMissing()

> **botMissing**(`required`): (`"CreateInstantInvite"` \| `"KickMembers"` \| `"BanMembers"` \| `"Administrator"` \| `"ManageChannels"` \| `"ManageGuild"` \| `"AddReactions"` \| `"ViewAuditLog"` \| `"PrioritySpeaker"` \| `"Stream"` \| `"ViewChannel"` \| `"SendMessages"` \| `"SendTTSMessages"` \| `"ManageMessages"` \| `"EmbedLinks"` \| `"AttachFiles"` \| `"ReadMessageHistory"` \| `"MentionEveryone"` \| `"UseExternalEmojis"` \| `"ViewGuildInsights"` \| `"Connect"` \| `"Speak"` \| `"MuteMembers"` \| `"DeafenMembers"` \| `"MoveMembers"` \| `"UseVAD"` \| `"ChangeNickname"` \| `"ManageNicknames"` \| `"ManageRoles"` \| `"ManageWebhooks"` \| `"ManageEmojisAndStickers"` \| `"ManageGuildExpressions"` \| `"UseApplicationCommands"` \| `"RequestToSpeak"` \| `"ManageEvents"` \| `"ManageThreads"` \| `"CreatePublicThreads"` \| `"CreatePrivateThreads"` \| `"UseExternalStickers"` \| `"SendMessagesInThreads"` \| `"UseEmbeddedActivities"` \| `"ModerateMembers"` \| `"ViewCreatorMonetizationAnalytics"` \| `"UseSoundboard"` \| `"CreateGuildExpressions"` \| `"CreateEvents"` \| `"UseExternalSounds"` \| `"SendVoiceMessages"` \| `"SetVoiceChannelStatus"` \| `"SendPolls"` \| `"UseExternalApps"` \| `"PinMessages"` \| `"BypassSlowmode"`)[]

Defined in: [src/context.ts:261](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L261)

Permission flag names the BOT is missing in the current channel — empty when
it has them all. Zero-fetch: reads the permissions Discord attached to the
interaction. Use before an action that needs elevated permissions.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `required` | `PermissionResolvable` |

#### Returns

(`"CreateInstantInvite"` \| `"KickMembers"` \| `"BanMembers"` \| `"Administrator"` \| `"ManageChannels"` \| `"ManageGuild"` \| `"AddReactions"` \| `"ViewAuditLog"` \| `"PrioritySpeaker"` \| `"Stream"` \| `"ViewChannel"` \| `"SendMessages"` \| `"SendTTSMessages"` \| `"ManageMessages"` \| `"EmbedLinks"` \| `"AttachFiles"` \| `"ReadMessageHistory"` \| `"MentionEveryone"` \| `"UseExternalEmojis"` \| `"ViewGuildInsights"` \| `"Connect"` \| `"Speak"` \| `"MuteMembers"` \| `"DeafenMembers"` \| `"MoveMembers"` \| `"UseVAD"` \| `"ChangeNickname"` \| `"ManageNicknames"` \| `"ManageRoles"` \| `"ManageWebhooks"` \| `"ManageEmojisAndStickers"` \| `"ManageGuildExpressions"` \| `"UseApplicationCommands"` \| `"RequestToSpeak"` \| `"ManageEvents"` \| `"ManageThreads"` \| `"CreatePublicThreads"` \| `"CreatePrivateThreads"` \| `"UseExternalStickers"` \| `"SendMessagesInThreads"` \| `"UseEmbeddedActivities"` \| `"ModerateMembers"` \| `"ViewCreatorMonetizationAnalytics"` \| `"UseSoundboard"` \| `"CreateGuildExpressions"` \| `"CreateEvents"` \| `"UseExternalSounds"` \| `"SendVoiceMessages"` \| `"SetVoiceChannelStatus"` \| `"SendPolls"` \| `"UseExternalApps"` \| `"PinMessages"` \| `"BypassSlowmode"`)[]

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`botMissing`](../../contexts/classes/BaseContext#botmissing)

***

### defer()

> **defer**(`options?`): `Promise`\<`InteractionResponse`\<`boolean`\>\>

Defined in: [src/context.ts:220](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L220)

Acknowledge now and respond later via [editReply](#editreply).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`defer`](../../contexts/classes/BaseContext#defer)

***

### dm()

> **dm**(`input`): `Promise`\<`Message`\<`boolean`\> \| `null`\>

Defined in: [src/context.ts:302](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L302)

DM the invoking user. Resolves `null` if their DMs are closed.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `string` \| `MessageCreateOptions` |

#### Returns

`Promise`\<`Message`\<`boolean`\> \| `null`\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`dm`](../../contexts/classes/BaseContext#dm)

***

### editReply()

> **editReply**(`input`): `Promise`\<`Message`\<`boolean`\>\>

Defined in: [src/context.ts:227](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L227)

Edit the original (or deferred) response.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`ReplyInput`](../../contexts/type-aliases/ReplyInput) |

#### Returns

`Promise`\<`Message`\<`boolean`\>\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`editReply`](../../contexts/classes/BaseContext#editreply)

***

### error()

> **error**(`input`, `options?`): `Promise`\<`void`\>

Defined in: [src/context.ts:343](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L343)

State-aware send of a red error embed. Defaults to ephemeral.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`EmbedPresetInput`](../../contexts/type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`error`](../../contexts/classes/BaseContext#error)

***

### followUp()

> **followUp**(`input`): `Promise`\<`Message`\<`boolean`\>\>

Defined in: [src/context.ts:232](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L232)

Add an additional message after the initial response.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`ReplyInput`](../../contexts/type-aliases/ReplyInput) |

#### Returns

`Promise`\<`Message`\<`boolean`\>\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`followUp`](../../contexts/classes/BaseContext#followup)

***

### info()

> **info**(`input`, `options?`): `Promise`\<`void`\>

Defined in: [src/context.ts:353](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L353)

State-aware send of a blue info embed.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`EmbedPresetInput`](../../contexts/type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`info`](../../contexts/classes/BaseContext#info)

***

### progress()

> **progress**(`initial`): `Promise`\<[`ProgressHandle`](../../contexts/interfaces/ProgressHandle)\>

Defined in: [src/context.ts:329](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L329)

Post an initial progress line, then edit it as work proceeds.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `initial` | `string` |

#### Returns

`Promise`\<[`ProgressHandle`](../../contexts/interfaces/ProgressHandle)\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`progress`](../../contexts/classes/BaseContext#progress)

***

### reply()

> **reply**(`input`): `Promise`\<`InteractionResponse`\<`boolean`\>\>

Defined in: [src/context.ts:210](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L210)

Send the initial response to the interaction.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`ReplyInput`](../../contexts/type-aliases/ReplyInput) |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`reply`](../../contexts/classes/BaseContext#reply)

***

### replyEphemeral()

> **replyEphemeral**(`input`): `Promise`\<`InteractionResponse`\<`boolean`\>\>

Defined in: [src/context.ts:215](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L215)

Reply, but always hidden to everyone except the invoking user.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`ReplyInput`](../../contexts/type-aliases/ReplyInput) |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`replyEphemeral`](../../contexts/classes/BaseContext#replyephemeral)

***

### replyError()

> **replyError**(`input`, `options?`): `Promise`\<`InteractionResponse`\<`boolean`\>\>

Defined in: [src/context.ts:363](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L363)

Initial-reply variant of [error](#error) (always `reply`, never `editReply`/`followUp`).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`EmbedPresetInput`](../../contexts/type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`replyError`](../../contexts/classes/BaseContext#replyerror)

***

### replyInfo()

> **replyInfo**(`input`, `options?`): `Promise`\<`InteractionResponse`\<`boolean`\>\>

Defined in: [src/context.ts:373](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L373)

Initial-reply variant of [info](#info).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`EmbedPresetInput`](../../contexts/type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`replyInfo`](../../contexts/classes/BaseContext#replyinfo)

***

### replySuccess()

> **replySuccess**(`input`, `options?`): `Promise`\<`InteractionResponse`\<`boolean`\>\>

Defined in: [src/context.ts:368](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L368)

Initial-reply variant of [success](#success).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`EmbedPresetInput`](../../contexts/type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`replySuccess`](../../contexts/classes/BaseContext#replysuccess)

***

### replyWarn()

> **replyWarn**(`input`, `options?`): `Promise`\<`InteractionResponse`\<`boolean`\>\>

Defined in: [src/context.ts:378](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L378)

Initial-reply variant of [warn](#warn).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`EmbedPresetInput`](../../contexts/type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`replyWarn`](../../contexts/classes/BaseContext#replywarn)

***

### send()

> **send**(`input`): `Promise`\<`void`\>

Defined in: [src/context.ts:241](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L241)

State-aware send: replies, edits a deferred response, or follows up —
whichever is valid given the current interaction state. The single method
most handlers ever need.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`ReplyInput`](../../contexts/type-aliases/ReplyInput) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`send`](../../contexts/classes/BaseContext#send)

***

### sendLong()

> **sendLong**(`text`): `Promise`\<`void`\>

Defined in: [src/context.ts:294](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L294)

Send `text` in 2000-character chunks. The first chunk uses [send](#send);
the rest are follow-ups.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`sendLong`](../../contexts/classes/BaseContext#sendlong)

***

### success()

> **success**(`input`, `options?`): `Promise`\<`void`\>

Defined in: [src/context.ts:348](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L348)

State-aware send of a green success embed.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`EmbedPresetInput`](../../contexts/type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`success`](../../contexts/classes/BaseContext#success)

***

### t()

> **t**(`key`, `params?`): `Promise`\<`string`\>

Defined in: [src/context.ts:182](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L182)

Translate with the configured `client.i18n`. The locale may be resolved
asynchronously (for example from per-guild settings).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `params` | [`TranslationParams`](../../runtime/type-aliases/TranslationParams) |

#### Returns

`Promise`\<`string`\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`t`](../../contexts/classes/BaseContext#t)

***

### userMissing()

> **userMissing**(`required`): (`"CreateInstantInvite"` \| `"KickMembers"` \| `"BanMembers"` \| `"Administrator"` \| `"ManageChannels"` \| `"ManageGuild"` \| `"AddReactions"` \| `"ViewAuditLog"` \| `"PrioritySpeaker"` \| `"Stream"` \| `"ViewChannel"` \| `"SendMessages"` \| `"SendTTSMessages"` \| `"ManageMessages"` \| `"EmbedLinks"` \| `"AttachFiles"` \| `"ReadMessageHistory"` \| `"MentionEveryone"` \| `"UseExternalEmojis"` \| `"ViewGuildInsights"` \| `"Connect"` \| `"Speak"` \| `"MuteMembers"` \| `"DeafenMembers"` \| `"MoveMembers"` \| `"UseVAD"` \| `"ChangeNickname"` \| `"ManageNicknames"` \| `"ManageRoles"` \| `"ManageWebhooks"` \| `"ManageEmojisAndStickers"` \| `"ManageGuildExpressions"` \| `"UseApplicationCommands"` \| `"RequestToSpeak"` \| `"ManageEvents"` \| `"ManageThreads"` \| `"CreatePublicThreads"` \| `"CreatePrivateThreads"` \| `"UseExternalStickers"` \| `"SendMessagesInThreads"` \| `"UseEmbeddedActivities"` \| `"ModerateMembers"` \| `"ViewCreatorMonetizationAnalytics"` \| `"UseSoundboard"` \| `"CreateGuildExpressions"` \| `"CreateEvents"` \| `"UseExternalSounds"` \| `"SendVoiceMessages"` \| `"SetVoiceChannelStatus"` \| `"SendPolls"` \| `"UseExternalApps"` \| `"PinMessages"` \| `"BypassSlowmode"`)[]

Defined in: [src/context.ts:266](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L266)

Permission flag names the invoking USER is missing in the current channel.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `required` | `PermissionResolvable` |

#### Returns

(`"CreateInstantInvite"` \| `"KickMembers"` \| `"BanMembers"` \| `"Administrator"` \| `"ManageChannels"` \| `"ManageGuild"` \| `"AddReactions"` \| `"ViewAuditLog"` \| `"PrioritySpeaker"` \| `"Stream"` \| `"ViewChannel"` \| `"SendMessages"` \| `"SendTTSMessages"` \| `"ManageMessages"` \| `"EmbedLinks"` \| `"AttachFiles"` \| `"ReadMessageHistory"` \| `"MentionEveryone"` \| `"UseExternalEmojis"` \| `"ViewGuildInsights"` \| `"Connect"` \| `"Speak"` \| `"MuteMembers"` \| `"DeafenMembers"` \| `"MoveMembers"` \| `"UseVAD"` \| `"ChangeNickname"` \| `"ManageNicknames"` \| `"ManageRoles"` \| `"ManageWebhooks"` \| `"ManageEmojisAndStickers"` \| `"ManageGuildExpressions"` \| `"UseApplicationCommands"` \| `"RequestToSpeak"` \| `"ManageEvents"` \| `"ManageThreads"` \| `"CreatePublicThreads"` \| `"CreatePrivateThreads"` \| `"UseExternalStickers"` \| `"SendMessagesInThreads"` \| `"UseEmbeddedActivities"` \| `"ModerateMembers"` \| `"ViewCreatorMonetizationAnalytics"` \| `"UseSoundboard"` \| `"CreateGuildExpressions"` \| `"CreateEvents"` \| `"UseExternalSounds"` \| `"SendVoiceMessages"` \| `"SetVoiceChannelStatus"` \| `"SendPolls"` \| `"UseExternalApps"` \| `"PinMessages"` \| `"BypassSlowmode"`)[]

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`userMissing`](../../contexts/classes/BaseContext#usermissing)

***

### warn()

> **warn**(`input`, `options?`): `Promise`\<`void`\>

Defined in: [src/context.ts:358](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L358)

State-aware send of a yellow warn embed.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`EmbedPresetInput`](../../contexts/type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`warn`](../../contexts/classes/BaseContext#warn)

***

### withTyping()

> **withTyping**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: [src/context.ts:314](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L314)

Keep the channel typing indicator alive while `fn` runs (Discord expires
typing after ~10s).

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `fn` | () => `Promise`\<`T`\> |

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`withTyping`](../../contexts/classes/BaseContext#withtyping)
