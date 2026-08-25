---
title: "CommandErrorHandler"
description: "Error hook invoked when a command handler throws."
---

> **CommandErrorHandler** = (`error`, `interaction`, `commandName`) => `Awaitable`\<`void`\>

Defined in: [src/commands/registry.ts:27](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L27)

Error hook invoked when a command handler throws.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `Error` |
| `interaction` | `ChatInputCommandInteraction` |
| `commandName` | `string` |

## Returns

`Awaitable`\<`void`\>
