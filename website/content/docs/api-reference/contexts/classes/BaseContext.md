---
title: "Abstract Class: BaseContext"
description: "Ergonomic base wrapper shared by every interaction context (commands, buttons, selects, modals). Exposes the common actor/location accessors plus reply helpers that smooth over discord.js' state machine."
---

Defined in: [src/context.ts:150](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L150)

## Extended by

- [`CommandContext`](../../commands/classes/CommandContext)
- [`UserContextMenuContext`](../../commands/classes/UserContextMenuContext)
- [`MessageContextMenuContext`](../../commands/classes/MessageContextMenuContext)
- [`MessageComponentContext`](../../components/classes/MessageComponentContext)
- [`ModalContext`](../../components/classes/ModalContext)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `I` *extends* `RepliableInteraction` | `RepliableInteraction` |

## Constructors

### Constructor

```ts
new BaseContext<I>(interaction: I): BaseContext<I>;
```

Defined in: [src/context.ts:151](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L151)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `I` |

#### Returns

`BaseContext`\<`I`\>

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-interaction"></a> `interaction` | `readonly` | `I` |

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

***

### channel

#### Get Signature

```ts
get channel(): TextBasedChannel | null;
```

Defined in: [src/context.ts:168](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L168)

##### Returns

`TextBasedChannel` \| `null`

***

### channelId

#### Get Signature

```ts
get channelId(): string | null;
```

Defined in: [src/context.ts:171](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L171)

##### Returns

`string` \| `null`

***

### client

#### Get Signature

```ts
get client(): I["client"];
```

Defined in: [src/context.ts:153](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L153)

##### Returns

`I`\[`"client"`\]

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

***

### guild

#### Get Signature

```ts
get guild(): Guild | null;
```

Defined in: [src/context.ts:162](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L162)

##### Returns

`Guild` \| `null`

***

### guildId

#### Get Signature

```ts
get guildId(): string | null;
```

Defined in: [src/context.ts:165](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L165)

##### Returns

`string` \| `null`

***

### locale

#### Get Signature

```ts
get locale(): Locale;
```

Defined in: [src/context.ts:174](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L174)

##### Returns

`Locale`

***

### member

#### Get Signature

```ts
get member(): GuildMember | APIInteractionGuildMember | null;
```

Defined in: [src/context.ts:159](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L159)

##### Returns

`GuildMember` \| `APIInteractionGuildMember` \| `null`

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

***

### user

#### Get Signature

```ts
get user(): User;
```

Defined in: [src/context.ts:156](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L156)

##### Returns

`User`

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
| `options` | [`AwaitMessageOptions`](../interfaces/AwaitMessageOptions) |

#### Returns

`Promise`\<`Message`\<`boolean`\> \| `null`\>

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
| `input` | [`ReplyInput`](../type-aliases/ReplyInput) |

#### Returns

`Promise`\<`Message`\<`boolean`\>\>

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
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`void`\>

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
| `input` | [`ReplyInput`](../type-aliases/ReplyInput) |

#### Returns

`Promise`\<`Message`\<`boolean`\>\>

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
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`void`\>

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

`Promise`\<[`ProgressHandle`](../interfaces/ProgressHandle)\>

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
| `input` | [`ReplyInput`](../type-aliases/ReplyInput) |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

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
| `input` | [`ReplyInput`](../type-aliases/ReplyInput) |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

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
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

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
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

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
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

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
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\>\>

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
| `input` | [`ReplyInput`](../type-aliases/ReplyInput) |

#### Returns

`Promise`\<`void`\>

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
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`void`\>

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
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |
| `options` | \{ `ephemeral?`: `boolean`; \} |
| `options.ephemeral?` | `boolean` |

#### Returns

`Promise`\<`void`\>

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
