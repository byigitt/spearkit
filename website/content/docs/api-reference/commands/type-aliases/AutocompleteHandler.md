---
title: "AutocompleteHandler"
description: "Provides autocomplete suggestions for an option as the user types."
---

```ts
type AutocompleteHandler<V> = (ctx: AutocompleteContext) => Awaitable<OptionChoice<V>[] | void>;
```

Defined in: [src/commands/options.ts:51](https://github.com/byigitt/spearkit/blob/main/src/commands/options.ts#L51)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `V` *extends* `string` \| `number` | `string` \| `number` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `ctx` | [`AutocompleteContext`](../classes/AutocompleteContext) |

## Returns

`Awaitable`\<[`OptionChoice`](../interfaces/OptionChoice)\<`V`\>[] \| `void`\>
