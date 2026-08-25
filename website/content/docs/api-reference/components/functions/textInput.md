---
title: "textInput()"
description: "Define a single modal text-input field."
---

```ts
function textInput(config: object): TextInputDef;
```

Defined in: [src/components/builders.ts:458](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L458)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | \{ `description?`: `string`; `label`: `string`; `maxLength?`: `number`; `minLength?`: `number`; `placeholder?`: `string`; `required?`: `boolean`; `style?`: [`TextInputStyleInput`](../type-aliases/TextInputStyleInput); `value?`: `string`; \} |
| `config.description?` | `string` |
| `config.label` | `string` |
| `config.maxLength?` | `number` |
| `config.minLength?` | `number` |
| `config.placeholder?` | `string` |
| `config.required?` | `boolean` |
| `config.style?` | [`TextInputStyleInput`](../type-aliases/TextInputStyleInput) |
| `config.value?` | `string` |

## Returns

[`TextInputDef`](../interfaces/TextInputDef)

## Example

```ts
textInput({ label: "Why", style: "Paragraph", required: true })
```
