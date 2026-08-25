---
title: "RunGuardsResult"
description: "The resolved outcome of running a list of guards."
---

```ts
type RunGuardsResult = 
  | {
  allowed: true;
}
  | {
  allowed: false;
  reason: string | undefined;
};
```

Defined in: [src/guards.ts:49](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L49)

