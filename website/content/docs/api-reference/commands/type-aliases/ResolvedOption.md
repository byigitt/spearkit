---
title: "ResolvedOption\\<O\\>"
description: "Maps an OptionDef to the value passed into the command handler."
---

> **ResolvedOption**\<`O`\> = `O` *extends* [`OptionDef`](../interfaces/OptionDef)\<infer V, infer Req\> ? `Req` *extends* `true` ? `V` : `V` \| `undefined` : `never`

Defined in: [src/commands/options.ts:86](https://github.com/byigitt/spearkit/blob/main/src/commands/options.ts#L86)

Maps an [OptionDef](../interfaces/OptionDef) to the value passed into the command handler.

## Type Parameters

| Type Parameter |
| :------ |
| `O` *extends* [`AnyOptionDef`](AnyOptionDef) |
