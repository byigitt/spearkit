---
title: "ParamNames\\<S\\>"
description: "Names of the {param} placeholders inside a pattern."
---

> **ParamNames**\<`S`\> = `S` *extends* `` `${string}{${infer Name}}${infer Rest}` `` ? `Name` \| `ParamNames`\<`Rest`\> : `never`

Defined in: [src/components/customId.ts:12](https://github.com/byigitt/spearkit/blob/main/src/components/customId.ts#L12)

Names of the `{param}` placeholders inside a pattern.

## Type Parameters

| Type Parameter |
| :------ |
| `S` *extends* `string` |
