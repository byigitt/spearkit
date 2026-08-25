---
title: "requireAllRoles()"
description: "Require the invoking member to hold EVERY one of these role ids."
---

```ts
function requireAllRoles(roleIds: readonly string[], reason?: string): Guard;
```

Defined in: [src/guards.ts:108](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L108)

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `roleIds` | readonly `string`[] | `undefined` |
| `reason` | `string` | `"You're missing one of the required roles."` |

## Returns

[`Guard`](../type-aliases/Guard)
