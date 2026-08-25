---
title: "moderationCheck()"
description: "Validate that both the moderator and the bot may act on target, returning a ready-to-show reason on the first failing rule. Checks, in order: acting on self, acting on the server owner, moderator role hierarchy, and bot role hierarchy."
---

```ts
function moderationCheck(options: ModerationCheckOptions): ModerationCheckResult;
```

Defined in: [src/permissions.ts:117](https://github.com/byigitt/spearkit/blob/main/src/permissions.ts#L117)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`ModerationCheckOptions`](../interfaces/ModerationCheckOptions) |

## Returns

[`ModerationCheckResult`](../type-aliases/ModerationCheckResult)
