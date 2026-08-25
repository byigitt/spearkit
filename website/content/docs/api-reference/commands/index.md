---
title: "Commands"
description: "Slash commands, options, contexts, registries, hybrid commands, and context menus."
---

## Classes

| Class | Description |
| :------ | :------ |
| [AutocompleteContext](classes/AutocompleteContext) | The handler argument for autocomplete requests. Provides the focused value and a typed [respond](classes/AutocompleteContext#respond) helper. |
| [CommandContext](classes/CommandContext) | The handler argument for a slash command. Wraps the discord.js interaction and exposes the resolved, fully-typed [options](classes/CommandContext#property-options). |
| [CommandRegistry](classes/CommandRegistry) | Holds every slash command and routes interactions to them. |
| [ContextMenuRegistry](classes/ContextMenuRegistry) | Holds context-menu commands and routes incoming interactions to them. |
| [MessageContextMenuContext](classes/MessageContextMenuContext) | Handler context for a message-target context menu. |
| [SlashCommand](classes/SlashCommand) | A registered slash command. Serialises itself for the discord REST API and executes its matching interactions. Construct via [command](functions/command) or [commandGroup](functions/commandGroup) rather than directly. |
| [UserContextMenuContext](classes/UserContextMenuContext) | Handler context for a user-target context menu. |

## Interfaces

| Interface | Description |
| :------ | :------ |
| [AutoDeferConfig](interfaces/AutoDeferConfig) | Resolved auto-defer settings. |
| [BaseContextMenuCommand](interfaces/BaseContextMenuCommand) | Common shape for any context-menu command (user or message). |
| [CommandConfig](interfaces/CommandConfig) | Configuration for a leaf (non-subcommand) slash command. |
| [CommandGroupConfig](interfaces/CommandGroupConfig) | Configuration for a command that contains subcommands and/or groups. |
| [DeployOptions](interfaces/DeployOptions) | Options for pushing commands to discord. |
| [HybridCommand](interfaces/HybridCommand) | A hybrid command: hand both parts to `client.register(...)` at once. |
| [HybridCommandConfig](interfaces/HybridCommandConfig) | Configuration for [hybridCommand](functions/hybridCommand). |
| [HybridContext](interfaces/HybridContext) | The shared handler context for a hybrid command invocation. |
| [MessageCommandConfig](interfaces/MessageCommandConfig) | Configuration for [messageCommand](functions/messageCommand). |
| [MessageContextMenu](interfaces/MessageContextMenu) | A message-target context-menu command. |
| [OptionChoice](interfaces/OptionChoice) | A single choice for string/integer/number options. |
| [OptionDef](interfaces/OptionDef) | A fully-described slash command option. The two type parameters are phantom markers used purely for compile-time inference of the resolved value: - `TValue` is the type produced for the command handler. - `TRequired` controls nullability (`true` => value, `false` => `| undefined`). |
| [Subcommand](interfaces/Subcommand) | A type-erased, ready-to-run subcommand created with [subcommand](functions/subcommand). |
| [SubcommandConfig](interfaces/SubcommandConfig) | Configuration for one subcommand. |
| [SubcommandGroup](interfaces/SubcommandGroup) | A subcommand group created with [subcommandGroup](functions/subcommandGroup). |
| [SubcommandGroupConfig](interfaces/SubcommandGroupConfig) | Configuration for a subcommand group (a folder of subcommands). |
| [UserCommandConfig](interfaces/UserCommandConfig) | Configuration for [userCommand](functions/userCommand). |
| [UserContextMenu](interfaces/UserContextMenu) | A user-target context-menu command. |

## Type Aliases

| Type Alias | Description |
| :------ | :------ |
| [AllowedChannelType](type-aliases/AllowedChannelType) | The discord-allowed channel types for a channel option. |
| [AnyOptionDef](type-aliases/AnyOptionDef) | Any option definition, regardless of value/required type. |
| [AutocompleteHandler](type-aliases/AutocompleteHandler) | Provides autocomplete suggestions for an option as the user types. |
| [AutoDeferInput](type-aliases/AutoDeferInput) | How a handler opts into auto-defer: `true` for defaults, or fine-tuning. |
| [AutoDeferrableInteraction](type-aliases/AutoDeferrableInteraction) | Interactions auto-defer supports (those answered with `deferReply`). |
| [CommandErrorHandler](type-aliases/CommandErrorHandler) | Error hook invoked when a command handler throws. |
| [ContextMenuCommand](type-aliases/ContextMenuCommand) | A registered context-menu command — discriminated by `kind`. |
| [ContextMenuErrorHandler](type-aliases/ContextMenuErrorHandler) | Error hook invoked when a context-menu handler throws. |
| [DeployResult](type-aliases/DeployResult) | Result of a [CommandRegistry.deploy](classes/CommandRegistry#deploy) call. |
| [HybridReplyInput](type-aliases/HybridReplyInput) | Reply input accepted by [HybridContext.reply](interfaces/HybridContext#reply). |
| [OptionMap](type-aliases/OptionMap) | A map of option name => definition. |
| [OptionValue](type-aliases/OptionValue) | The closed set of values a slash option can resolve to. |
| [ResolvedOption](type-aliases/ResolvedOption) | Maps an [OptionDef](interfaces/OptionDef) to the value passed into the command handler. |
| [ResolvedOptions](type-aliases/ResolvedOptions) | Resolves a whole [OptionMap](type-aliases/OptionMap) into the handler's `options` object. |

## Variables

| Variable | Description |
| :------ | :------ |
| [DEFAULT\_AUTO\_DEFER\_DELAY\_MS](variables/DEFAULT_AUTO_DEFER_DELAY_MS) | Default safety margin: defer at 2s, leaving headroom before the 3s cutoff. |
| [option](variables/option) | Type-safe slash command option builders. |

## Functions

| Function | Description |
| :------ | :------ |
| [armAutoDefer](functions/armAutoDefer) | Arm a one-shot timer that calls `deferReply()` if the interaction is still un-acknowledged when it fires. Returns a cancel function — always call it once your handler settles (e.g. in a `finally`) to disarm the timer. |
| [command](functions/command) | Define a slash command with type-safe options and a co-located handler. |
| [commandGroup](functions/commandGroup) | Define a command that routes to subcommands and/or subcommand groups. |
| [hybridCommand](functions/hybridCommand) | Define one command that works both as a slash command and as a prefix command. `options` drive the slash payload, `args` drive the prefix parser; `run` is shared and receives a [HybridContext](interfaces/HybridContext). |
| [messageCommand](functions/messageCommand) | Define a message-target ("Apps → message") context-menu command. |
| [normalizeAutoDefer](functions/normalizeAutoDefer) | Normalise an [AutoDeferInput](type-aliases/AutoDeferInput) (or `undefined`) into a config, or `undefined` when disabled. |
| [optionsHaveAutocomplete](functions/optionsHaveAutocomplete) | True if any option in the map declares an autocomplete handler. |
| [readOption](functions/readOption) | Reads a resolved option value off a discord.js option resolver. |
| [subcommand](functions/subcommand) | Define a single subcommand with type-safe options and a handler. |
| [subcommandGroup](functions/subcommandGroup) | Group several subcommands under a shared name. |
| [toAPIOption](functions/toAPIOption) | Converts a spearkit option definition into the discord REST option payload. |
| [userCommand](functions/userCommand) | Define a user-target ("Apps → user") context-menu command. |
