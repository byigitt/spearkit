---
title: "compareRoles()"
description: "Compare two members by their highest role position. Returns a positive number when a is above b, negative when below, 0 when equal. This is the raw comparison…"
---

> **compareRoles**(`a`, `b`): `number`

Defined in: [src/permissions.ts:77](https://github.com/byigitt/spearkit/blob/main/src/permissions.ts#L77)

Compare two members by their highest role position. Returns a positive number
when `a` is above `b`, negative when below, `0` when equal. This is the raw
comparison Discord enforces for moderation actions.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `a` | `GuildMember` |
| `b` | `GuildMember` |

## Returns

`number`
