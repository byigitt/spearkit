---
name: spearkit
description: >-
  Write and edit Discord bots built with the spearkit package ("discord.js++"):
  type-safe slash commands, options, subcommands, autocomplete, buttons / select
  menus / modals with custom-id routing, events, cooldowns, scheduled tasks,
  prefix commands, guards, context menus, pagination / confirm, preset embeds,
  structured logging, usage tracking and dotenv. Use whenever a file imports from
  "spearkit", or when asked to build or modify a Discord bot, slash command,
  button, select menu, modal, autocomplete, or interaction handler in a spearkit
  project.
---

# spearkit

spearkit is a developer-experience-first layer over [discord.js](https://discord.js.org).
It **re-exports the entire discord.js surface** (so it is a drop-in replacement)
and adds a fully type-safe API: handlers never see `any`/`unknown`. Install with
`npm install spearkit discord.js`.

When a task needs more than this file, load
[`reference/cheatsheet.md`](reference/cheatsheet.md) (every exported symbol + ready
recipes). The package also ships `llms-full.txt` (all docs in one file) and a
`docs/` folder; in a consumer project they sit under `node_modules/spearkit/`.

## Non-negotiable rules

1. **Import only from `"spearkit"`** — spearkit's helpers *and* every discord.js
   symbol (`Client`, `EmbedBuilder`, `GatewayIntentBits`, `REST`, `Routes`,
   `PermissionFlagsBits`, …). Never add a separate `import … from "discord.js"`.
2. **Use `SpearClient`** (extends discord.js `Client`; routes interactions).
   `intents` is optional → defaults to `Intents.default` (`[Guilds]`).
3. **Co-locate** definition + handler in one object; `client.register(...)` it.
   **Never** write an `interactionCreate` switch or parse custom ids by hand —
   spearkit routes commands by name and components by custom-id namespace.
4. **Lifecycle order:** `register(...)` → `await client.start(token)` →
   `await client.deployCommands({ guildId })`. Deploy **after** `start()`; deploy
   only when command *definitions* change (not every restart).
5. **The ready event is `clientReady`**, not `ready` (discord.js v14.16 rename).
6. **Trust inference.** Required options are non-nullable, optional ones are
   `T | undefined`, `choices` narrow to a literal union, custom-id `{param}`s and
   modal field keys are typed. Do not cast; do not annotate handler args.
7. **Hidden replies:** `ctx.replyEphemeral(...)` or `ctx.reply({ content, ephemeral: true })`
   (spearkit normalizes `ephemeral`). Do not hand-set message flags.

## Minimal bot

```ts
import { SpearClient, Intents, command, option, event } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

const greet = command({
  name: "greet",
  description: "Greet someone",
  options: { who: option.user({ description: "Who", required: true }) },
  run: (ctx) => ctx.reply(`Hello ${ctx.options.who}!`), // ctx.options.who: User
});

client.register(greet, event("clientReady", (c) => console.log(c.user.tag)));
await client.start(process.env.DISCORD_TOKEN);              // falls back to DISCORD_TOKEN
await client.deployCommands({ guildId: process.env.GUILD_ID }); // omit guildId → global (slow)
```

## Pick the right tool

- **Slash command** → `command()`; **typed inputs** → `option.*`; **grouped** → `commandGroup` + `subcommand`; **type-ahead** → `option.string({ autocomplete })`.
- **Right-click on a user/message** → `userCommand` / `messageCommand`; **`!text` command** → `prefixCommand` (+ typed `args`).
- **Button** → `button`; **URL button** → `linkButton`; **dropdown** → `stringSelect`; **pick user/role/channel/mentionable** → `userSelect` / `roleSelect` / `channelSelect` / `mentionableSelect`; **form** → `modal` + `textInput`; **carry data** → custom-id `{param}`.
- **Paged list** → `paginate`; **yes/no gate** → `confirm`.
- **Reply** → `ctx.reply` / `replyEphemeral`; **>3s work** → `ctx.defer()` then `editReply`; **styled embed** → `ctx.success/error/info/warn`.
- **Gateway events** → `event(...)`; **rate-limit** → `cooldown`; **role/permission/owner gate** → guards; **cron/interval** → `task` / `client.schedule`; **logs** → `client.logger` + sinks; **usage tracking** → `usage`; **typed env / `.env`** → `env.*`.
- **Reusable bundle** → `definePlugin` + `client.use`; **file-per-handler** → `client.load`; **deploy** → `client.deployCommands` / `deployAllCommands`.
- **Primitives** — per-key lock → `KeyedLock`; null-safe fetch → `safeFetch.*`; durations → `formatDuration` / `parseDuration`; timestamps → `discordTimestamp`; cache / rate-limit → `MemoryCache`; config files → `loadConfig`.

## Recipes

### Slash command with typed options

```ts
const echo = command({
  name: "echo",
  description: "Repeat a message",
  options: {
    text: option.string({ description: "What to say", required: true }),     // string
    times: option.integer({ description: "Count", minValue: 1, maxValue: 5 }),// number | undefined
    mode: option.string({
      description: "Visibility",
      choices: [{ name: "Everyone", value: "public" }, { name: "Just me", value: "private" }],
    }),                                                                       // "public" | "private" | undefined
  },
  run: (ctx) =>
    ctx.reply({
      content: ctx.options.text.repeat(ctx.options.times ?? 1),
      ephemeral: ctx.options.mode === "private",
    }),
});
```

Option builders: `option.string|integer|number|boolean|user|channel|role|mentionable|attachment`.
Co-located autocomplete: `option.string({ autocomplete: (ctx) => choices.filter(c => c.startsWith(ctx.value)).map(c => ({ name: c, value: c })) })`.

### Subcommands

```ts
import { commandGroup, subcommand, subcommandGroup, option } from "spearkit";

commandGroup({
  name: "admin", description: "Admin tools", guildOnly: true,
  subcommands: {
    say: subcommand({
      description: "Speak",
      options: { message: option.string({ description: "Text", required: true }) },
      run: (ctx) => ctx.reply(ctx.options.message),
    }),
  },
  groups: {
    users: subcommandGroup({
      description: "Manage users",
      subcommands: {
        ban: subcommand({
          description: "Ban", options: { target: option.user({ description: "Who", required: true }) },
          run: (ctx) => ctx.reply(`Banned ${ctx.options.target.tag}`),
        }),
      },
    }),
  },
});
```

### Components (button / select / modal)

```ts
import { button, stringSelect, modal, textInput, row } from "spearkit";

const vote = button({
  id: "vote:{choice}",                 // {choice} → typed param
  label: "Yes", style: "Success",      // "Primary" | "Secondary" | "Success" | "Danger"
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
  fields: {
    summary: textInput({ label: "Summary", required: true }),
    detail: textInput({ label: "Details", style: "Paragraph" }),
  },
  run: (ctx) => ctx.reply(`#${ctx.params.ticket}: ${ctx.fields.summary}`), // params + fields typed
});

client.register(vote, colour, feedback);

// build() requires exactly the {param}s the id declares (ids cap at 100 chars):
await channel.send({ content: "Choose:", components: [row(vote.build({ choice: "yes" })), row(colour.build())] });
```

Component builders: `button`, `linkButton`, `stringSelect`, `userSelect`,
`roleSelect`, `channelSelect`, `mentionableSelect`, `modal` (+ `textInput`), `row`.
Component context: `ctx.params`, `ctx.update`, `ctx.deferUpdate`, `ctx.showModal`,
`ctx.message`; selects add `ctx.values` (+ `ctx.users/roles/channels/members`);
modals add `ctx.fields`.

### Guards, cooldown, context menus, pagination/confirm

```ts
import { command, requireAnyRole, guildOnly, userCommand, paginate, confirm } from "spearkit";

const purge = command({
  name: "purge", description: "Delete messages",
  guards: [guildOnly(), requireAnyRole(["MOD_ROLE_ID"])],
  cooldown: { duration: 10_000, scope: "user" },
  run: (ctx) => ctx.replySuccess("Done"),
});

const report = userCommand({ name: "Report", run: (ctx) => ctx.replyEphemeral(`Reported ${ctx.targetUser.tag}`) });

await paginate(ctx.interaction, items, {
  pageSize: 10,
  render: (slice, { page, pages }) =>
    new EmbedBuilder().setTitle(`Page ${page + 1}/${pages}`).setDescription(slice.join("\n")),
});

const { confirmed } = await confirm(ctx.interaction, {
  body: "Reset everything?", confirm: { label: "Reset", style: "Danger" },
});
if (!confirmed) return ctx.error("Cancelled.");
```

Guards usable on `command`/`prefixCommand`/`button`/`userCommand`/`messageCommand`
configs, or client-wide via `new SpearClient({ guards: [...] })`.

## Context (every handler)

`reply` · `replyEphemeral` · `defer({ ephemeral? })` · `editReply` · `followUp` ·
`send` (state-aware) · `error(msg)` · preset embeds `success/info/warn/error`
(+ `replySuccess/Info/Warn/Error`) · accessors `client/user/member/guild/guildId/
channel/channelId/locale` · state `deferred/replied`. Commands add `ctx.options`,
`ctx.commandName`, `ctx.subcommand`, `ctx.showModal`.

## Subsystems (configured on `SpearClient` options)

- **Cooldowns** — `command({ cooldown: number | CooldownConfig })` or
  `new SpearClient({ cooldown })`; scopes `user|guild|channel|global`, plus
  `exempt`/`overrides`.
- **Scheduled tasks** — `task({ name, cron?, interval?, runOnStart?, run })`,
  `client.schedule(...)`, `client.scheduler.delay/followUp/reconcile`, `cron(expr)`.
- **Prefix commands** — `prefixCommand({ name, aliases?, cooldown?, guards?, args?, run })`
  + `new SpearClient({ prefix: "!" })`. Typed args:
  `args: (a) => a.snowflake("target").duration("d").rest("reason")` → `ctx.options`.
  Reading **other users'** content needs the privileged `MessageContent` intent —
  use `Intents.messages` and enable it in the Developer Portal.
- **Context menus** — `userCommand`/`messageCommand`; deploy with slash commands
  via `client.deployAllCommands({ guildId, strategy: "diff", dryRun? })`.
- **Logging** — `client.logger`; `new SpearClient({ logger: { level, transports: [consoleSink, jsonlSink(path), webhookSink({ url })] } })`.
- **Usage tracking** — `new SpearClient({ usage: { store?, channel?, format? } })`;
  `MemoryUsageStore`, `JsonFileUsageStore`.
- **Env** — `.env` auto-loads on `start()`; read with `env.string/number/boolean/require`.
- **Plugins** — `definePlugin({ name, setup(client) })`, then `await client.use(plugin)`.
- **File-based loading** — `await client.load(dir)`. Imports **compiled JS**
  (default extensions `.js/.mjs/.cjs`); build before running compiled output.
- **Primitives** — `KeyedLock`, `safeFetch.{member,channel,message,user,guild,role,try}`,
  `formatDuration`/`parseDuration`/`discordTimestamp`/`relativeTimestamp`,
  `MemoryCache`, `loadConfig`.

## Mistakes to avoid

- Importing from `"discord.js"` (use `"spearkit"`).
- Listening on `"ready"` instead of `"clientReady"`.
- `deployCommands()` before `start()`, or deploying on every restart.
- Hand-rolling an `interactionCreate` switch or splitting custom ids manually.
- Passing wrong/missing params to `component.build(...)` (typed; pass exactly the
  declared `{param}`s).
- Forgetting the `MessageContent` intent when prefix commands must read other
  users' messages.

## Verify your work

In a spearkit repo, run `npm run typecheck` (and `npm test`) — option values,
custom-id params and modal fields are statically checked, so a type error usually
means the definition and handler disagree.
