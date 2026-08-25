---
title: "BuildArgs"
description: "Arguments build() accepts: none when the pattern has no params."
---

```ts
type BuildArgs<S> = [ParamNames<S>] extends [never] ? [] : [Params<S>];
```

Defined in: [src/components/customId.ts:20](https://github.com/byigitt/spearkit/blob/main/src/components/customId.ts#L20)

## Type Parameters

| Type Parameter |
| :------ |
| `S` *extends* `string` |
