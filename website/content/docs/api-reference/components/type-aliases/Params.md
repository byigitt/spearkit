---
title: "Params"
description: "The params object a pattern resolves to (every value is a string)."
---

```ts
type Params<S> = { [K in ParamNames<S>]: string };
```

Defined in: [src/components/customId.ts:17](https://github.com/byigitt/spearkit/blob/main/src/components/customId.ts#L17)

## Type Parameters

| Type Parameter |
| :------ |
| `S` *extends* `string` |
