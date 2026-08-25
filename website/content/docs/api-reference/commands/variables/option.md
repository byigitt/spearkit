---
title: "option"
description: "Type-safe slash command option builders."
---

```ts
const option: object;
```

Defined in: [src/commands/options.ts:162](https://github.com/byigitt/spearkit/blob/main/src/commands/options.ts#L162)

## Type Declaration

| Name | Type |
| :------ | :------ |
| `attachment()` | (`config`: `C`) => [`OptionDef`](../interfaces/OptionDef)\<`Attachment`, `IsRequired`\<`C`\>\> |
| `boolean()` | (`config`: `C`) => [`OptionDef`](../interfaces/OptionDef)\<`boolean`, `IsRequired`\<`C`\>\> |
| `channel()` | (`config`: `C`) => [`OptionDef`](../interfaces/OptionDef)\<`ChannelValue`, `IsRequired`\<`C`\>\> |
| `integer()` | (`config`: `C`) => [`OptionDef`](../interfaces/OptionDef)\<`ChoiceValue`\<`C`, `number`\>, `IsRequired`\<`C`\>\> |
| `mentionable()` | (`config`: `C`) => [`OptionDef`](../interfaces/OptionDef)\<`MentionableValue`, `IsRequired`\<`C`\>\> |
| `number()` | (`config`: `C`) => [`OptionDef`](../interfaces/OptionDef)\<`ChoiceValue`\<`C`, `number`\>, `IsRequired`\<`C`\>\> |
| `role()` | (`config`: `C`) => [`OptionDef`](../interfaces/OptionDef)\<`RoleValue`, `IsRequired`\<`C`\>\> |
| `string()` | (`config`: `C`) => [`OptionDef`](../interfaces/OptionDef)\<`ChoiceValue`\<`C`, `string`\>, `IsRequired`\<`C`\>\> |
| `user()` | (`config`: `C`) => [`OptionDef`](../interfaces/OptionDef)\<`User`, `IsRequired`\<`C`\>\> |

## Example

```ts
options: {
  target: option.user({ description: "Who to greet", required: true }),
  loud: option.boolean({ description: "Shout it" }),
}
```
