---
title: "SlashCommand"
description: "A registered slash command. Serialises itself for the discord REST API and executes its matching interactions. Construct via command or commandGroup rather than directly."
---

Defined in: [src/commands/command.ts:125](https://github.com/byigitt/spearkit/blob/main/src/commands/command.ts#L125)

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-autodefer"></a> `autoDefer?` | `readonly` | [`AutoDeferConfig`](../interfaces/AutoDeferConfig) | Resolved auto-defer configuration for this command, if any. |
| <a id="property-cooldown"></a> `cooldown?` | `readonly` | [`CooldownConfig`](../../cooldowns-and-scaling/interfaces/CooldownConfig) | Resolved cooldown configuration for this command, if any. |
| <a id="property-enabled"></a> `enabled` | `readonly` | `boolean` | When `false`, SpearClient.register skips this command. Default `true`. |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | Resolved guard list for this command, if any. |
| <a id="property-hasautocomplete"></a> `hasAutocomplete` | `readonly` | `boolean` | Whether any option declares an autocomplete handler. |
| <a id="property-name"></a> `name` | `readonly` | `string` | The top-level command name (used as the registry lookup key). |

## Methods

### autocomplete()

```ts
autocomplete(interaction: AutocompleteInteraction): Promise<void>;
```

Defined in: [src/commands/command.ts:166](https://github.com/byigitt/spearkit/blob/main/src/commands/command.ts#L166)

Execute autocomplete for the focused option.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `AutocompleteInteraction` |

#### Returns

`Promise`\<`void`\>

***

### execute()

```ts
execute(interaction: ChatInputCommandInteraction): Promise<void>;
```

Defined in: [src/commands/command.ts:161](https://github.com/byigitt/spearkit/blob/main/src/commands/command.ts#L161)

Execute the command for an incoming chat-input interaction.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `ChatInputCommandInteraction` |

#### Returns

`Promise`\<`void`\>

***

### toJSON()

```ts
toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody;
```

Defined in: [src/commands/command.ts:156](https://github.com/byigitt/spearkit/blob/main/src/commands/command.ts#L156)

Serialise to the discord REST chat-input command payload.

#### Returns

`RESTPostAPIChatInputApplicationCommandsJSONBody`
