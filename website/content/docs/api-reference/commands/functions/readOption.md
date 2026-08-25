---
title: "readOption()"
description: "Reads a resolved option value off a discord.js option resolver."
---

```ts
function readOption(
   resolver: OptionReader, 
   name: string, 
   def: AnyOptionDef): OptionValue | undefined;
```

Defined in: [src/commands/options.ts:257](https://github.com/byigitt/spearkit/blob/main/src/commands/options.ts#L257)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `resolver` | `OptionReader` |
| `name` | `string` |
| `def` | [`AnyOptionDef`](../type-aliases/AnyOptionDef) |

## Returns

[`OptionValue`](../type-aliases/OptionValue) \| `undefined`
