---
title: "modal()"
description: "Define a modal: its title, its custom-id pattern, its typed fields and a submit handler. Every field renders as a Label component; submitted values arrive…"
---

> **modal**\<`P`, `F`, `R`\>(`config`): [`Modal`](../interfaces/Modal)\<`P`\>

Defined in: [src/components/builders.ts:872](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L872)

Define a modal: its title, its custom-id pattern, its typed fields and a
submit handler. Every field renders as a Label component; submitted values
arrive keyed by field name in `ctx.fields`, inferred from the definitions.

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `P` *extends* `string` | - |
| `F` *extends* [`ModalFieldMap`](../type-aliases/ModalFieldMap) | - |
| `R` | `void` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`ModalConfig`](../interfaces/ModalConfig)\<`P`, `F`, `R`\> |

## Returns

[`Modal`](../interfaces/Modal)\<`P`\>

## Example

```ts
const report = modal({
  id: "report:{userId}",
  title: "Report",
  fields: {
    reason: textInput({ label: "Why", style: "Paragraph", required: true }),
    kind: radioGroup({
      label: "Type",
      options: [{ label: "Spam", value: "spam" }, { label: "Abuse", value: "abuse" }],
    }),
    agree: checkbox({ label: "I understand" }),
  },
  run: (ctx) => {
    ctx.params.userId; // string
    ctx.fields.reason; // string
    ctx.fields.kind;   // "spam" | "abuse"
    ctx.fields.agree;  // boolean
  },
});
```
