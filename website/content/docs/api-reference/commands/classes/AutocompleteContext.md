---
title: "AutocompleteContext"
description: "The handler argument for autocomplete requests. Provides the focused value and a typed respond helper."
---

Defined in: [src/commands/context.ts:62](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L62)

## Constructors

### Constructor

```ts
new AutocompleteContext(interaction: AutocompleteInteraction): AutocompleteContext;
```

Defined in: [src/commands/context.ts:63](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L63)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `AutocompleteInteraction` |

#### Returns

`AutocompleteContext`

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-interaction"></a> `interaction` | `readonly` | `AutocompleteInteraction` |

## Accessors

### client

#### Get Signature

```ts
get client(): Client<true>;
```

Defined in: [src/commands/context.ts:65](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L65)

##### Returns

`Client`\<`true`\>

***

### commandName

#### Get Signature

```ts
get commandName(): string;
```

Defined in: [src/commands/context.ts:80](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L80)

##### Returns

`string`

***

### focusedName

#### Get Signature

```ts
get focusedName(): string;
```

Defined in: [src/commands/context.ts:85](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L85)

Name of the option currently being completed.

##### Returns

`string`

***

### guild

#### Get Signature

```ts
get guild(): Guild | null;
```

Defined in: [src/commands/context.ts:71](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L71)

##### Returns

`Guild` \| `null`

***

### guildId

#### Get Signature

```ts
get guildId(): string | null;
```

Defined in: [src/commands/context.ts:74](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L74)

##### Returns

`string` \| `null`

***

### locale

#### Get Signature

```ts
get locale(): Locale;
```

Defined in: [src/commands/context.ts:77](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L77)

##### Returns

`Locale`

***

### user

#### Get Signature

```ts
get user(): User;
```

Defined in: [src/commands/context.ts:68](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L68)

##### Returns

`User`

***

### value

#### Get Signature

```ts
get value(): string;
```

Defined in: [src/commands/context.ts:90](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L90)

Current partial value typed by the user.

##### Returns

`string`

## Methods

### respond()

```ts
respond(choices: OptionChoice<string | number>[]): Promise<void>;
```

Defined in: [src/commands/context.ts:119](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L119)

Send autocomplete suggestions (capped at the discord limit of 25).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `choices` | [`OptionChoice`](../interfaces/OptionChoice)\<`string` \| `number`\>[] |

#### Returns

`Promise`\<`void`\>

***

### suggest()

```ts
suggest(items: 
  | readonly string[]
| readonly OptionChoice<string | number>[], options?: FilterChoicesOptions): Promise<void>;
```

Defined in: [src/commands/context.ts:133](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L133)

Filter `items` by the focused value and respond. Empty query returns the
first 25 entries.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `items` | \| readonly `string`[] \| readonly [`OptionChoice`](../interfaces/OptionChoice)\<`string` \| `number`\>[] |
| `options?` | [`FilterChoicesOptions`](../../utilities/interfaces/FilterChoicesOptions) |

#### Returns

`Promise`\<`void`\>

***

### t()

```ts
t(key: string, params?: TranslationParams): Promise<string>;
```

Defined in: [src/commands/context.ts:95](https://github.com/byigitt/spearkit/blob/main/src/commands/context.ts#L95)

Translate autocomplete labels with the same locale policy as commands.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `params` | [`TranslationParams`](../../runtime/type-aliases/TranslationParams) |

#### Returns

`Promise`\<`string`\>
