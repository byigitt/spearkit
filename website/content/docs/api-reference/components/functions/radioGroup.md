---
title: "radioGroup()"
description: "Define a modal radio-group field (exactly one selectable option)."
---

```ts
function radioGroup<C>(config: C): RadioGroupDef<OptionValues<C>, IsRequired<C>>;
```

Defined in: [src/components/builders.ts:495](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L495)

## Type Parameters

| Type Parameter |
| :------ |
| `C` *extends* `FieldConfigBase` & `object` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `C` |

## Returns

[`RadioGroupDef`](../interfaces/RadioGroupDef)\<`OptionValues`\<`C`\>, `IsRequired`\<`C`\>\>

## Example

```ts
radioGroup({
  label: "Type",
  options: [
    { label: "Spam", value: "spam" },
    { label: "Abuse", value: "abuse" },
  ],
})
```
