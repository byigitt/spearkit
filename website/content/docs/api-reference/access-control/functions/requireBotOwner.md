---
title: "requireBotOwner()"
description: "Require the invoking user to be a configured bot owner (new SpearClient({ owners })) or the Discord application owner."
---

```ts
function requireBotOwner(reason?: string): Guard;
```

Defined in: [src/guards.ts:141](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L141)

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `reason` | `string` | `"This is owner-only."` |

## Returns

[`Guard`](../type-aliases/Guard)
