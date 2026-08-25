---
title: "ParamNames"
description: "Names of the {param} placeholders inside a pattern."
---

```ts
type ParamNames<S> = S extends `${string}{${infer Name}}${infer Rest}` ? Name | ParamNames<Rest> : never;
```

Defined in: [src/components/customId.ts:12](https://github.com/byigitt/spearkit/blob/main/src/components/customId.ts#L12)

## Type Parameters

| Type Parameter |
| :------ |
| `S` *extends* `string` |
