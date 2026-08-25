---
title: "ResolvedOptions"
description: "Resolves a whole OptionMap into the handler's options object."
---

```ts
type ResolvedOptions<O> = { [K in keyof O]: ResolvedOption<O[K]> };
```

Defined in: [src/commands/options.ts:93](https://github.com/byigitt/spearkit/blob/main/src/commands/options.ts#L93)

## Type Parameters

| Type Parameter |
| :------ |
| `O` *extends* [`OptionMap`](OptionMap) |
