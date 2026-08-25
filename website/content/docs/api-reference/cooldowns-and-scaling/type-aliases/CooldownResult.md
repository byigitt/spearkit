---
title: "CooldownResult"
description: "Whether an action is allowed now, and if not, how long remains."
---

```ts
type CooldownResult = 
  | {
  allowed: true;
}
  | {
  allowed: false;
  remaining: number;
};
```

Defined in: [src/cooldown.ts:60](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L60)

