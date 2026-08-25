---
title: "HybridCommandConfig\\<O, TArgs, R\\>"
description: "Configuration for hybridCommand."
---

Defined in: [src/hybrid.ts:171](https://github.com/byigitt/spearkit/blob/main/src/hybrid.ts#L171)

Configuration for [hybridCommand](../functions/hybridCommand).

## Extends

- [`CommandScopeMeta`](../../core/interfaces/CommandScopeMeta)

## Type Parameters

| Type Parameter |
| :------ |
| `O` *extends* [`OptionMap`](../type-aliases/OptionMap) |
| `TArgs` *extends* `Record`\<`string`, `unknown`\> |
| `R` |

## Properties

| Property | Type | Description | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-aliases"></a> `aliases?` | readonly `string`[] | Alternative prefix names. | - |
| <a id="property-args"></a> `args?` | (`builder`) => [`PrefixArgsBuilder`](../../prefix-commands/classes/PrefixArgsBuilder)\<`TArgs`\> | Prefix-side typed argument schema. | - |
| <a id="property-autodefer"></a> `autoDefer?` | [`AutoDeferInput`](../type-aliases/AutoDeferInput) | - | - |
| <a id="property-contexts"></a> `contexts?` | readonly [`ContextKind`](../../core/type-aliases/ContextKind)[] | Where the command may run; omit to inherit the installation default. | [`CommandScopeMeta`](../../core/interfaces/CommandScopeMeta).[`contexts`](../../core/interfaces/CommandScopeMeta#property-contexts) |
| <a id="property-cooldown"></a> `cooldown?` | [`CooldownInput`](../../cooldowns-and-scaling/type-aliases/CooldownInput) | - | - |
| <a id="property-defaultmemberpermissions"></a> `defaultMemberPermissions?` | `PermissionResolvable` \| `null` | - | - |
| <a id="property-description"></a> `description` | `string` | - | - |
| <a id="property-descriptionlocalizations"></a> `descriptionLocalizations?` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> | - | - |
| <a id="property-enabled"></a> `enabled?` | `boolean` | - | - |
| <a id="property-guards"></a> `guards?` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | - | - |
| <a id="property-guildonly"></a> `guildOnly?` | `boolean` | Restrict invocation to guilds (alias for `contexts: ["guild"]`). | [`CommandScopeMeta`](../../core/interfaces/CommandScopeMeta).[`guildOnly`](../../core/interfaces/CommandScopeMeta#property-guildonly) |
| <a id="property-install"></a> `install?` | readonly [`InstallKind`](../../core/type-aliases/InstallKind)[] | App installation targets; omit for Discord's default (guild install). | [`CommandScopeMeta`](../../core/interfaces/CommandScopeMeta).[`install`](../../core/interfaces/CommandScopeMeta#property-install) |
| <a id="property-name"></a> `name` | `string` | - | - |
| <a id="property-namelocalizations"></a> `nameLocalizations?` | `Partial`\<`Record`\<`Locale`, `string` \| `null`\>\> | - | - |
| <a id="property-nsfw"></a> `nsfw?` | `boolean` | - | - |
| <a id="property-options"></a> `options?` | `O` | Slash-side typed options. | - |
| <a id="property-run"></a> `run` | (`ctx`) => `Awaitable`\<`R`\> | - | - |
