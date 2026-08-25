---
title: "ResolvedOptions\\<O\\>"
description: "Resolves a whole OptionMap into the handler's options object."
---

> **ResolvedOptions**\<`O`\> = `{ [K in keyof O]: ResolvedOption<O[K]> }`

Defined in: [src/commands/options.ts:93](https://github.com/byigitt/spearkit/blob/main/src/commands/options.ts#L93)

Resolves a whole [OptionMap](OptionMap) into the handler's `options` object.

## Type Parameters

| Type Parameter |
| :------ |
| `O` *extends* [`OptionMap`](OptionMap) |
