---
title: "requireOwner()"
description: "Require the invoking user to be one of ownerIds (\"bot owners\")."
---

> **requireOwner**(`ownerIds`, `reason?`): [`Guard`](../type-aliases/Guard)

Defined in: [src/guards.ts:119](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L119)

Require the invoking user to be one of `ownerIds` ("bot owners").

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `ownerIds` | readonly `string`[] | `undefined` |
| `reason` | `string` | `"This is owner-only."` |

## Returns

[`Guard`](../type-aliases/Guard)
