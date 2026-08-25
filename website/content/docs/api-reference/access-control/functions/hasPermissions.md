---
title: "hasPermissions()"
description: "Whether who has all of required in channel."
---

```ts
function hasPermissions(
   channel: GuildBasedChannel, 
   who: PermissionHolder, 
   required: PermissionResolvable): boolean;
```

Defined in: [src/permissions.ts:64](https://github.com/byigitt/spearkit/blob/main/src/permissions.ts#L64)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `channel` | `GuildBasedChannel` |
| `who` | [`PermissionHolder`](../type-aliases/PermissionHolder) |
| `required` | `PermissionResolvable` |

## Returns

`boolean`
