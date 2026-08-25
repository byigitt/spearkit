---
title: "row()"
description: "Wrap one or more component builders in an action row."
---

```ts
function row<C>(...components: C[]): ActionRowBuilder<C>;
```

Defined in: [src/components/row.ts:14](https://github.com/byigitt/spearkit/blob/main/src/components/row.ts#L14)

A row holds up to five buttons, or exactly one select menu.

## Type Parameters

| Type Parameter |
| :------ |
| `C` *extends* `MessageActionRowComponentBuilder` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| ...`components` | `C`[] |

## Returns

`ActionRowBuilder`\<`C`\>

## Example

```ts
const components = [row(yes.build(), no.build())];
await channel.send({ content: "Vote:", components });
```
