---
title: "ModerationCheckResult"
description: "The result of a moderationCheck: pass, or fail with a reason."
---

```ts
type ModerationCheckResult = 
  | {
  ok: true;
}
  | {
  ok: false;
  reason: string;
};
```

Defined in: [src/permissions.ts:94](https://github.com/byigitt/spearkit/blob/main/src/permissions.ts#L94)

