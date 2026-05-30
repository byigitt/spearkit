# Slash commands

Defining commands with `command()` and `commandGroup()`.

- [`basic.ts`](./basic.ts) — simple commands and the context accessors.
- [`with-options.ts`](./with-options.ts) — typed options (required vs optional).
- [`subcommands.ts`](./subcommands.ts) — `subcommand` and `subcommandGroup` routing.
- [`permissions.ts`](./permissions.ts) — `guildOnly`, `defaultMemberPermissions`, `nsfw`, localization.

These files export command definitions. Register them with
`client.register(...)` and deploy (see [deploy](../deploy)).

See also: [options](../options), [autocomplete](../autocomplete).
