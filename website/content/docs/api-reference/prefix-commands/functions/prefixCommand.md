---
title: "prefixCommand()"
description: "Define a prefix command."
---

```ts
function prefixCommand<TArgs, R>(config: PrefixCommandConfig<TArgs, R>): PrefixCommand;
```

Defined in: [src/prefix.ts:90](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L90)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `TArgs` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `never`\> |
| `R` | `void` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`PrefixCommandConfig`](../interfaces/PrefixCommandConfig)\<`TArgs`, `R`\> |

## Returns

[`PrefixCommand`](../interfaces/PrefixCommand)
