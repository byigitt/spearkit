---
title: "HybridContext"
description: "The shared handler context for a hybrid command invocation."
---

Defined in: [src/hybrid.ts:69](https://github.com/byigitt/spearkit/blob/main/src/hybrid.ts#L69)

## Type Parameters

| Type Parameter |
| :------ |
| `TValues` *extends* `Record`\<`string`, `unknown`\> |

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-channel"></a> `channel` | `readonly` | `HybridContextChannel` | - |
| <a id="property-channelid"></a> `channelId` | `readonly` | `string` \| `null` | - |
| <a id="property-client"></a> `client` | `readonly` | `Client` | - |
| <a id="property-guild"></a> `guild` | `readonly` | `Guild` \| `null` | - |
| <a id="property-guildid"></a> `guildId` | `readonly` | `string` \| `null` | - |
| <a id="property-kind"></a> `kind` | `readonly` | `"prefix"` \| `"slash"` | Which surface triggered this run. |
| <a id="property-member"></a> `member` | `readonly` | `GuildMember` \| `APIInteractionGuildMember` \| `null` | - |
| <a id="property-options"></a> `options` | `readonly` | `TValues` | Resolved values: slash options on slash runs, parsed args on prefix runs. |
| <a id="property-raw"></a> `raw` | `readonly` | `Message`\<`boolean`\> \| `ChatInputCommandInteraction`\<`CacheType`\> | The underlying interaction (slash) or message (prefix). |
| <a id="property-user"></a> `user` | `readonly` | `User` | - |

## Methods

### reply()

```ts
reply(input: HybridReplyInput): Promise<InteractionResponse<boolean> | Message<boolean>>;
```

Defined in: [src/hybrid.ts:84](https://github.com/byigitt/spearkit/blob/main/src/hybrid.ts#L84)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`HybridReplyInput`](../type-aliases/HybridReplyInput) |

#### Returns

`Promise`\<`InteractionResponse`\<`boolean`\> \| `Message`\<`boolean`\>\>

***

### t()

```ts
t(key: string, params?: Readonly<Record<string, TranslationParam>>): Promise<string>;
```

Defined in: [src/hybrid.ts:83](https://github.com/byigitt/spearkit/blob/main/src/hybrid.ts#L83)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `params?` | `Readonly`\<`Record`\<`string`, [`TranslationParam`](../../runtime/type-aliases/TranslationParam)\>\> |

#### Returns

`Promise`\<`string`\>
