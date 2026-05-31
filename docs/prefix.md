# Prefix commands

Alongside slash commands, spearkit can dispatch classic text/prefix commands like
`!ping`. You define them with `prefixCommand`, enable them with the client's
`prefix` option, and spearkit parses each `messageCreate` for you — matching the
prefix, splitting arguments, and routing to the right handler.

## Enabling prefix commands

Prefix commands are off until you set the `prefix` option on the client. It
accepts a string, an array of strings, or a `PrefixOptions` object:

```ts
import { Intents, SpearClient } from "spearkit";

// A single prefix.
new SpearClient({ intents: Intents.messages, prefix: "!" });

// Several prefixes.
new SpearClient({ intents: Intents.messages, prefix: ["!", "?"] });

// Full control.
new SpearClient({
  intents: Intents.messages,
  prefix: {
    prefix: "!",
    mention: true,         // also trigger on a leading @bot mention (default true)
    ignoreBots: true,      // skip messages authored by bots (default true)
    caseInsensitive: true, // match command names ignoring case (default true)
  },
});
```

### Dynamic (per-guild) prefixes

Pass `dynamic` to resolve extra prefix(es) per message — for example a custom
per-guild prefix from a database or [`createSettings`](./api-reference.md#persistent-storage).
Dynamic prefixes are tried in addition to any static `prefix`; return
`null`/`undefined` for none. It runs on every candidate message, so keep it fast
(and cached).

```ts
new SpearClient({
  intents: Intents.messages,
  prefix: {
    prefix: "!", // static fallback
    dynamic: async (message) =>
      message.guildId ? await settings.get(message.guildId).then((s) => s.prefix) : null,
  },
});
```

## You need the MessageContent intent

Reading the text of other users' messages is a **privileged** gateway intent.
Without `MessageContent` your bot still receives `messageCreate`, but
`message.content` arrives empty for messages it was not mentioned in or did not
author — so no prefix command will ever match.

Use the `Intents.messages` preset, which includes `Guilds`, `GuildMessages`, and
the privileged `MessageContent` bit:

```ts
import { Intents, SpearClient } from "spearkit";

const client = new SpearClient({ intents: Intents.messages, prefix: "!" });
```

You must also toggle **Message Content Intent** on for your application in the
Discord Developer Portal, or the gateway will reject the connection.

## Defining a command

`prefixCommand` takes the command name, the handler, and a few optional fields:

```ts
import { prefixCommand } from "spearkit";

export const ping = prefixCommand({
  name: "ping",
  description: "Check that the bot is alive",
  run: (ctx) => ctx.reply("Pong!"),
});
```

Register it like anything else, with `client.register(...)`:

```ts
import { SpearClient } from "spearkit";

const client = new SpearClient({ prefix: "!" });
client.register(ping);
```

| Field | Type | Effect |
| ----- | ---- | ------ |
| `name` | `string` | The word after the prefix that triggers the command. |
| `aliases` | `string[]` | Extra names that also trigger it. |
| `description` | `string` | Human description, for your own help command. |
| `cooldown` | `number \| CooldownConfig` | Per-user rate limit (a number is milliseconds). |
| `guards` | `readonly Guard[]` | Preconditions run before the handler. See [Guards](./guards.md). |
| `args` | `(a) => PrefixArgsBuilder` | Typed argument schema; shapes `ctx.options`. See [Typed arguments](#typed-arguments). |
| `run` | `(ctx: PrefixContext) => void \| Promise<void>` | The handler. |

## The prefix context

The handler receives a `PrefixContext`. It wraps the triggering `Message` and
adds the parsed arguments plus reply helpers.

| Member | Description |
| ------ | ----------- |
| `ctx.message` | The triggering discord.js `Message`. |
| `ctx.commandName` | The matched name as the user typed it (an alias if they used one). |
| `ctx.args` | Whitespace-split arguments after the command name (`string[]`). |
| `ctx.rest` | The raw text after the command name (unsplit). |
| `ctx.options` | Typed parsed arguments from the `args` schema (`{}` when none). |
| `ctx.author` / `ctx.member` / `ctx.guild` / `ctx.guildId` / `ctx.channel` / `ctx.channelId` | Actor and location accessors. |
| `ctx.reply(content)` | Reply to the triggering message. |
| `ctx.send(content)` | Send a message to the same channel without a reply reference. |

```ts
import { prefixCommand } from "spearkit";

export const echo = prefixCommand({
  name: "echo",
  description: "Repeat what you said",
  run: (ctx) => {
    if (ctx.args.length === 0) return ctx.reply("Give me something to echo.");
    // `args` is split on whitespace; `rest` is the untouched remainder.
    return ctx.reply(ctx.rest);
  },
});
```

`ctx.args` and `ctx.rest` are two views of the same input: `!say hello   world`
gives `args === ["hello", "world"]` and `rest === "hello   world"`.

## Typed arguments

Pass an `args` schema to parse positional arguments into typed values. Chain
builder methods — first token → first arg, second → second, and so on — and read
the result from `ctx.options`. Each method requires a name and takes optional
settings (`required`, `default`, and per-type bounds).

```ts
import { prefixCommand } from "spearkit";

export const mute = prefixCommand({
  name: "mute",
  description: "Mute a member",
  args: (a) =>
    a
      .snowflake("target", { required: true })       // raw id or <@mention> → string
      .duration("duration", { required: true })      // "1h30m" → number (ms)
      .rest("reason", { default: "No reason given" }), // remaining text → string
  run: (ctx) => {
    ctx.options.target;   // string
    ctx.options.duration; // number
    ctx.options.reason;   // string
    return ctx.reply(`Muted <@${ctx.options.target}> for ${ctx.options.duration}ms.`);
  },
});
```

Builder methods: `.string`, `.integer`, `.number`, `.boolean`, `.snowflake`,
`.duration`, `.rest`. A missing required argument — or a value that fails to
parse — makes spearkit reply with an error and skip the handler. Without an `args`
schema, `ctx.options` is `{}`; use `ctx.args` / `ctx.rest` for raw access.

## Aliases

List alternative names in `aliases`; any of them triggers the command, and
`ctx.commandName` reports whichever the user typed:

```ts
import { prefixCommand } from "spearkit";

export const help = prefixCommand({
  name: "help",
  aliases: ["h", "commands"],
  run: (ctx) => ctx.reply(`You used "${ctx.commandName}".`),
});
```

## Cooldowns

Prefix commands share the client's cooldown manager (`client.cooldowns`) with
slash commands, so the API is identical. Pass `cooldown` as a number of
milliseconds or a full `CooldownConfig`:

```ts
import { prefixCommand } from "spearkit";

export const daily = prefixCommand({
  name: "daily",
  description: "Claim your daily reward",
  cooldown: 5_000, // one use per user per 5s
  run: (ctx) => ctx.reply("Reward claimed! Come back soon."),
});
```

When a user is on cooldown, spearkit replies with the remaining time and does not
run the handler. A per-command `cooldown` overrides the client-wide `cooldown`
default. See [Cooldowns](./cooldown.md) for scopes and configuration.

## The prefix registry

`client.prefix` is a `PrefixRegistry`. The client wires it to `messageCreate`,
the logger, and the cooldown manager for you, so you rarely call it directly. It
is available for introspection and advanced control:

```ts
client.prefix.get("ping");  // PrefixCommand | undefined (also resolves aliases)
client.prefix.list();       // PrefixCommand[] (excludes aliases)
client.prefix.size;         // number of commands
```

### Error handling

If a handler throws, spearkit catches it, logs it, and calls your error hook if you
set one — the process never crashes:

```ts
client.prefix.onError((error, message) => {
  console.error(`prefix command failed in #${message.channelId}`, error);
});
```

## See also

- [Commands](./commands.md) — slash commands.
- [Cooldowns](./cooldown.md) — the shared rate limiter.
- [Usage tracking](./usage.md) — record who runs which prefix commands.
- [Client](./client.md) — the `prefix` option and intent presets.
