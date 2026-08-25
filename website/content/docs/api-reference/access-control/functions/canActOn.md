---
title: "canActOn()"
description: "Whether actor outranks target enough to act on them: not the same member, target isn't the guild owner, and actor is either the owner or holds a higher top role."
---

```ts
function canActOn(actor: GuildMember, target: GuildMember): boolean;
```

Defined in: [src/permissions.ts:86](https://github.com/byigitt/spearkit/blob/main/src/permissions.ts#L86)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `actor` | `GuildMember` |
| `target` | `GuildMember` |

## Returns

`boolean`
