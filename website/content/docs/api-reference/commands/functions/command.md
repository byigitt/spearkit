---
title: "command()"
description: "Define a slash command with type-safe options and a co-located handler."
---

```ts
function command<O, R>(config: CommandConfig<O, R>): SlashCommand;
```

Defined in: [src/commands/command.ts:259](https://github.com/byigitt/spearkit/blob/main/src/commands/command.ts#L259)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `O` *extends* [`OptionMap`](../type-aliases/OptionMap) | `Record`\<`string`, `never`\> |
| `R` | `void` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`CommandConfig`](../interfaces/CommandConfig)\<`O`, `R`\> |

## Returns

[`SlashCommand`](../classes/SlashCommand)

## Example

```ts
export default command({
  name: "echo",
  description: "Repeat a message",
  options: { msg: option.string({ description: "Text", required: true }) },
  run: (ctx) => ctx.reply(ctx.options.msg),
});
```
