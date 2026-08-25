---
title: "option"
description: "Type-safe slash command option builders."
---

> `const` **option**: `object`

Defined in: [src/commands/options.ts:162](https://github.com/byigitt/spearkit/blob/main/src/commands/options.ts#L162)

Type-safe slash command option builders.

## Type Declaration

| Name | Type |
| :------ | :------ |
| `attachment()` | (`config`) => [`OptionDef`](../interfaces/OptionDef)\<`Attachment`, `IsRequired`\<`C`\>\> |
| `boolean()` | (`config`) => [`OptionDef`](../interfaces/OptionDef)\<`boolean`, `IsRequired`\<`C`\>\> |
| `channel()` | (`config`) => [`OptionDef`](../interfaces/OptionDef)\<`ChannelValue`, `IsRequired`\<`C`\>\> |
| `integer()` | (`config`) => [`OptionDef`](../interfaces/OptionDef)\<`ChoiceValue`\<`C`, `number`\>, `IsRequired`\<`C`\>\> |
| `mentionable()` | (`config`) => [`OptionDef`](../interfaces/OptionDef)\<`MentionableValue`, `IsRequired`\<`C`\>\> |
| `number()` | (`config`) => [`OptionDef`](../interfaces/OptionDef)\<`ChoiceValue`\<`C`, `number`\>, `IsRequired`\<`C`\>\> |
| `role()` | (`config`) => [`OptionDef`](../interfaces/OptionDef)\<`RoleValue`, `IsRequired`\<`C`\>\> |
| `string()` | (`config`) => [`OptionDef`](../interfaces/OptionDef)\<`ChoiceValue`\<`C`, `string`\>, `IsRequired`\<`C`\>\> |
| `user()` | (`config`) => [`OptionDef`](../interfaces/OptionDef)\<`User`, `IsRequired`\<`C`\>\> |

## Example

```ts
options: {
  target: option.user({ description: "Who to greet", required: true }),
  loud: option.boolean({ description: "Shout it" }),
}
```
