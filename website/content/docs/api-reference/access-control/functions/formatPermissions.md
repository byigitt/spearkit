---
title: "formatPermissions()"
description: "Render permission flag names into a human, comma-separated string. Accepts a PermissionsString array (the output of missingPermissions) or anything PermissionResolvable."
---

```ts
function formatPermissions(permissions: PermissionResolvable): string;
```

Defined in: [src/permissions.ts:200](https://github.com/byigitt/spearkit/blob/main/src/permissions.ts#L200)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `permissions` | `PermissionResolvable` |

## Returns

`string`

## Example

```ts
formatPermissions(botMissingPermissions(ctx.channel, [PermissionFlagsBits.BanMembers]));
// → "Ban Members"
```
