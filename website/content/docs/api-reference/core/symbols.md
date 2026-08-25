---
title: "core"
description: "core in the spearkit API."
---

## Classes

| Class | Description |
| :------ | :------ |
| [SpearClient](classes/SpearClient) | A discord.js Client with batteries included: command, event, component, prefix-command, scheduler and context-menu registries plus interaction routing wired up automatically. |

## Interfaces

| Interface | Description |
| :------ | :------ |
| [CommandScopeMeta](interfaces/CommandScopeMeta) | Scope metadata shared by slash commands and context menus. |
| [LoadOptions](interfaces/LoadOptions) | Options for the directory loader. |
| [ResolvedCommandScope](interfaces/ResolvedCommandScope) | Resolved REST payload fragments for [CommandScopeMeta](interfaces/CommandScopeMeta). |
| [SpearOptions](interfaces/SpearOptions) | spearkit-specific client options layered on top of discord.js ClientOptions. |
| [SpearPlugin](interfaces/SpearPlugin) | A spearkit plugin: a named, reusable bundle of commands, events and components. Its [setup](interfaces/SpearPlugin#setup) runs once when added to a client via `client.use(plugin)`. |

## Type Aliases

| Type Alias | Description |
| :------ | :------ |
| [ContextKind](type-aliases/ContextKind) | Runtime contexts accepted by `contexts`. |
| [InstallKind](type-aliases/InstallKind) | Installation targets accepted by `install`. |
| [Registerable](type-aliases/Registerable) | Anything that can be handed to [SpearClient.register](classes/SpearClient#register). |
| [SpearClientOptions](type-aliases/SpearClientOptions) | Options for [SpearClient](classes/SpearClient): discord.js options plus [SpearOptions](interfaces/SpearOptions). `intents` may be omitted. |

## Variables

| Variable | Description |
| :------ | :------ |
| [Intents](variables/Intents) | Ready-made intent presets. Pass one to [SpearClient](classes/SpearClient) as `intents`. `all` includes privileged intents — enable them in the developer portal. |

## Functions

| Function | Description |
| :------ | :------ |
| [collectModules](functions/collectModules) | Recursively import a directory and collect every spearkit-registrable export (commands, events, components, hybrid commands, context menus) found in default or named exports. |
| [definePlugin](functions/definePlugin) | Identity helper that gives a plugin object its type and editor hints. |
| [loadInto](functions/loadInto) | Load a directory and register everything it exports into the client. Returns the number of items registered. |
| [resolveCommandScope](functions/resolveCommandScope) | Resolve scope metadata into its REST payload form. Throws when `guildOnly` conflicts with an explicit `contexts` list. |
