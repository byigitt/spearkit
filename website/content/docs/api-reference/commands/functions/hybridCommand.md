---
title: "hybridCommand()"
description: "Define one command that works both as a slash command and as a prefix command. options drive the slash payload, args drive the prefix parser; run is shared and receives a HybridContext."
---

```ts
function hybridCommand<O, TArgs, R>(config: HybridCommandConfig<O, TArgs, R>): HybridCommand;
```

Defined in: [src/hybrid.ts:207](https://github.com/byigitt/spearkit/blob/main/src/hybrid.ts#L207)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `O` *extends* [`OptionMap`](../type-aliases/OptionMap) | `Record`\<`string`, `never`\> |
| `TArgs` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `never`\> |
| `R` | `void` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`HybridCommandConfig`](../interfaces/HybridCommandConfig)\<`O`, `TArgs`, `R`\> |

## Returns

[`HybridCommand`](../interfaces/HybridCommand)
