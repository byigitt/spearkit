---
title: "prefix-commands"
description: "prefix-commands in the spearkit API."
---

## Classes

| Class | Description |
| :------ | :------ |
| [PrefixArgsBuilder](classes/PrefixArgsBuilder) | Build a typed argument schema for [prefixCommand](functions/prefixCommand). Chain calls positionally — first token → first arg, second → second arg, etc. |
| [PrefixContext](classes/PrefixContext) | The handler argument for a prefix command: the message plus parsed args. |
| [PrefixRegistry](classes/PrefixRegistry) | Holds prefix commands and dispatches matching messages to them. |

## Interfaces

| Interface | Description |
| :------ | :------ |
| [PrefixArgError](interfaces/PrefixArgError) | A failed parse, returned by [PrefixArgsParser.parse](interfaces/PrefixArgsParser#parse). |
| [PrefixArgsOk](interfaces/PrefixArgsOk) | A successful parse, returned by [PrefixArgsParser.parse](interfaces/PrefixArgsParser#parse). |
| [PrefixArgsParser](interfaces/PrefixArgsParser) | The compiled parser produced by [PrefixArgsBuilder.compile](classes/PrefixArgsBuilder#compile). |
| [PrefixArgSpec](interfaces/PrefixArgSpec) | A single argument's runtime spec; recorded by [PrefixArgsBuilder](classes/PrefixArgsBuilder). |
| [PrefixCommand](interfaces/PrefixCommand) | A registrable prefix command. Build it with [prefixCommand](functions/prefixCommand). |
| [PrefixCommandConfig](interfaces/PrefixCommandConfig) | Configuration for a prefix command. |
| [PrefixOptions](interfaces/PrefixOptions) | Options controlling how prefix messages are recognised. |

## Type Aliases

| Type Alias | Description |
| :------ | :------ |
| [PrefixErrorHandler](type-aliases/PrefixErrorHandler) | Error hook invoked when a prefix command handler throws. |

## Functions

| Function | Description |
| :------ | :------ |
| [prefixArgs](functions/prefixArgs) | Start a fresh args builder. Pass to `prefixCommand({ args })`. |
| [prefixCommand](functions/prefixCommand) | Define a prefix command. |
