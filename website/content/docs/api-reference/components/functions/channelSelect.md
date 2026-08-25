---
title: "channelSelect()"
description: "Define a channel select menu, optionally restricted to channel types."
---

```ts
function channelSelect<P, R>(config: EntitySelectConfig<P> & object): ChannelSelect<P>;
```

Defined in: [src/components/builders.ts:246](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L246)

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

[`ChannelSelect`](../interfaces/ChannelSelect)\<`P`\>
