---
title: "dmOnly()"
description: "Require the interaction/message to come from a DM."
---

```ts
function dmOnly(reason?: string): Guard;
```

Defined in: [src/guards.ts:74](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L74)

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `reason` | `string` | `"This can only be used in DMs."` |

## Returns

[`Guard`](../type-aliases/Guard)
