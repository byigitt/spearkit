---
title: "PrefixCommandConfig\\<TArgs, R\\>"
description: "Configuration for a prefix command."
---

Defined in: [src/prefix.ts:54](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L54)

Configuration for a prefix command.

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `TArgs` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `never`\> |
| `R` | `void` |

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-aliases"></a> `aliases?` | readonly `string`[] | Alternative names that also trigger the command. |
| <a id="property-args"></a> `args?` | (`builder`) => [`PrefixArgsBuilder`](../classes/PrefixArgsBuilder)\<`TArgs`\> | Typed argument schema; `ctx.options` will be shaped from this. |
| <a id="property-cooldown"></a> `cooldown?` | [`CooldownInput`](../../cooldowns-and-scaling/type-aliases/CooldownInput) | Rate-limit this command. A number is a duration in ms. |
| <a id="property-description"></a> `description?` | `string` | Human description (for your own help command). |
| <a id="property-enabled"></a> `enabled?` | `boolean` | Skip registration when `false`. Default `true`. |
| <a id="property-guards"></a> `guards?` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | Preconditions evaluated before the handler runs. |
| <a id="property-name"></a> `name` | `string` | Primary command name (the word after the prefix). |
| <a id="property-run"></a> `run` | (`ctx`) => `Awaitable`\<`R`\> | Handler invoked with a [PrefixContext](../classes/PrefixContext) typed by `args`. |
