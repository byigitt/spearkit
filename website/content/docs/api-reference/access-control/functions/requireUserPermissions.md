---
title: "requireUserPermissions()"
description: "Require the invoking member to hold a Discord permission flag."
---

> **requireUserPermissions**(`permission`, `reason?`): [`Guard`](../type-aliases/Guard)

Defined in: [src/guards.ts:155](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L155)

Require the invoking member to hold a Discord permission flag.

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `permission` | `PermissionResolvable` | `undefined` |
| `reason` | `string` | `"You don't have permission to use this."` |

## Returns

[`Guard`](../type-aliases/Guard)
