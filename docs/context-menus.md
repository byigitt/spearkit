# Context-menu commands

Context-menu commands are the right-click **"Apps"** actions Discord shows on a
user or a message. spearkit makes them first-class: define one with `userCommand`
or `messageCommand`, register it like anything else, and deploy it alongside your
slash commands. The handler gets a typed `targetUser` or `targetMessage`.

```ts
import { userCommand } from "spearkit";

export const whois = userCommand({
  name: "Who is this?",
  run: (ctx) => ctx.replyEphemeral(`That's ${ctx.targetUser.tag}.`),
});
```

`name` is the label shown in the Apps menu (no description — Discord does not show
one for context-menu commands).

## User vs message commands

| Builder | Appears on | Target context |
| ------- | ---------- | -------------- |
| `userCommand` | a user (right-click → Apps) | `ctx.targetUser`, `ctx.targetMember` |
| `messageCommand` | a message (right-click → Apps) | `ctx.targetMessage` |

```ts
import { messageCommand } from "spearkit";

export const report = messageCommand({
  name: "Report message",
  run: (ctx) =>
    ctx.replyEphemeral(`Reported message ${ctx.targetMessage.id}.`),
});
```

Both handler contexts extend the shared [`BaseContext`](./context.md), so
`ctx.reply`, `ctx.replyEphemeral`, `ctx.defer`, `ctx.success/error/...` and the
usual accessors are all available.

## Metadata, cooldowns and guards

Both builders accept the same metadata, plus a `cooldown` and `guards`:

| Field | Type | Effect |
| ----- | ---- | ------ |
| `name` | `string` | The Apps-menu label. |
| `defaultMemberPermissions` | `PermissionResolvable \| null` | Default permission gate. |
| `nsfw` | `boolean` | Marks the command age-restricted. |
| `guildOnly` | `boolean` | Restricts it to guild contexts. |
| `nameLocalizations` | `LocalizationMap` | Per-locale label. |
| `cooldown` | `number \| CooldownConfig` | Rate limit (shares `client.cooldowns`). |
| `guards` | `readonly Guard[]` | Preconditions run before the handler. |
| `autoDefer` | `boolean \| { ephemeral?, delayMs? }` | Auto-`deferReply()` if the handler is slow, preventing `Unknown interaction`. |

```ts
import { userCommand, guildOnly, requireUserPermissions, PermissionFlagsBits } from "spearkit";

export const warn = userCommand({
  name: "Warn user",
  guildOnly: true,
  cooldown: 5_000,
  guards: [requireUserPermissions(PermissionFlagsBits.ModerateMembers)],
  run: (ctx) => ctx.replyEphemeral(`Warned ${ctx.targetUser.tag}.`),
});
```

See [Cooldowns](./cooldown.md) and [Guards](./guards.md) for the shared options.

## Registering and deploying

Register context-menu commands like everything else with `client.register(...)`.
They route automatically — spearkit dispatches user- and message-context-menu
interactions to the matching command.

```ts
client.register(whois, report, warn);
```

Because context menus and slash commands deploy to the same Discord endpoint,
push them together with `deployAllCommands` once you mix the two — it sends both
in a single request. (`deployCommands` is slash-only.)

```ts
await client.start(process.env.DISCORD_TOKEN);
await client.deployAllCommands({ guildId: process.env.GUILD_ID }); // slash + menus
```

`deployAllCommands` also supports a `dryRun` flag and a `strategy: "diff"` that
skips the PUT when the remote set already matches — handy in CI:

```ts
// Preview without touching Discord:
const result = await client.deployAllCommands({ guildId, dryRun: true });
// → { skipped: true, reason: "dry-run", body: [...] }

// Only deploy when something changed:
await client.deployAllCommands({ guildId, strategy: "diff" });
```

## The registry

`client.contextMenus` is a `ContextMenuRegistry`. The client wires it to the
logger and cooldown manager and routes interactions for you, so you rarely touch
it directly:

```ts
client.contextMenus.size;   // number registered
client.contextMenus.all();  // ContextMenuCommand[]
client.contextMenus.toJSON(); // REST payloads (also included by deployAllCommands)
```

Note: context-menu commands are **not** picked up by `client.load(...)`
directory loading — register them explicitly with `client.register(...)`.

## See also

- [Commands](./commands.md) — slash commands.
- [Client](./client.md) — `deployAllCommands` and registration.
- [Guards](./guards.md) / [Cooldowns](./cooldown.md) — the shared preconditions.
- [Contexts](./context.md) — the reply helpers every handler shares.
