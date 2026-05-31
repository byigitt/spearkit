# spearkit

**discord.js++** — a developer-experience-first layer over [discord.js](https://discord.js.org).

spearkit re-exports the entire discord.js surface (so it's a drop-in replacement) and
adds an ergonomic, **fully type-safe** API for the things that are tedious in raw
discord.js: setting up events, defining slash commands, and wiring interactive
components. No `any`, no `unknown` leaking into your handlers — option values,
custom-id params and modal fields are all inferred.

```bash
npm install spearkit discord.js
```

## Batteries included

- **Type-safe slash commands**, options, subcommands, autocomplete, buttons, selects and modals — no `interactionCreate` switch.
- **Cooldowns** — per user/guild/channel/global, with per-role/per-user exemptions and overrides ([guide](./docs/cooldown.md)).
- **Scheduled tasks** — cron and interval jobs, started on ready ([guide](./docs/scheduler.md)).
- **Prefix commands** — classic `!text` commands that share cooldowns ([guide](./docs/prefix.md)).
- **Structured logging** — leveled, scoped, pluggable; every error flows through it ([guide](./docs/logging.md)).
- **Usage tracking** — record who used what to a database and/or a Discord channel ([guide](./docs/usage.md)).
- **dotenv built in** — auto-load `.env` and read typed env vars ([guide](./docs/env.md)).
- **Plugins & file-based loading** for organising larger bots.
- **Guards** — declarative `requireAnyRole`/`requireUserPermissions`/`guildOnly`/`requireOwner` preconditions on commands, components and prefix commands ([guide](./docs/guards.md)).
- **Context-menu commands** — `userCommand` / `messageCommand` with typed `targetUser` / `targetMessage` ([guide](./docs/context-menus.md)).
- **Preset embeds** — `ctx.success/info/warn/error` and `client.embeds` factory with configurable colors/icons ([API ref](./docs/api-reference.md#embeds--preset-replies)).
- **Pagination & confirmation** — `paginate(...)` and `confirm(...)` button flows with user-only filter and timeout.
- **Typed prefix args** — `prefixCommand({ args: a => a.snowflake("target").duration("d").rest("reason"), run: ctx => ctx.options })`.
- **Primitives** — `KeyedLock`, `safeFetch.{member,channel,...}`, `formatDuration`/`parseDuration`/`discordTimestamp`, `MemoryCache` (TTL + counters + rate limit), `loadConfig` (JSON/JSON5/YAML).
- **Logger transports** — multi-sink (`consoleSink`, `jsonlSink`, `webhookSink`); per-level routing.
- **Scheduler extras** — `scheduler.delay/followUp/reconcile` for one-shot jobs and on-ready recovery.
- **Deploy strategy** — `deployAllCommands({ dryRun, strategy: "diff" })` for safe CI deploys.
- **Auto-defer** — `command({ autoDefer: true })` / `new SpearClient({ autoDefer: true })` to dodge `Unknown interaction` (10062) on slow handlers ([API ref](./docs/api-reference.md#auto-defer)).
- **Graceful shutdown** — `client.enableGracefulShutdown({ onShutdown })` for clean `SIGINT`/`SIGTERM` teardown ([API ref](./docs/api-reference.md#graceful-shutdown)).
- **Permissions & moderation** — `moderationCheck`, `missingPermissions`, `canActOn`, `ctx.botMissing(...)` role-hierarchy/permission preflights ([API ref](./docs/api-reference.md#permissions--moderation)).
- **Persistent storage** — `MemoryStore`/`JsonStore` key-value stores + typed per-guild `createSettings(...)` ([API ref](./docs/api-reference.md#persistent-storage)).
- **Collectors** — `ctx.awaitMessageFrom(...)`, `ctx.awaitModal(...)`, `awaitComponent(...)` without hand-rolled collectors ([API ref](./docs/api-reference.md#collectors)).
- **Discord error helpers** — `isDiscordError(err, DiscordErrorCode.UnknownMessage)`, `explainDiscordError(...)` ([API ref](./docs/api-reference.md#discord-errors)).
- **Dynamic prefixes** — per-guild prefix resolution via `prefix: { dynamic }` ([guide](./docs/prefix.md#dynamic-per-guild-prefixes)).

## Documentation

- **Docs site** ([`website/`](./website)) — a [Fumadocs](https://fumadocs.dev) site themed like the discord.js docs. Run it with `cd website && pnpm install && pnpm dev`.
- **Guides & API reference** ([`docs/`](./docs)) — the Markdown the site is built from.
- **Examples** ([`examples/`](./examples)) — one folder per topic (commands, options, components, events, loading, …).

## For AI agents

spearkit ships machine-readable guidance so coding agents write correct code with it:

- **[`AGENTS.md`](./AGENTS.md)** — the golden rules and canonical patterns, auto-read by most coding agents.
- **[`llms.txt`](./llms.txt)** — an [llmstxt.org](https://llmstxt.org) index of the docs; **[`llms-full.txt`](./llms-full.txt)** is every guide and the full API reference in one file.
- **Agent skill** ([`.claude/skills/spearkit/`](./.claude/skills/spearkit)) — a drop-in [Agent Skill](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills) with recipes and a symbol cheatsheet.

`AGENTS.md`, `llms.txt`, `llms-full.txt`, `docs/` and the agent skill ship in the
npm package as plain files (no install hook), so an installed copy lives under
`node_modules/spearkit/` — e.g. `node_modules/spearkit/.claude/skills/spearkit/SKILL.md`.
The `llms` files are generated from `docs/`; run `npm run docs:llms` after editing docs.

## Quick start

```ts
import { SpearClient, Intents, command, option, event } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

const ping = command({
  name: "ping",
  description: "Check latency",
  run: (ctx) => ctx.reply(`Pong! ${ctx.client.ws.ping}ms`),
});

const ready = event("clientReady", (c) => console.log(`Online as ${c.user.tag}`));

client.register(ping, ready);
await client.start(process.env.DISCORD_TOKEN);
await client.deployCommands({ guildId: "YOUR_GUILD_ID" }); // instant in one guild
```

## Slash commands with inferred options

Option values are typed from your declaration. Required options are non-nullable;
optional ones are `T | undefined`; `choices` narrow to a literal union.

```ts
import { command, option } from "spearkit";

export default command({
  name: "echo",
  description: "Repeat a message",
  options: {
    text: option.string({ description: "What to say", required: true }),
    times: option.integer({ description: "Repeat count", minValue: 1, maxValue: 5 }),
    visibility: option.string({
      description: "Who sees it",
      choices: [
        { name: "Everyone", value: "public" },
        { name: "Just me", value: "private" },
      ],
    }),
  },
  run: (ctx) => {
    ctx.options.text;       // string
    ctx.options.times;      // number | undefined
    ctx.options.visibility; // "public" | "private" | undefined
    return ctx.reply({
      content: ctx.options.text.repeat(ctx.options.times ?? 1),
      ephemeral: ctx.options.visibility === "private",
    });
  },
});
```

Builders: `string`, `integer`, `number`, `boolean`, `user`, `channel`, `role`,
`mentionable`, `attachment`.

### Autocomplete

Co-locate the suggestion provider with the option:

```ts
option.string({
  description: "Fruit",
  required: true,
  autocomplete: (ctx) =>
    fruits.filter((f) => f.startsWith(ctx.value)).map((f) => ({ name: f, value: f })),
});
```

### Subcommands

```ts
import { commandGroup, subcommand, subcommandGroup, option } from "spearkit";

commandGroup({
  name: "admin",
  description: "Admin tools",
  guildOnly: true,
  subcommands: {
    say: subcommand({
      description: "Make the bot speak",
      options: { message: option.string({ description: "Message", required: true }) },
      run: (ctx) => ctx.reply(ctx.options.message),
    }),
  },
  groups: {
    users: subcommandGroup({
      description: "Manage users",
      subcommands: {
        ban: subcommand({
          description: "Ban a user",
          options: { target: option.user({ description: "Who", required: true }) },
          run: (ctx) => ctx.reply(`Banned ${ctx.options.target.tag}`),
        }),
      },
    }),
  },
});
```

## Interactive components

Define the component, its custom-id pattern and its handler in one place. Params
in the custom-id pattern (`{name}`) are typed everywhere — both in the handler's
`ctx.params` and in the `build()` call.

```ts
import { button, stringSelect, modal, textInput, row } from "spearkit";

const vote = button({
  id: "vote:{choice}",            // {choice} becomes a typed param
  label: "Yes",
  style: "Success",
  run: (ctx) => ctx.update(`You chose ${ctx.params.choice}`), // ctx.params.choice: string
});

const colour = stringSelect({
  id: "colour",
  placeholder: "Pick a colour",
  options: [
    { label: "Red", value: "red" },
    { label: "Blue", value: "blue" },
  ],
  run: (ctx) => ctx.reply({ content: ctx.values.join(", "), ephemeral: true }),
});

const feedback = modal({
  id: "feedback:{ticket}",
  title: "Feedback",
  fields: {
    summary: textInput({ label: "Summary", required: true }),
    detail: textInput({ label: "Details", style: "Paragraph" }),
  },
  run: (ctx) =>
    // ctx.params.ticket: string, ctx.fields.summary / ctx.fields.detail: string
    ctx.reply({ content: `#${ctx.params.ticket}: ${ctx.fields.summary}`, ephemeral: true }),
});

client.register(vote, colour, feedback);

// Use them in a message — build() requires exactly the params the pattern declares:
await channel.send({
  content: "Choose:",
  components: [row(vote.build({ choice: "yes" })), row(colour.build())],
});
```

Component builders: `button`, `linkButton`, `stringSelect`, `userSelect`,
`roleSelect`, `channelSelect`, `mentionableSelect`, `modal` (+ `textInput`), `row`.

spearkit routes interactions automatically by the custom-id namespace and decodes
the params for you — no `interactionCreate` switch statements.

## File-based loading

Drop commands, events and components in a folder (default or named exports) and
load them all:

```ts
await client.load(new URL("./commands", import.meta.url).pathname);
```

## Plugins

```ts
import { definePlugin } from "spearkit";

const moderation = definePlugin({
  name: "moderation",
  setup(client) {
    client.register(/* commands, events, components */);
  },
});

await client.use(moderation);
```

## Drop-in replacement

Everything discord.js exports is available from spearkit, so you can migrate
incrementally:

```ts
import { Client, EmbedBuilder, GatewayIntentBits } from "spearkit"; // all from discord.js
```

## Error handling

Handler errors never crash the process. Customise the response:

```ts
client.commands.onError((error, interaction) => {
  console.error(error);
  return interaction.reply({ content: "Oops.", flags: 64 });
});
client.components.onError((error) => console.error(error));
```

## License

[PolyForm Noncommercial License 1.0.0](./LICENSE).

spearkit is **free for noncommercial use** — personal projects, learning,
research, and use by nonprofit/educational/government organizations. You may
**not** use it in software or projects you sell or that are built for
commercial advantage without a separate commercial license. See [`LICENSE`](./LICENSE)
for the full terms, or open an issue to discuss a commercial license.
