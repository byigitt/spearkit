---
title: "ResolvedFieldValue"
description: "Maps a single field definition to the value passed into the modal handler. Optional fields only widen to include undefined when being empty is a meaningful distinct state (radio groups); collection-valued fields resolve to an empty array instead."
---

```ts
type ResolvedFieldValue<D> = D extends ModalFieldDef<infer V, infer Req> ? Req extends true ? V : V | undefined : never;
```

Defined in: [src/components/builders.ts:423](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L423)

## Type Parameters

| Type Parameter |
| :------ |
| `D` *extends* [`AnyModalFieldDef`](AnyModalFieldDef) |
