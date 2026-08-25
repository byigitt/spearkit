---
title: "button()"
description: "Define an interactive button: its appearance, its custom-id pattern and its click handler, all in one place. Register it with client.components.add."
---

> **button**\<`P`, `R`\>(`config`): [`Button`](../interfaces/Button)\<`P`\>

Defined in: [src/components/builders.ts:103](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L103)

Define an interactive button: its appearance, its custom-id pattern and its
click handler, all in one place. Register it with `client.components.add`.

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `P` *extends* `string` | - |
| `R` | `void` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`ButtonConfig`](../interfaces/ButtonConfig)\<`P`, `R`\> |

## Returns

[`Button`](../interfaces/Button)\<`P`\>

## Example

```ts
const vote = button({
  id: "vote:{choice}",
  label: "Yes",
  style: "Success",
  run: (ctx) => ctx.reply(`You chose ${ctx.params.choice}`),
});
row(vote.build({ choice: "yes" }));
```
