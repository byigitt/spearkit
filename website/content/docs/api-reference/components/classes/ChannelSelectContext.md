---
title: "ChannelSelectContext\\<P\\>"
description: "Context for a channel select."
---

Defined in: [src/components/context.ts:136](https://github.com/byigitt/spearkit/blob/main/src/components/context.ts#L136)

Context for a channel select.

## Extends

- [`MessageComponentContext`](MessageComponentContext)\<`P`, `ChannelSelectMenuInteraction`\>

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `P` | `Record`\<`string`, `never`\> |

## Constructors

### Constructor

> **new ChannelSelectContext**\<`P`\>(`interaction`, `params`): `ChannelSelectContext`\<`P`\>

Defined in: [src/components/context.ts:41](https://github.com/byigitt/spearkit/blob/main/src/components/context.ts#L41)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `interaction` | `ChannelSelectMenuInteraction` | - |
| `params` | `P` | Params extracted from the custom-id pattern. |

#### Returns

`ChannelSelectContext`\<`P`\>

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`constructor`](MessageComponentContext#constructor)

## Properties

| Property | Modifier | Type | Description | Inherited from |
| :------ | :------ | :------ | :------ | :------ |
| <a id="property-interaction"></a> `interaction` | `readonly` | `ChannelSelectMenuInteraction` | - | [`MessageComponentContext`](MessageComponentContext).[`interaction`](MessageComponentContext#property-interaction) |
| <a id="property-params"></a> `params` | `readonly` | `P` | Params extracted from the custom-id pattern. | [`MessageComponentContext`](MessageComponentContext).[`params`](MessageComponentContext#property-params) |

## Accessors

### botPermissions

#### Get Signature

> **get** **botPermissions**(): `Readonly`\<`PermissionsBitField`\>

Defined in: [src/context.ts:252](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L252)

The bot's resolved permissions in the current channel.

##### Returns

`Readonly`\<`PermissionsBitField`\>

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`botPermissions`](MessageComponentContext#botpermissions)

***

### channel

#### Get Signature

> **get** **channel**(): `TextBasedChannel` \| `null`

Defined in: [src/context.ts:168](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L168)

##### Returns

`TextBasedChannel` \| `null`

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`channel`](MessageComponentContext#channel)

***

### channelId

#### Get Signature

> **get** **channelId**(): `string` \| `null`

Defined in: [src/context.ts:171](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L171)

##### Returns

`string` \| `null`

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`channelId`](MessageComponentContext#channelid)

***

### channels

#### Get Signature

> **get** **channels**(): `Collection`\<`string`, `Channel` \| `APIChannel`\>

Defined in: [src/components/context.ts:143](https://github.com/byigitt/spearkit/blob/main/src/components/context.ts#L143)

##### Returns

`Collection`\<`string`, `Channel` \| `APIChannel`\>

***

### client

#### Get Signature

> **get** **client**(): `I`\[`"client"`\]

Defined in: [src/context.ts:153](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L153)

##### Returns

`I`\[`"client"`\]

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`client`](MessageComponentContext#client)

***

### customId

#### Get Signature

> **get** **customId**(): `string`

Defined in: [src/components/context.ts:50](https://github.com/byigitt/spearkit/blob/main/src/components/context.ts#L50)

The raw custom-id that triggered this interaction.

##### Returns

`string`

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`customId`](MessageComponentContext#customid)

***

### deferred

#### Get Signature

> **get** **deferred**(): `boolean`

Defined in: [src/context.ts:201](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L201)

Whether the interaction is already deferred.

##### Returns

`boolean`

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`deferred`](MessageComponentContext#deferred)

***

### guild

#### Get Signature

> **get** **guild**(): `Guild` \| `null`

Defined in: [src/context.ts:162](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L162)

##### Returns

`Guild` \| `null`

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`guild`](MessageComponentContext#guild)

***

### guildId

#### Get Signature

> **get** **guildId**(): `string` \| `null`

Defined in: [src/context.ts:165](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L165)

##### Returns

`string` \| `null`

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`guildId`](MessageComponentContext#guildid)

***

### locale

#### Get Signature

> **get** **locale**(): `Locale`

Defined in: [src/context.ts:174](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L174)

##### Returns

`Locale`

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`locale`](MessageComponentContext#locale)

***

### member

#### Get Signature

> **get** **member**(): `GuildMember` \| `APIInteractionGuildMember` \| `null`

Defined in: [src/context.ts:159](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L159)

##### Returns

`GuildMember` \| `APIInteractionGuildMember` \| `null`

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`member`](MessageComponentContext#member)

***

### message

#### Get Signature

> **get** **message**(): `Message`\<`boolean`\>

Defined in: [src/components/context.ts:55](https://github.com/byigitt/spearkit/blob/main/src/components/context.ts#L55)

The message the component lives on.

##### Returns

`Message`\<`boolean`\>

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`message`](MessageComponentContext#message)

***

### replied

#### Get Signature

> **get** **replied**(): `boolean`

Defined in: [src/context.ts:205](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L205)

Whether the interaction already received an initial response.

##### Returns

`boolean`

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`replied`](MessageComponentContext#replied)

***

### user

#### Get Signature

> **get** **user**(): `User`

Defined in: [src/context.ts:156](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L156)

##### Returns

`User`

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`user`](MessageComponentContext#user)

***

### values

#### Get Signature

> **get** **values**(): `string`[]

Defined in: [src/components/context.ts:140](https://github.com/byigitt/spearkit/blob/main/src/components/context.ts#L140)

##### Returns

`string`[]

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

[`MessageComponentContext`](MessageComponentContext).[`awaitMessageFrom`](MessageComponentContext#awaitmessagefrom)

***

### awaitModal()

> **awaitModal**(`modal`, `options?`): `Promise`\<`ModalSubmitInteraction`\<`CacheType`\> \| `null`\>

Defined in: [src/components/context.ts:80](https://github.com/byigitt/spearkit/blob/main/src/components/context.ts#L80)

Show a modal and wait for the user to submit it, resolving to the submission
or `null` if they dismiss it / it times out. Scoped to this user and modal.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `modal` | [`ModalLike`](../../contexts/type-aliases/ModalLike) |
| `options?` | [`AwaitModalOptions`](../../contexts/interfaces/AwaitModalOptions) |

#### Returns

`Promise`\<`ModalSubmitInteraction`\<`CacheType`\> \| `null`\>

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`awaitModal`](MessageComponentContext#awaitmodal)

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

[`MessageComponentContext`](MessageComponentContext).[`botMissing`](MessageComponentContext#botmissing)

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

[`MessageComponentContext`](MessageComponentContext).[`defer`](MessageComponentContext#defer)

***

### deferUpdate()

> **deferUpdate**(): `Promise`\<`void`\>

Defined in: [src/components/context.ts:65](https://github.com/byigitt/spearkit/blob/main/src/components/context.ts#L65)

Acknowledge the interaction without editing the message yet.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`deferUpdate`](MessageComponentContext#deferupdate)

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

[`MessageComponentContext`](MessageComponentContext).[`dm`](MessageComponentContext#dm)

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

[`MessageComponentContext`](MessageComponentContext).[`editReply`](MessageComponentContext#editreply)

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

[`MessageComponentContext`](MessageComponentContext).[`error`](MessageComponentContext#error)

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

[`MessageComponentContext`](MessageComponentContext).[`followUp`](MessageComponentContext#followup)

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

[`MessageComponentContext`](MessageComponentContext).[`info`](MessageComponentContext#info)

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

[`MessageComponentContext`](MessageComponentContext).[`progress`](MessageComponentContext#progress)

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

[`MessageComponentContext`](MessageComponentContext).[`reply`](MessageComponentContext#reply)

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

[`MessageComponentContext`](MessageComponentContext).[`replyEphemeral`](MessageComponentContext#replyephemeral)

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

[`MessageComponentContext`](MessageComponentContext).[`replyError`](MessageComponentContext#replyerror)

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

[`MessageComponentContext`](MessageComponentContext).[`replyInfo`](MessageComponentContext#replyinfo)

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

[`MessageComponentContext`](MessageComponentContext).[`replySuccess`](MessageComponentContext#replysuccess)

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

[`MessageComponentContext`](MessageComponentContext).[`replyWarn`](MessageComponentContext#replywarn)

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

[`MessageComponentContext`](MessageComponentContext).[`send`](MessageComponentContext#send)

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

[`MessageComponentContext`](MessageComponentContext).[`sendLong`](MessageComponentContext#sendlong)

***

### showModal()

> **showModal**(`modal`): `Promise`\<`void`\>

Defined in: [src/components/context.ts:70](https://github.com/byigitt/spearkit/blob/main/src/components/context.ts#L70)

Open a modal in response to this component.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `modal` | `ModalComponentData` \| `JSONEncodable`\<`APIModalInteractionResponseCallbackData`\> \| `ModalBuilder` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`showModal`](MessageComponentContext#showmodal)

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

[`MessageComponentContext`](MessageComponentContext).[`success`](MessageComponentContext#success)

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

[`MessageComponentContext`](MessageComponentContext).[`t`](MessageComponentContext#t)

***

### update()

> **update**(`input`): `Promise`\<`void`\>

Defined in: [src/components/context.ts:60](https://github.com/byigitt/spearkit/blob/main/src/components/context.ts#L60)

Edit the message this component belongs to.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `UpdateInput` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`MessageComponentContext`](MessageComponentContext).[`update`](MessageComponentContext#update)

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

[`MessageComponentContext`](MessageComponentContext).[`userMissing`](MessageComponentContext#usermissing)

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

[`MessageComponentContext`](MessageComponentContext).[`warn`](MessageComponentContext#warn)

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

[`MessageComponentContext`](MessageComponentContext).[`withTyping`](MessageComponentContext#withtyping)
