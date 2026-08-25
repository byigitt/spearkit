---
title: "CommandGroupConfig"
description: "Configuration for a command that contains subcommands and/or groups."
---

Defined in: [src/commands/command.ts:100](https://github.com/byigitt/spearkit/blob/main/src/commands/command.ts#L100)

Configuration for a command that contains subcommands and/or groups.

## Extends

- `CommonMeta`

## Properties

| Property | Type | Description | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-autodefer"></a> `autoDefer?` | [`AutoDeferInput`](../type-aliases/AutoDeferInput) | Auto-`deferReply()` if the handler hasn't responded within ~2s, preventing `Unknown interaction` (10062) on slow work. `true` for defaults, or `{ ephemeral, delayMs }`. With it on, respond via `ctx.send`/`ctx.editReply`. | `CommonMeta.autoDefer` |
| <a id="property-contexts"></a> `contexts?` | readonly [`ContextKind`](../../core/type-aliases/ContextKind)[] | Where the command may run; omit to inherit the installation default. | `CommonMeta.contexts` |
| <a id="property-cooldown"></a> `cooldown?` | [`CooldownInput`](../../cooldowns-and-scaling/type-aliases/CooldownInput) | Rate-limit this command. A number is a duration in ms; see [CooldownConfig](../../cooldowns-and-scaling/interfaces/CooldownConfig). | `CommonMeta.cooldown` |
| <a id="property-defaultmemberpermissions"></a> `defaultMemberPermissions?` | `PermissionResolvable` \| `null` | Permissions a member must have by default to see/use the command. | `CommonMeta.defaultMemberPermissions` |
| <a id="property-description"></a> `description` | `string` | - | - |
| <a id="property-descriptionlocalizations"></a> `descriptionLocalizations?` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> | - | `CommonMeta.descriptionLocalizations` |
| <a id="property-enabled"></a> `enabled?` | `boolean` | Skip `client.register` / deploy when `false`. Use to park a command in source without shipping it. Default `true`. | `CommonMeta.enabled` |
| <a id="property-groups"></a> `groups?` | `Record`\<`string`, [`SubcommandGroup`](SubcommandGroup)\> | - | - |
| <a id="property-guards"></a> `guards?` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | Preconditions evaluated before the handler runs. | `CommonMeta.guards` |
| <a id="property-guildonly"></a> `guildOnly?` | `boolean` | Restrict invocation to guilds (alias for `contexts: ["guild"]`). | `CommonMeta.guildOnly` |
| <a id="property-install"></a> `install?` | readonly [`InstallKind`](../../core/type-aliases/InstallKind)[] | App installation targets; omit for Discord's default (guild install). | `CommonMeta.install` |
| <a id="property-name"></a> `name` | `string` | - | - |
| <a id="property-namelocalizations"></a> `nameLocalizations?` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> | - | `CommonMeta.nameLocalizations` |
| <a id="property-nsfw"></a> `nsfw?` | `boolean` | Mark the command NSFW (age-restricted). | `CommonMeta.nsfw` |
| <a id="property-subcommands"></a> `subcommands?` | `Record`\<`string`, [`Subcommand`](Subcommand)\> | - | - |
