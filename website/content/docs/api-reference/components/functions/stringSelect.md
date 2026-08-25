---
title: "stringSelect()"
description: "Define a string select menu, its custom-id pattern and its handler."
---

```ts
function stringSelect<P, R>(config: StringSelectConfig<P, R>): StringSelect<P>;
```

Defined in: [src/components/builders.ts:176](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L176)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `P` *extends* `string` | - |
| `R` | `void` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`StringSelectConfig`](../interfaces/StringSelectConfig)\<`P`, `R`\> |

## Returns

[`StringSelect`](../interfaces/StringSelect)\<`P`\>
