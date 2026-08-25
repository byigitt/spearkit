---
title: "CooldownOverrides"
description: "Per-user and per-role duration overrides (milliseconds; 0 disables)."
---

Defined in: [src/cooldown.ts:22](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L22)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-roles"></a> `roles?` | `Readonly`\<`Record`\<`string`, `number`\>\> | `roleId -> duration ms`. The most lenient matching role wins. |
| <a id="property-users"></a> `users?` | `Readonly`\<`Record`\<`string`, `number`\>\> | `userId -> duration ms`. |
