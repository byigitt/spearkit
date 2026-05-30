# Contexts

Every spear handler — command, button, select, modal — receives a context
object. They all share `BaseContext`, which smooths over discord.js'
reply/defer/edit/follow-up state machine and exposes the common
actor/location accessors. Learn it once and it applies everywhere.

```ts
import { command, option } from "spear";

export default command({
  name: "hello",
  description: "Say hello",
  options: { name: option.string({ description: "Name", required: true }) },
  run: (ctx) => ctx.reply(`Hi, ${ctx.options.name}!`),
});
```

`CommandContext`, `ButtonContext`, `StringSelectContext`, modal contexts and the
rest extend `BaseContext`, adding their own specifics (e.g. `ctx.options`,
`ctx.params`, `ctx.fields`) on top of everything below.

## Reply helpers

| Method | Returns | Behaviour |
| ------ | ------- | --------- |
| `reply(input)` | `Promise<InteractionResponse>` | Send the initial response. |
| `replyEphemeral(input)` | `Promise<InteractionResponse>` | Reply, hidden to everyone but the invoking user. |
| `defer({ ephemeral })` | `Promise<InteractionResponse>` | Acknowledge now, respond later via `editReply`. |
| `editReply(input)` | `Promise<Message>` | Edit the original (or deferred) response. |
| `followUp(input)` | `Promise<Message>` | Add a message after the initial response. |
| `send(input)` | `Promise<void>` | State-aware: replies, edits, or follows up automatically. |
| `error(message)` | `Promise<void>` | State-aware ephemeral message. |

```ts
import { command } from "spear";

export default command({
  name: "demo",
  description: "Reply helpers",
  run: async (ctx) => {
    await ctx.reply("Working on it…");
    await ctx.followUp("…almost done.");
  },
});
```

### `send` is the one most handlers need

`send` inspects the interaction state and does the right thing:

- not yet answered → `reply`
- already deferred → `editReply`
- already replied → `followUp`

This means you can call `send` without tracking whether you deferred, which is
ideal for shared helpers that may run before or after a `defer`.

```ts
import { command } from "spear";

export default command({
  name: "report",
  description: "Generate a report",
  run: async (ctx) => {
    await ctx.defer(); // acknowledge while we do slow work
    const data = await buildReport();
    await ctx.send(data); // sees the deferred state → edits the reply
  },
});
```

### `error` for ephemeral failures

`error(message)` sends a state-aware, always-ephemeral message — perfect for
validation failures that only the invoking user should see.

```ts
import { command, option } from "spear";

export default command({
  name: "kick",
  description: "Kick a member",
  options: { who: option.user({ description: "Member", required: true }) },
  run: async (ctx) => {
    if (!ctx.guild) return ctx.error("This command only works in a server.");
    await ctx.reply(`Kicked ${ctx.options.who}.`);
  },
});
```

## The `{ ephemeral: true }` shortcut

discord.js represents an ephemeral reply with `flags: MessageFlags.Ephemeral`.
spear lets you write the more obvious `{ ephemeral: true }` on any reply payload
and maps it to that flag for you. The input type is `ReplyInput`
(`string | ReplyData`), where `ReplyData` is discord.js'
`InteractionReplyOptions` plus the optional `ephemeral` boolean.

```ts
import { command, EmbedBuilder } from "spear";

export default command({
  name: "secret",
  description: "Only you can see this",
  run: (ctx) =>
    ctx.reply({
      embeds: [new EmbedBuilder().setTitle("Just for you")],
      ephemeral: true, // mapped to MessageFlags.Ephemeral
    }),
});
```

`replyEphemeral(input)` is sugar for the same thing, accepting either a string
or a payload:

```ts
await ctx.replyEphemeral("Saved.");
await ctx.replyEphemeral({ embeds: [embed] });
```

If you set `flags` yourself, spear preserves them and adds the ephemeral flag
rather than overwriting it.

### Exported helpers

spear exports the two functions it uses internally, so you can normalise reply
input yourself (e.g. in a plugin or shared utility):

- `normalizeReply(input: ReplyInput): InteractionReplyOptions` — converts a
  string or `ReplyData` into a discord.js reply payload, applying the ephemeral
  flag mapping.
- `asEphemeral(input: ReplyInput): ReplyData` — marks any input ephemeral,
  regardless of how it was passed.

```ts
import { normalizeReply, asEphemeral } from "spear";

normalizeReply("hi");
// → { content: "hi" }

normalizeReply({ content: "hi", ephemeral: true });
// → { content: "hi", flags: MessageFlags.Ephemeral }

asEphemeral("hidden");
// → { content: "hidden", ephemeral: true }
```

## Accessors

`BaseContext` forwards the common interaction fields so you do not reach through
`ctx.interaction` for everyday data:

| Accessor | Description |
| -------- | ----------- |
| `interaction` | The raw discord.js interaction. |
| `client` | The `SpearClient` (typed as the interaction's client). |
| `user` | The invoking `User`. |
| `member` | The invoking guild member (or `null` outside a guild). |
| `guild` | The `Guild`, or `null` in DMs. |
| `guildId` | The guild id, or `null`. |
| `channel` | The channel the interaction came from. |
| `channelId` | The channel id. |
| `locale` | The user's locale. |
| `deferred` | Whether the interaction is already deferred. |
| `replied` | Whether the interaction already received an initial response. |

```ts
import { command } from "spear";

export default command({
  name: "whereami",
  description: "Report context",
  run: (ctx) =>
    ctx.reply(
      ctx.guild
        ? `In ${ctx.guild.name} (#${ctx.channelId}), locale ${ctx.locale}.`
        : "We're in a DM.",
    ),
});
```

`deferred` and `replied` let you branch when you are not using `send`:

```ts
import { button } from "spear";

export default button({
  id: "refresh",
  label: "Refresh",
  run: async (ctx) => {
    if (ctx.replied || ctx.deferred) await ctx.followUp("Refreshed.");
    else await ctx.reply("Refreshed.");
  },
});
```

## See also

- [Commands](./commands.md) — `CommandContext`, options and `showModal`.
- [Components](./components.md) — button, select and modal contexts.
