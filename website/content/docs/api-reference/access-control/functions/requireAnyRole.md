---
title: "requireAnyRole()"
description: "Require the invoking member to hold ANY of these role ids."
---

```ts
function requireAnyRole(roleIds: readonly string[], reason?: string): Guard;
```

Defined in: [src/guards.ts:96](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L96)

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `roleIds` | readonly `string`[] | `undefined` |
| `reason` | `string` | `"You don't have permission to use this."` |

## Returns

[`Guard`](../type-aliases/Guard)
