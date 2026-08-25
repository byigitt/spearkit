---
title: "checkbox()"
description: "Define a modal checkbox field (a single yes/no tick). Checkboxes cannot be required per the Discord spec; the handler always receives a boolean."
---

```ts
function checkbox(config: object): CheckboxDef;
```

Defined in: [src/components/builders.ts:550](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L550)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | \{ `defaultChecked?`: `boolean`; `description?`: `string`; `label`: `string`; \} |
| `config.defaultChecked?` | `boolean` |
| `config.description?` | `string` |
| `config.label` | `string` |

## Returns

[`CheckboxDef`](../interfaces/CheckboxDef)

## Example

```ts
checkbox({ label: "I understand", defaultChecked: false })
```
