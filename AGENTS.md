# AGENTS.md — writing code with spearkit

Authoritative rules for AI agents (and humans) writing Discord bots with
**spearkit**. Read this first; it is short on purpose. For depth, load
[`llms-full.txt`](./llms-full.txt) (every guide + the full API reference in one
file) or browse [`docs/`](./docs) and [`examples/`](./examples).

spearkit is **discord.js++**: it re-exports the entire discord.js surface (so it
is a drop-in replacement) and adds a fully type-safe layer for slash commands,
options, components, events, cooldowns, scheduled tasks, prefix commands,
logging, usage tracking and dotenv. Install: `npm install spearkit discord.js`.

## Golden rules

1. **Import everything from `"spearkit"`.** Both spearkit's helpers and every
   discord.js symbol (`Client`, `EmbedBuilder`, `GatewayIntentBits`, `REST`,
   `Routes`, …) come from `"spearkit"`. Do **not** add a separate
   `import … from "discord.js"`.
2. **Use `SpearClient`, not `Client`.** It extends discord.js `Client` and wires
   up command/event/component routing. `intents` may be omitted (defaults to
   `Intents.default`).
3. **Co-locate definition + handler.** A command's options and `run`, a button's
   look and click logic, a modal's fields and submit — each in one object.
4. **Never write an `interactionCreate` switch.** Define commands/components and
   `client.register(...)` them; spearkit routes by command name and custom-id
   namespace and decodes typed params for you.
5. **Lifecycle order:** `client.register(...)` → `await client.start(token)` →
   `await client.deployCommands({ guildId })`. Deploy **after** `start()` (it
   uses the client's authenticated REST and the ready application id).
6. **The ready event is `clientReady`**, not `ready` (discord.js v14.16 rename).
7. **Trust inference.** Required options are non-nullable, optional ones are
   `T | undefined`, `choices` narrow to a literal union, custom-id `{param}`s and
   modal field keys are typed. Don't cast; don't annotate handler args.

## Use cases — reach for

Map the task to the API. Patterns and signatures are below and in `docs/`.

**Bot setup & lifecycle**

| Want to… | Reach for |
| --- | --- |
| Start a bot and connect | `new SpearClient({ intents })` + `await client.start(token)` |
| Choose gateway intents | `Intents.none / default / guilds / messages / all` |
| Wire up handlers | `client.register(...)`; one file per handler → `client.load(dir)` |
| Push commands to Discord | `client.deployCommands({ guildId })`; slash + context menus, safe CI → `client.deployAllCommands({ strategy: "diff", dryRun })` |
| Package a reusable feature | `definePlugin(...)` + `client.use(...)` |
| Migrate an existing discord.js bot | import from `"spearkit"`, swap `Client` → `SpearClient` |

**Commands & input**

| Want to… | Reach for |
| --- | --- |
| A slash command | `command({ name, description, run })` |
| Typed inputs to a command | `options: { x: option.string/integer/number/boolean/user/channel/role/mentionable/attachment(...) }` |
| Group many commands under one name | `commandGroup` + `subcommand` / `subcommandGroup` |
| Suggest values while the user types | `option.string({ autocomplete })` |
| A right-click "Apps" action on a user/message | `userCommand` / `messageCommand` |
| A classic `!text` command | `prefixCommand(...)` + `new SpearClient({ prefix })` |
| Parse `!cmd` arguments into typed values | `args: (a) => a.snowflake().duration().rest()` → `ctx.options` |

**Interactivity (components)**

| Want to… | Reach for |
| --- | --- |
| A clickable button | `button({ id, run })` → `row(btn.build(...))` |
| A URL button (no handler) | `linkButton` |
| A dropdown of fixed options | `stringSelect` |
| Pick users / roles / channels / mentionables | `userSelect` / `roleSelect` / `channelSelect` / `mentionableSelect` |
| A form with text fields | `modal` + `textInput` |
| Carry data through a component | custom-id params `id: "x:{id}"` → `ctx.params.id` |
| A paged list with next/prev | `paginate(...)` |
| An "Are you sure?" yes/no gate | `confirm(...)` |

**Replies & UX**

| Want to… | Reach for |
| --- | --- |
| Reply, public or hidden | `ctx.reply(...)` / `ctx.replyEphemeral(...)` |
| Work that takes >3s | `ctx.defer()` then `ctx.editReply(...)` |
| A styled success/error/info/warn embed | `ctx.success/error/info/warn(...)` |
| "Reply, edit, or follow-up — whichever fits" | `ctx.send(...)` |

**Cross-cutting concerns**

| Want to… | Reach for |
| --- | --- |
| React to gateway events | `event(name, run)`; once on startup → `event("clientReady", ...)` |
| Rate-limit a command/handler | `cooldown` (per-command or client-wide) |
| Restrict by role / permission / owner / guild | guards: `requireAnyRole` / `requireUserPermissions` / `requireOwner` / `guildOnly` |
| Run jobs on cron or interval | `task({ cron \| interval })` / `client.schedule(...)` |
| Delay once / staged follow-ups / recover on restart | `client.scheduler.delay` / `followUp` / `reconcile` |
| Structured logs to file/webhook | `client.logger` + `consoleSink` / `jsonlSink` / `webhookSink` |
| Track who used what | `new SpearClient({ usage })` + `MemoryUsageStore` / `JsonFileUsageStore` |
| Read typed env / load `.env` | `env.string/number/boolean/require` (auto-loaded on `start()`) |

**Utilities (primitives)**

| Want to… | Reach for |
| --- | --- |
| Stop concurrent runs per key (e.g. per user) | `KeyedLock` |
| Fetch that returns `null` instead of throwing | `safeFetch.{member,channel,message,user,guild,role}` |
| Format/parse `"1h30m"` durations | `formatDuration` / `parseDuration` |
| Render `<t:…>` Discord timestamps | `discordTimestamp` / `relativeTimestamp` |
| In-memory cache / counters / rate-limit window | `MemoryCache` |
| Load JSON/JSON5/YAML config | `loadConfig` |

## Canonical patterns

### Client + lifecycle

```ts
import { SpearClient, Intents, command, option, event } from "spearkit";

const client = new SpearClient({ intents: Intents.default }); // Intents: none|default|guilds|messages|all

const ready = event("clientReady", (c) => console.log(`Online as ${c.user.tag}`));

client.register(/* commands, events, components */ ready);
await client.start(process.env.DISCORD_TOKEN);          // falls back to DISCORD_TOKEN
await client.deployCommands({ guildId: process.env.GUILD_ID }); // omit guildId for global (slow)
```

### Slash commands + typed options

```ts
const echo = command({
  name: "echo",
  description: "Repeat a message",
  options: {
    text: option.string({ description: "What to say", required: true }), // string
    times: option.integer({ description: "Count", minValue: 1, maxValue: 5 }), // number | undefined
    who: option.user({ description: "Mention", required: true }),          // User
  },
  run: (ctx) =>
    ctx.reply(ctx.options.text.repeat(ctx.options.times ?? 1)),
});
```

Builders: `option.string|integer|number|boolean|user|channel|role|mentionable|attachment`.
Autocomplete is co-located: `option.string({ autocomplete: (ctx) => [{ name, value }] })`.
Subcommands: `commandGroup({ name, description, subcommands, groups })` with
`subcommand(...)` and `subcommandGroup(...)`.

### Interactive components

```ts
import { button, stringSelect, modal, textInput, row } from "spearkit";

const vote = button({
  id: "vote:{choice}",                       // {choice} → typed param
  label: "Yes", style: "Success",            // "Primary"|"Secondary"|"Success"|"Danger"
  run: (ctx) => ctx.update(`You chose ${ctx.params.choice}`), // ctx.params.choice: string
});

const colour = stringSelect({
  id: "colour",
  options: [{ label: "Red", value: "red" }, { label: "Blue", value: "blue" }],
  run: (ctx) => ctx.replyEphemeral(ctx.values.join(", ")),     // ctx.values: string[]
});

const feedback = modal({
  id: "feedback:{ticket}",
  title: "Feedback",
  fields: { summary: textInput({ label: "Summary", required: true }) },
  run: (ctx) => ctx.reply(`#${ctx.params.ticket}: ${ctx.fields.summary}`), // typed params + fields
});

client.register(vote, colour, feedback);

// Put them in a message — build() requires exactly the params the id declares:
await channel.send({ content: "Choose:", components: [row(vote.build({ choice: "yes" })), row(colour.build())] });
```

Builders: `button`, `linkButton`, `stringSelect`, `userSelect`, `roleSelect`,
`channelSelect`, `mentionableSelect`, `modal` (+ `textInput`), `row`.
Component context: `ctx.params`, `ctx.update(...)`, `ctx.deferUpdate()`,
`ctx.showModal(modal)`; selects add `ctx.values` (+ `ctx.users/roles/channels/members`);
modals add `ctx.fields`.

### Context (every handler)

`ctx.reply` · `ctx.replyEphemeral` · `ctx.defer({ ephemeral? })` · `ctx.editReply`
· `ctx.followUp` · `ctx.send` (state-aware) · `ctx.error(msg)` · preset embeds
`ctx.success/info/warn/error` (+ `ctx.replySuccess/Info/Warn/Error`) · accessors
`ctx.client/user/member/guild/guildId/channel/channelId/locale` · state
`ctx.deferred/replied`. For hidden replies prefer `ctx.replyEphemeral(...)` or
`ctx.reply({ content, ephemeral: true })` — spearkit normalizes it.

## Subsystems (each has a guide in docs/)

- **Guards** — `guards: [...]` on `command`/`prefixCommand`/`button`/`userCommand`/
  `messageCommand`, or client-wide `new SpearClient({ guards })`. Helpers:
  `guildOnly`, `dmOnly`, `requireAnyRole`, `requireAllRoles`, `requireOwner`,
  `requireUserPermissions`, `requireBotPermissions`, `guard`, `denied`.
- **Cooldowns** — `command({ cooldown: number | CooldownConfig })` or
  `new SpearClient({ cooldown })`; scopes `user|guild|channel|global`, `exempt`,
  `overrides`.
- **Scheduled tasks** — `task({ name, cron?, interval?, runOnStart?, run })`,
  `client.schedule(...)`, `client.scheduler.delay/followUp/reconcile`, `cron(expr)`.
- **Prefix commands** — `prefixCommand({ name, aliases?, cooldown?, guards?, args?, run })`
  + `new SpearClient({ prefix: "!" })`. Typed args:
  `args: (a) => a.snowflake("target").duration("d").rest("reason")` → `ctx.options`.
  Reading **other users'** message content needs the privileged `MessageContent`
  intent — use `Intents.messages` and enable it in the Developer Portal.
- **Context menus** — `userCommand({ name, run: (ctx) => ctx.targetUser })`,
  `messageCommand({ name, run: (ctx) => ctx.targetMessage })`. Deploy slash +
  menus together with `client.deployAllCommands({ guildId, strategy: "diff", dryRun? })`.
- **Pagination / confirm** — `paginate(interaction, items, { pageSize, render, user?, timeoutMs?, controls?, ephemeral? })`;
  `const { confirmed } = await confirm(interaction, { body, confirm?, cancel?, user?, timeoutMs?, ephemeral? })`.
- **Logging** — `client.logger`; configure via `new SpearClient({ logger: { level, transports: [consoleSink, jsonlSink(path), webhookSink({ url })] } })`.
- **Usage tracking** — `new SpearClient({ usage: { store?, channel?, format? } })`;
  `MemoryUsageStore`, `JsonFileUsageStore`.
- **Env** — `.env` auto-loads on `start()`; read with `env.string/number/boolean/require`.
- **Plugins** — `definePlugin({ name, setup(client) })`, then `await client.use(plugin)`.
- **File-based loading** — `await client.load(dir)`. Imports **compiled JS**
  (default extensions `.js/.mjs/.cjs`), so build before running compiled output.
- **Primitives** — `KeyedLock`, `safeFetch.{member,channel,message,user,guild,role,try}`,
  `formatDuration`/`parseDuration`/`discordTimestamp`/`relativeTimestamp`,
  `MemoryCache`, `loadConfig`.

## Common mistakes to avoid

- Importing from `"discord.js"` in a spearkit project (use `"spearkit"`).
- Listening on `"ready"` instead of `"clientReady"`.
- Calling `deployCommands()` before `start()`.
- Hand-rolling an `interactionCreate` switch or parsing custom ids by hand.
- Passing the wrong/missing params to `component.build(...)` (it is typed — pass
  exactly the `{param}`s in the id; custom ids cap at 100 chars).
- Deploying on every restart — only deploy when command *definitions* change.

## For maintainers

`docs/*.md` is the single source of truth. `llms.txt`, `llms-full.txt` and the
`website/public/` copies are generated — run `npm run docs:llms` after editing
docs. A ready-to-use agent skill lives at
[`.claude/skills/spearkit/`](./.claude/skills/spearkit).
