---
title: "CommandErrorHandler"
description: "Error hook invoked when a command handler throws."
---

```ts
type CommandErrorHandler = (error: Error, interaction: ChatInputCommandInteraction, commandName: string) => Awaitable<void>;
```

Defined in: [src/commands/registry.ts:27](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L27)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `Error` |
| `interaction` | `ChatInputCommandInteraction` |
| `commandName` | `string` |

## Returns

`Awaitable`\<`void`\>
