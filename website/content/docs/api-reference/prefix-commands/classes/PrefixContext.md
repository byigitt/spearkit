---
title: "PrefixContext"
description: "The handler argument for a prefix command: the message plus parsed args."
---

Defined in: [src/prefix.ts:114](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L114)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `TArgs` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `never`\> |

## Constructors

### Constructor

```ts
new PrefixContext<TArgs>(
   message: Message, 
   commandName: string, 
   args: string[], 
   rest: string, 
options?: TArgs): PrefixContext<TArgs>;
```

Defined in: [src/prefix.ts:117](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L117)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `message` | `Message` | The triggering message. |
| `commandName` | `string` | The matched command name (as typed). |
| `args` | `string`[] | Whitespace-split arguments after the command name. |
| `rest` | `string` | The raw text after the command name. |
| `options` | `TArgs` | Typed parsed arguments from `args` schema, or `{}` if none. |

#### Returns

`PrefixContext`\<`TArgs`\>

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-args"></a> `args` | `readonly` | `string`[] | Whitespace-split arguments after the command name. |
| <a id="property-commandname"></a> `commandName` | `readonly` | `string` | The matched command name (as typed). |
| <a id="property-message"></a> `message` | `readonly` | `Message` | The triggering message. |
| <a id="property-options"></a> `options` | `readonly` | `TArgs` | Typed parsed arguments from `args` schema, or `{}` if none. |
| <a id="property-rest"></a> `rest` | `readonly` | `string` | The raw text after the command name. |

## Accessors

### author

#### Get Signature

```ts
get author(): User;
```

Defined in: [src/prefix.ts:133](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L133)

##### Returns

`User`

***

### channel

#### Get Signature

```ts
get channel(): 
  | DMChannel
  | PartialDMChannel
  | PartialGroupDMChannel
  | NewsChannel
  | StageChannel
  | TextChannel
  | PublicThreadChannel<boolean>
  | PrivateThreadChannel
  | VoiceChannel;
```

Defined in: [src/prefix.ts:145](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L145)

##### Returns

  \| `DMChannel`
  \| `PartialDMChannel`
  \| `PartialGroupDMChannel`
  \| `NewsChannel`
  \| `StageChannel`
  \| `TextChannel`
  \| `PublicThreadChannel`\<`boolean`\>
  \| `PrivateThreadChannel`
  \| `VoiceChannel`

***

### channelId

#### Get Signature

```ts
get channelId(): string;
```

Defined in: [src/prefix.ts:148](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L148)

##### Returns

`string`

***

### client

#### Get Signature

```ts
get client(): Client<true>;
```

Defined in: [src/prefix.ts:130](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L130)

##### Returns

`Client`\<`true`\>

***

### guild

#### Get Signature

```ts
get guild(): Guild | null;
```

Defined in: [src/prefix.ts:139](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L139)

##### Returns

`Guild` \| `null`

***

### guildId

#### Get Signature

```ts
get guildId(): string | null;
```

Defined in: [src/prefix.ts:142](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L142)

##### Returns

`string` \| `null`

***

### member

#### Get Signature

```ts
get member(): GuildMember | null;
```

Defined in: [src/prefix.ts:136](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L136)

##### Returns

`GuildMember` \| `null`

## Methods

### dm()

```ts
dm(input: string | MessageCreateOptions): Promise<Message<boolean> | null>;
```

Defined in: [src/prefix.ts:197](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L197)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `string` \| `MessageCreateOptions` |

#### Returns

`Promise`\<`Message`\<`boolean`\> \| `null`\>

***

### reply()

```ts
reply(content: string | MessagePayload | MessageReplyOptions): Promise<Message<boolean>>;
```

Defined in: [src/prefix.ts:176](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L176)

Reply to the triggering message.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `content` | `string` \| `MessagePayload` \| `MessageReplyOptions` |

#### Returns

`Promise`\<`Message`\<`boolean`\>\>

***

### send()

```ts
send(content: string | MessagePayload | MessageCreateOptions): Promise<Message<boolean> | undefined>;
```

Defined in: [src/prefix.ts:181](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L181)

Send a message to the same channel (no reply reference).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `content` | `string` \| `MessagePayload` \| `MessageCreateOptions` |

#### Returns

`Promise`\<`Message`\<`boolean`\> \| `undefined`\>

***

### sendLong()

```ts
sendLong(text: string): Promise<void>;
```

Defined in: [src/prefix.ts:187](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L187)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`Promise`\<`void`\>

***

### t()

```ts
t(key: string, params?: TranslationParams): Promise<string>;
```

Defined in: [src/prefix.ts:156](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L156)

Translate with `client.i18n`. Prefix messages have no interaction locale,
so the guild preference (or custom resolver) is used.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `params` | [`TranslationParams`](../../runtime/type-aliases/TranslationParams) |

#### Returns

`Promise`\<`string`\>

***

### withTyping()

```ts
withTyping<T>(fn: () => Promise<T>): Promise<T>;
```

Defined in: [src/prefix.ts:207](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L207)

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
