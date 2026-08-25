---
title: "MessageCommandConfig"
description: "Configuration for messageCommand."
---

Defined in: [src/context-menus.ts:66](https://github.com/byigitt/spearkit/blob/main/src/context-menus.ts#L66)

## Extends

- `ContextMenuMeta`

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `R` | `void` |

## Properties

| Property | Type | Description | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-autodefer"></a> `autoDefer?` | [`AutoDeferInput`](../type-aliases/AutoDeferInput) | Auto-`deferReply()` if the handler is slow, preventing `Unknown interaction`. | `ContextMenuMeta.autoDefer` |
| <a id="property-contexts"></a> `contexts?` | readonly [`ContextKind`](../../core/type-aliases/ContextKind)[] | Where the command may run; omit to inherit the installation default. | `ContextMenuMeta.contexts` |
| <a id="property-cooldown"></a> `cooldown?` | [`CooldownInput`](../../cooldowns-and-scaling/type-aliases/CooldownInput) | - | `ContextMenuMeta.cooldown` |
| <a id="property-defaultmemberpermissions"></a> `defaultMemberPermissions?` | `PermissionResolvable` \| `null` | - | `ContextMenuMeta.defaultMemberPermissions` |
| <a id="property-enabled"></a> `enabled?` | `boolean` | Skip registration when `false`. Default `true`. | `ContextMenuMeta.enabled` |
| <a id="property-guards"></a> `guards?` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | - | `ContextMenuMeta.guards` |
| <a id="property-guildonly"></a> `guildOnly?` | `boolean` | Restrict invocation to guilds (alias for `contexts: ["guild"]`). | `ContextMenuMeta.guildOnly` |
| <a id="property-install"></a> `install?` | readonly [`InstallKind`](../../core/type-aliases/InstallKind)[] | App installation targets; omit for Discord's default (guild install). | `ContextMenuMeta.install` |
| <a id="property-name"></a> `name` | `string` | - | - |
| <a id="property-namelocalizations"></a> `nameLocalizations?` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> | - | `ContextMenuMeta.nameLocalizations` |
| <a id="property-nsfw"></a> `nsfw?` | `boolean` | - | `ContextMenuMeta.nsfw` |
| <a id="property-run"></a> `run` | (`ctx`: [`MessageContextMenuContext`](../classes/MessageContextMenuContext)) => `Awaitable`\<`R`\> | - | - |
