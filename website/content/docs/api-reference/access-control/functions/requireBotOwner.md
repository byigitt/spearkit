---
title: "requireBotOwner()"
description: "Require the invoking user to be a configured bot owner (new SpearClient({ owners })) or the Discord application owner."
---

> **requireBotOwner**(`reason?`): [`Guard`](../type-aliases/Guard)

Defined in: [src/guards.ts:141](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L141)

Require the invoking user to be a configured bot owner
(`new SpearClient({ owners })`) or the Discord application owner.

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `reason` | `string` | `"This is owner-only."` |

## Returns

[`Guard`](../type-aliases/Guard)
