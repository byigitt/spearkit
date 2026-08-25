---
title: "userSelect()"
description: "Define a user select menu."
---

```ts
function userSelect<P, R>(config: EntitySelectConfig<P> & object): UserSelect<P>;
```

Defined in: [src/components/builders.ts:204](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L204)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `P` *extends* `string` | - |
| `R` | `void` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`EntitySelectConfig`](../interfaces/EntitySelectConfig)\<`P`\> & `object` |

## Returns

[`UserSelect`](../interfaces/UserSelect)\<`P`\>
