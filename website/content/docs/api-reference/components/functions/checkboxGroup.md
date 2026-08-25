---
title: "checkboxGroup()"
description: "Define a modal checkbox-group field (zero or more selectable options). Checkbox groups cannot be required; an untouched submit resolves to []."
---

> **checkboxGroup**\<`C`\>(`config`): [`CheckboxGroupDef`](../interfaces/CheckboxGroupDef)\<`OptionValues`\<`C`\>\>

Defined in: [src/components/builders.ts:521](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L521)

Define a modal checkbox-group field (zero or more selectable options).
Checkbox groups cannot be `required`; an untouched submit resolves to `[]`.

## Type Parameters

| Type Parameter |
| :------ |
| `C` *extends* `FieldConfigBase` & `object` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `C` |

## Returns

[`CheckboxGroupDef`](../interfaces/CheckboxGroupDef)\<`OptionValues`\<`C`\>\>

## Example

```ts
checkboxGroup({
  label: "Also",
  minValues: 0,
  maxValues: 3,
  options: [{ label: "Ban", value: "ban" }],
})
```
