---
title: "CommandContext"
description: "The handler argument for a slash command. Wraps the discord.js interaction and exposes the resolved, fully-typed options."
---

Defined in: [src/commands/context.ts:24](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L24)

## Extends

- [`BaseContext`](../../contexts/classes/BaseContext)\<`ChatInputCommandInteraction`\>

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `O` *extends* [`OptionMap`](../type-aliases/OptionMap) | [`OptionMap`](../type-aliases/OptionMap) |

## Constructors

### Constructor

```ts
new CommandContext<O>(interaction: ChatInputCommandInteraction, options: ResolvedOptions<O>): CommandContext<O>;
```

Defined in: [src/commands/context.ts:25](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L25)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `interaction` | `ChatInputCommandInteraction` | - |
| `options` | [`ResolvedOptions`](../type-aliases/ResolvedOptions)\<`O`\> | Resolved option values, typed from the command's `options` map. |

#### Returns

`CommandContext`\<`O`\>

#### Overrides

[`BaseContext`](../../contexts/classes/BaseContext).[`constructor`](../../contexts/classes/BaseContext#constructor)

## Properties

| Property | Modifier | Type | Description | Inherited from |
| :------ | :------ | :------ | :------ | :------ |
| <a id="property-interaction"></a> `interaction` | `readonly` | `ChatInputCommandInteraction` | - | [`BaseContext`](../../contexts/classes/BaseContext).[`interaction`](../../contexts/classes/BaseContext#property-interaction) |
| <a id="property-options"></a> `options` | `readonly` | [`ResolvedOptions`](../type-aliases/ResolvedOptions)\<`O`\> | Resolved option values, typed from the command's `options` map. | - |

## Accessors

### botPermissions

#### Get Signature

```ts
get botPermissions(): Readonly<PermissionsBitField>;
```

Defined in: [src/context.ts:252](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L252)

The bot's resolved permissions in the current channel.

##### Returns

`Readonly`\<`PermissionsBitField`\>

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`botPermissions`](../../contexts/classes/BaseContext#botpermissions)

***

### channel

#### Get Signature

```ts
get channel(): TextBasedChannel | null;
```

Defined in: [src/context.ts:168](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L168)

##### Returns

`TextBasedChannel` \| `null`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`channel`](../../contexts/classes/BaseContext#channel)

***

### channelId

#### Get Signature

```ts
get channelId(): string | null;
```

Defined in: [src/context.ts:171](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L171)

##### Returns

`string` \| `null`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`channelId`](../../contexts/classes/BaseContext#channelid)

***

### client

#### Get Signature

```ts
get client(): I["client"];
```

Defined in: [src/context.ts:153](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L153)

##### Returns

`I`\[`"client"`\]

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`client`](../../contexts/classes/BaseContext#client)

***

### commandName

#### Get Signature

```ts
get commandName(): string;
```

Defined in: [src/commands/context.ts:33](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L33)

##### Returns

`string`

***

### deferred

#### Get Signature

```ts
get deferred(): boolean;
```

Defined in: [src/context.ts:201](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L201)

Whether the interaction is already deferred.

##### Returns

`boolean`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`deferred`](../../contexts/classes/BaseContext#deferred)

***

### guild

#### Get Signature

```ts
get guild(): Guild | null;
```

Defined in: [src/context.ts:162](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L162)

##### Returns

`Guild` \| `null`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`guild`](../../contexts/classes/BaseContext#guild)

***

### guildId

#### Get Signature

```ts
get guildId(): string | null;
```

Defined in: [src/context.ts:165](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L165)

##### Returns

`string` \| `null`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`guildId`](../../contexts/classes/BaseContext#guildid)

***

### locale

#### Get Signature

```ts
get locale(): Locale;
```

Defined in: [src/context.ts:174](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L174)

##### Returns

`Locale`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`locale`](../../contexts/classes/BaseContext#locale)

***

### member

#### Get Signature

```ts
get member(): GuildMember | APIInteractionGuildMember | null;
```

Defined in: [src/context.ts:159](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L159)

##### Returns

`GuildMember` \| `APIInteractionGuildMember` \| `null`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`member`](../../contexts/classes/BaseContext#member)

***

### replied

#### Get Signature

```ts
get replied(): boolean;
```

Defined in: [src/context.ts:205](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L205)

Whether the interaction already received an initial response.

##### Returns

`boolean`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`replied`](../../contexts/classes/BaseContext#replied)

***

### subcommand

#### Get Signature

```ts
get subcommand(): string | null;
```

Defined in: [src/commands/context.ts:38](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L38)

The invoked subcommand name, if any.

##### Returns

`string` \| `null`

***

### user

#### Get Signature

```ts
get user(): User;
```

Defined in: [src/context.ts:156](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L156)

##### Returns

`User`

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`user`](../../contexts/classes/BaseContext#user)

## Methods

### awaitMessageFrom()

```ts
awaitMessageFrom(userId?: string, options?: AwaitMessageOptions): Promise<Message<boolean> | null>;
```

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

### awaitModal()

```ts
awaitModal(modal: ModalLike, options?: AwaitModalOptions): Promise<ModalSubmitInteraction<CacheType> | null>;
```

Defined in: [src/commands/context.ts:53](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L53)

Show a modal and wait for the user to submit it, resolving to the submission
or `null` if they dismiss it / it times out. Scoped to this user and modal.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `modal` | [`ModalLike`](../../contexts/type-aliases/ModalLike) |
| `options?` | [`AwaitModalOptions`](../../contexts/interfaces/AwaitModalOptions) |

#### Returns

`Promise`\<`ModalSubmitInteraction`\<`CacheType`\> \| `null`\>

***

### botMissing()

```ts
botMissing(required: PermissionResolvable): (
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

Defined in: [src/context.ts:261](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L261)

Permission flag names the BOT is missing in the current channel — empty when
it has them all. Zero-fetch: reads the permissions Discord attached to the
interaction. Use before an action that needs elevated permissions.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `required` | `PermissionResolvable` |

#### Returns

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

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`botMissing`](../../contexts/classes/BaseContext#botmissing)

***

### defer()

```ts
defer(options?: object): Promise<InteractionResponse<boolean>>;
```

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

```ts
dm(input: string | MessageCreateOptions): Promise<Message<boolean> | null>;
```

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

```ts
editReply(input: ReplyInput): Promise<Message<boolean>>;
```

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

```ts
error(input: EmbedPresetInput, options?: object): Promise<void>;
```

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

```ts
followUp(input: ReplyInput): Promise<Message<boolean>>;
```

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

```ts
info(input: EmbedPresetInput, options?: object): Promise<void>;
```

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

```ts
progress(initial: string): Promise<ProgressHandle>;
```

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

```ts
reply(input: ReplyInput): Promise<InteractionResponse<boolean>>;
```

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

```ts
replyEphemeral(input: ReplyInput): Promise<InteractionResponse<boolean>>;
```

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

```ts
replyError(input: EmbedPresetInput, options?: object): Promise<InteractionResponse<boolean>>;
```

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

```ts
replyInfo(input: EmbedPresetInput, options?: object): Promise<InteractionResponse<boolean>>;
```

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

```ts
replySuccess(input: EmbedPresetInput, options?: object): Promise<InteractionResponse<boolean>>;
```

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

```ts
replyWarn(input: EmbedPresetInput, options?: object): Promise<InteractionResponse<boolean>>;
```

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

```ts
send(input: ReplyInput): Promise<void>;
```

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

```ts
sendLong(text: string): Promise<void>;
```

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

### showModal()

```ts
showModal(modal: 
  | ModalComponentData
  | JSONEncodable<APIModalInteractionResponseCallbackData>
| ModalBuilder): Promise<void>;
```

Defined in: [src/commands/context.ts:43](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L43)

Present a modal to the user in response to this command.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `modal` | \| `ModalComponentData` \| `JSONEncodable`\<`APIModalInteractionResponseCallbackData`\> \| `ModalBuilder` |

#### Returns

`Promise`\<`void`\>

***

### success()

```ts
success(input: EmbedPresetInput, options?: object): Promise<void>;
```

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

```ts
t(key: string, params?: TranslationParams): Promise<string>;
```

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

```ts
userMissing(required: PermissionResolvable): (
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

Defined in: [src/context.ts:266](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L266)

Permission flag names the invoking USER is missing in the current channel.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `required` | `PermissionResolvable` |

#### Returns

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

#### Inherited from

[`BaseContext`](../../contexts/classes/BaseContext).[`userMissing`](../../contexts/classes/BaseContext#usermissing)

***

### warn()

```ts
warn(input: EmbedPresetInput, options?: object): Promise<void>;
```

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

```ts
withTyping<T>(fn: () => Promise<T>): Promise<T>;
```

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
