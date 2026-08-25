---
title: "CommandScopeMeta"
description: "Scope metadata shared by slash commands and context menus."
---

Defined in: [src/scope.ts:32](https://github.com/byigitt/spearkit/blob/main/src/scope.ts#L32)

## Extended by

- [`HybridCommandConfig`](../../commands/interfaces/HybridCommandConfig)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-contexts"></a> `contexts?` | readonly [`ContextKind`](../type-aliases/ContextKind)[] | Where the command may run; omit to inherit the installation default. |
| <a id="property-guildonly"></a> `guildOnly?` | `boolean` | Restrict invocation to guilds (alias for `contexts: ["guild"]`). |
| <a id="property-install"></a> `install?` | readonly [`InstallKind`](../type-aliases/InstallKind)[] | App installation targets; omit for Discord's default (guild install). |
