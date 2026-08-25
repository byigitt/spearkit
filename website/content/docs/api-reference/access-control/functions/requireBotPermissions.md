---
title: "requireBotPermissions()"
description: "Require the BOT's own member to hold a Discord permission flag."
---

> **requireBotPermissions**(`permission`, `reason?`): [`Guard`](../type-aliases/Guard)

Defined in: [src/guards.ts:167](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L167)

Require the BOT's own member to hold a Discord permission flag.

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `permission` | `PermissionResolvable` | `undefined` |
| `reason` | `string` | `"I don't have permission to do that here."` |

## Returns

[`Guard`](../type-aliases/Guard)
