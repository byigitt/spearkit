# spearkit cheatsheet

Condensed map of every spearkit export. All importable from `"spearkit"` alongside
the full discord.js surface. For prose and edge cases, read the package's
`llms-full.txt` or `docs/`.

## Use cases — reach for

**Bot setup & lifecycle**

| Want to… | Reach for |
| --- | --- |
| Start a bot and connect | `new SpearClient({ intents })` + `await client.start(token)` |
| Choose gateway intents | `Intents.none / default / guilds / messages / all` |
| Wire up handlers | `client.register(...)`; one file per handler → `client.load(dir)` |
| Push commands to Discord | `client.deployCommands({ guildId })`; slash + menus, safe CI → `client.deployAllCommands({ strategy: "diff", dryRun })` |
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

## Client

```ts
new SpearClient(options?: Partial<ClientOptions>) // intents optional → Intents.default
client.commands   // CommandRegistry
client.events     // EventRegistry
client.components // ComponentRegistry
client.register(...items)            // route SlashCommand | EventDef | ComponentDef | PrefixCommand | ContextMenu | ScheduledTask
client.use(...plugins): Promise<this>
client.load(dir, options?): Promise<number>            // imports compiled JS (.js/.mjs/.cjs)
client.start(token?): Promise<this>                    // login; falls back to DISCORD_TOKEN
client.deployCommands({ guildId? }): Promise<DeployResult>      // after start()
client.deployAllCommands({ guildId?, applicationId?, strategy?: "diff", dryRun? }) // slash + context menus
client.schedule(taskConfig); client.scheduler          // TaskScheduler
client.cooldowns; client.prefix; client.usage; client.logger; client.embeds

const Intents = { none: [], default: [Guilds], guilds: [Guilds, GuildMembers],
                  messages: [Guilds, GuildMessages, MessageContent], all: /* every intent */ }
```

## Commands & options

```ts
command({ name, description, options?, defaultMemberPermissions?, nsfw?, guildOnly?,
          nameLocalizations?, descriptionLocalizations?, guards?, cooldown?, run })
commandGroup({ name, description, subcommands?, groups?, defaultMemberPermissions?, nsfw?, guildOnly?, ... })
subcommand({ description, options?, run, ... })
subcommandGroup({ description, subcommands, ... })

option.string({ description, required?, choices?, minLength?, maxLength?, autocomplete? })   // string
option.integer({ description, required?, choices?, minValue?, maxValue?, autocomplete? })    // number
option.number(...)   // number
option.boolean(...)  // boolean
option.user(...)     // User
option.channel({ ..., channelTypes? }) // channel union
option.role(...)     // Role | APIRole
option.mentionable(...) // user/role/member
option.attachment(...)  // Attachment

// choices: { name, value, nameLocalizations? }[]   (value narrows the resolved type to a literal union)
// autocomplete: (ctx: AutocompleteContext) => Awaitable<OptionChoice[]>   ctx.value / ctx.respond(...)
```

`CommandContext`: `options`, `commandName`, `subcommand`, `showModal(modal)` + BaseContext.

## Components

```ts
button({ id, label?, style?, emoji?, disabled?, guards?, run })   // style: "Primary"|"Secondary"|"Success"|"Danger"|ButtonStyle.*
linkButton({ url, label?, emoji?, disabled? })                    // returns ButtonBuilder (no handler)
stringSelect({ id, options, placeholder?, minValues?, maxValues?, disabled?, guards?, run })
userSelect / roleSelect / mentionableSelect ({ id, placeholder?, minValues?, maxValues?, disabled?, guards?, run })
channelSelect({ id, channelTypes?, placeholder?, minValues?, maxValues?, disabled?, guards?, run })
modal({ id, title, fields, run })   // fields: Record<string, TextInputDef>
textInput({ label, style?, placeholder?, required?, minLength?, maxLength?, value? }) // style: "Short"|"Paragraph"
row(...components): ActionRowBuilder

component.build(params?)  // requires exactly the {param}s in id; no args when none

// id pattern: "name" or "name:{a}:{b}"   →  ctx.params.a, ctx.params.b (string)
// MAX_CUSTOM_ID_LENGTH = 100
```

Contexts: `ButtonContext` (params); `StringSelectContext` (values, value);
`UserSelectContext`/`MentionableSelectContext` (values, users, members[, roles]);
`RoleSelectContext` (values, roles); `ChannelSelectContext` (values, channels);
`ModalContext` (params, fields). All component contexts: `update`, `deferUpdate`,
`showModal`, `message`, `customId`.

## Events

```ts
event("clientReady", (c) => ...)              // name from discord.js ClientEvents (args inferred)
event({ name, once?, run })
// errors + rejections route to the client's "error" event
```

## Contexts (BaseContext — every handler)

```ts
reply(input) · replyEphemeral(input) · defer({ ephemeral? }) · editReply(input) ·
followUp(input) · send(input) · error(message)
success(input) · info(input) · warn(input) · error(input)                 // preset embeds, state-aware
replySuccess/replyInfo/replyWarn/replyError(input)
client · user · member · guild · guildId · channel · channelId · locale · deferred · replied
// ReplyInput = string | (InteractionReplyOptions & { ephemeral?: boolean })
```

## Guards

```ts
guildOnly(reason?) · dmOnly(reason?) · requireAnyRole(ids, reason?) · requireAllRoles(ids, reason?)
requireOwner(ownerIds, reason?) · requireUserPermissions(perm, reason?) · requireBotPermissions(perm, reason?)
guard(predicate) · denied(reason?)
// per-handler: { guards: [...] } on command/prefixCommand/button/userCommand/messageCommand
// client-wide:  new SpearClient({ guards: [...] })
```

## Cooldowns

```ts
command({ cooldown: number | CooldownConfig })
new SpearClient({ cooldown: CooldownConfig })
CooldownConfig = { duration, scope?: "user"|"guild"|"channel"|"global",
                   exempt?: { users?, roles? }, overrides?: { users?, roles? },
                   message?: string | ((remainingMs) => string) }
```

## Scheduler

```ts
task({ name, cron?, interval?, runOnStart?, run: (client) => ... })   // register() it
client.schedule(config)
cron(expr).next(from?: Date): Date
client.scheduler.delay(name, ms, fn) -> { cancel() }
client.scheduler.followUp(name, [10_000, 30_000], (i) => ...) -> { cancel() }
client.scheduler.reconcile(name, async (client) => ...)   // once on ready
```

## Prefix commands

```ts
new SpearClient({ prefix: "!" | string[] | { prefix, mention?, ignoreBots?, caseInsensitive? } })
prefixCommand({ name, aliases?, description?, cooldown?, guards?, args?, run })
// PrefixContext: message, commandName, args: string[], rest: string, reply, send, options (when args used)
prefixArgs() builder: .string(n) .integer(n) .number(n) .boolean(n) .snowflake(n) .duration(n) .rest(n)
prefixCommand({ args: (a) => a.snowflake("target").duration("d").rest("reason"), run: (ctx) => ctx.options })
// reading other users' content requires the privileged MessageContent intent (Intents.messages)
```

## Context menus

```ts
userCommand({ name, guards?, cooldown?, run: (ctx) => ctx.targetUser / ctx.targetMember })
messageCommand({ name, guards?, cooldown?, run: (ctx) => ctx.targetMessage })
// deploy with slash commands via client.deployAllCommands(...)
```

## Pagination & confirm

```ts
paginate(interaction, items, { render, pageSize?, user?, timeoutMs?, controls?: "prev-next"|"first-prev-next-last", ephemeral?, labels?, namespace? })
buildPaginatorPage(items, page, options) -> { payload, pages }
confirm(interaction, { body, title?, confirm?, cancel?, user?, timeoutMs?, ephemeral?, namespace? })
  -> { confirmed: boolean, reason: "confirm"|"cancel"|"timeout", interaction? }
```

## Embeds

```ts
client.embeds.{ error|success|info|warn|build(level, input) }
createEmbeds(opts?)  // alias for new Embeds(opts)
new SpearClient({ embeds: { /* colors/icons per level */ } })
// BaseContext exposes ctx.success/info/warn/error + replySuccess/Info/Warn/Error
```

## Logging

```ts
new Logger({ level, transports: [consoleSink, jsonlSink("./logs/bot.jsonl"), webhookSink({ url, minLevel: "error" })] })
logger.debug/info/warn/error(message, { error?, data? }); logger.child(scope); logger.setLevel(level); logger.enabled(level)
logger.addTransport(sink); logger.setTransports([sinks])
new SpearClient({ logger: { level: "debug" } })   // client.logger
```

## Usage tracking

```ts
new SpearClient({ usage: { store?, channel?, format? } })   // client.usage
MemoryUsageStore  // record, all, size, byUser(id), clear
JsonFileUsageStore(path)
// UsageEvent { type: "command"|"prefix"|"component"|"event", name, userId?, userTag?, guildId?, channelId?,
//              detail?, outcome?: "success"|"error", durationMs?, errorMessage?, options?, timestamp }
```

## Env

```ts
loadEnv({ path?, override? }); parseEnv(content)
env.string(k, fallback?) · env.number(k, fallback?) · env.boolean(k, fallback?) · env.require(k)
// SpearClient auto-loads .env on start(); configure/disable via the `dotenv` option
```

## Plugins & loading

```ts
definePlugin({ name, setup(client) }); await client.use(plugin)
collectModules(dir, options?); loadInto(client, dir, options?)
client.load(dir, { extensions?: readonly string[], recursive? })  // defaults [.js,.mjs,.cjs], true
```

## Primitives

```ts
new KeyedLock(); lock.tryAcquire(key, ttl?); lock.run(key, fn, { onBusy?, ttl? }); lock.isHeld(key); lock.forget(key); lock.dispose()
safeFetch.{ member, channel, message, user, guild, role, try }  // each returns T | null
withSafeTimeout(promise, ms)  // T | null
formatDuration(ms, { locale?: "en"|"tr"|UnitLabels, largest?, units? })
parseDuration(input): number | null
discordTimestamp(date, style?: "t"|"T"|"d"|"D"|"f"|"F"|"R"); relativeTimestamp(date)
new MemoryCache()  // CacheStore: get/set/delete/has/increment/rateLimit/clear (TTL + counters + fixed-window rate limit)
loadConfig({ file, parser?, schema?, encoding? }); loadConfigAsync(opts)   // JSON/JSON5/YAML
lookup(table, resourceName?) -> (key) => value
```

## Error handling

```ts
client.commands.onError((error, interaction) => interaction.reply({ content: "Oops.", flags: 64 }))
client.components.onError((error, interaction) => console.error(error))
// handler errors never crash the process; uncaught ones flow through client.logger
```
