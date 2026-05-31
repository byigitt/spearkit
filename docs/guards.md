# Guards

Guards are declarative **preconditions** that run before a handler. They work
uniformly across slash commands, components (buttons, selects, modals), prefix
commands and context-menu commands — and can also be applied client-wide. A
guard returns `true` to allow the handler, or a denial (with an optional reason)
to block it; spearkit replies with the reason and the handler never runs.

```ts
import { command, requireUserPermissions, PermissionFlagsBits } from "spearkit";

export const purge = command({
  name: "purge",
  description: "Bulk-delete messages",
  guards: [requireUserPermissions(PermissionFlagsBits.ManageMessages)],
  run: (ctx) => ctx.reply("Purged."),
});
```

## Where guards attach

Pass `guards: [...]` to any handler definition, or set client-wide defaults that
run before every handler's own guards.

```ts
import {
  SpearClient,
  command,
  button,
  prefixCommand,
  userCommand,
  guildOnly,
} from "spearkit";

// Per-handler — on commands, components, prefix and context-menu commands.
command({ name: "kick", description: "…", guards: [guildOnly()], run: () => {} });
button({ id: "del:{id}", guards: [guildOnly()], run: () => {} });
prefixCommand({ name: "ban", guards: [guildOnly()], run: () => {} });
userCommand({ name: "Report", guards: [guildOnly()], run: () => {} });

// Client-wide — applied before each handler's own guards.
const client = new SpearClient({ guards: [guildOnly()] });
```

Client-wide guards run first; if they pass, the handler's own guards run next.
The first denial short-circuits the rest.

## Built-in guards

Each built-in returns a `Guard` and accepts an optional custom `reason`. When
omitted, a sensible default message is used (shown below).

| Guard | Denies unless… | Default reason |
| ----- | -------------- | -------------- |
| `guildOnly(reason?)` | used inside a guild | `"This can only be used in a server."` |
| `dmOnly(reason?)` | used in a DM | `"This can only be used in DMs."` |
| `requireAnyRole(roleIds, reason?)` | the member holds **any** of `roleIds` | `"You don't have permission to use this."` |
| `requireAllRoles(roleIds, reason?)` | the member holds **every** id in `roleIds` | `"You're missing one of the required roles."` |
| `requireOwner(ownerIds, reason?)` | the user id is in `ownerIds` | `"This is owner-only."` |
| `requireUserPermissions(permission, reason?)` | the member has the Discord `permission` | `"You don't have permission to use this."` |
| `requireBotPermissions(permission, reason?)` | the bot's member has the Discord `permission` | `"I don't have permission to do that here."` |

```ts
import {
  command,
  requireAnyRole,
  requireBotPermissions,
  PermissionFlagsBits,
} from "spearkit";

export const announce = command({
  name: "announce",
  description: "Post an announcement",
  guards: [
    requireAnyRole(["111111111111111111"], "Staff only."),
    requireBotPermissions(PermissionFlagsBits.SendMessages),
  ],
  run: (ctx) => ctx.reply("Announced."),
});
```

## Custom guards

`guard(predicate)` wraps an inline predicate so a one-off check still types as a
`Guard`. The predicate receives a `GuardContext` and returns a `GuardResult`;
use `denied(reason?)` to build a denial.

```ts
import { command, guard, denied } from "spearkit";

const cooldownOver = guard((ctx) =>
  isReady(ctx.user.id) ? true : denied("Still warming up — try again soon."),
);

export const cast = command({
  name: "cast",
  description: "Cast a spell",
  guards: [cooldownOver],
  run: (ctx) => ctx.reply("✨"),
});
```

`GuardContext` exposes the actor/location fields every handler shares, so the
same guard works on commands, components, prefix and context-menu handlers:

```ts
interface GuardContext {
  client: Client;
  user: User;
  member: GuildMember | APIInteractionGuildMember | null;
  guild: Guild | null;
  guildId: string | null;
  channelId: string | null;
}

type GuardResult = boolean | { allowed: false; reason?: string };
type Guard<TCtx extends GuardContext = GuardContext> = (ctx: TCtx) => Awaitable<GuardResult>;
```

## Running guards manually

`runGuards(ctx, guards)` evaluates a list in order and short-circuits on the
first denial — useful if you build your own dispatch on top of spearkit.

```ts
import { runGuards, guildOnly } from "spearkit";

const result = await runGuards(ctx, [guildOnly()]);
if (!result.allowed) {
  // result.reason is the denial message (or undefined)
}
```

`runGuards` resolves to `RunGuardsResult`:

```ts
type RunGuardsResult = { allowed: true } | { allowed: false; reason: string | undefined };
```

## See also

- [Commands](./commands.md) — `guards` on slash commands.
- [Components](./components.md) — `guards` on buttons, selects and modals.
- [Prefix commands](./prefix.md) — `guards` on text commands.
- [Context menus](./context-menus.md) — `guards` on "Apps" actions.
- [Cooldowns](./cooldown.md) — the other built-in precondition.
