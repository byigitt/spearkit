---
title: "mentionableSelect()"
description: "Define a mentionable (user + role) select menu."
---

```ts
function mentionableSelect<P, R>(config: EntitySelectConfig<P> & object): MentionableSelect<P>;
```

Defined in: [src/components/builders.ts:271](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L271)

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

[`MentionableSelect`](../interfaces/MentionableSelect)\<`P`\>
