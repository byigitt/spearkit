---
title: "subcommand()"
description: "Define a single subcommand with type-safe options and a handler."
---

> **subcommand**\<`O`, `R`\>(`config`): [`Subcommand`](../interfaces/Subcommand)

Defined in: [src/commands/command.ts:282](https://github.com/byigitt/spearkit/blob/main/src/commands/command.ts#L282)

Define a single subcommand with type-safe options and a handler.

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `O` *extends* [`OptionMap`](../type-aliases/OptionMap) | `Record`\<`string`, `never`\> |
| `R` | `void` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`SubcommandConfig`](../interfaces/SubcommandConfig)\<`O`, `R`\> |

## Returns

[`Subcommand`](../interfaces/Subcommand)
