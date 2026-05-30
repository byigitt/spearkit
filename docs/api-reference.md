# API reference

Every symbol spearkit exports, in addition to the entire re-exported discord.js
surface. Import any of these from `"spearkit"`.

```ts
import { SpearClient, command, option, event, button, modal, row /* … */ } from "spearkit";
```

---

## Client

### `class SpearClient extends Client`

A discord.js `Client` with registries and interaction routing wired up.

```ts
new SpearClient(options?: SpearClientOptions)
```

| Member | Type | Description |
| ------ | ---- | ----------- |
| `commands` | `CommandRegistry` | Slash command registry + dispatcher. |
| `events` | `EventRegistry` | Event listener registry. |
| `components` | `ComponentRegistry` | Button/select/modal router. |
| `register(...items: Registerable[])` | `this` | Route each item to the matching registry. |
| `use(...plugins: SpearPlugin[])` | `Promise<this>` | Run each plugin's `setup`. |
| `load(dir: string, options?: LoadOptions)` | `Promise<number>` | Import a directory and register its exports. Returns count. |
| `start(token?: string)` | `Promise<this>` | Log in (falls back to `DISCORD_TOKEN`). |
| `deployCommands(options?: { guildId?: string })` | `Promise<DeployResult>` | Push commands using the client's REST. Call after ready. |

Inherits everything from discord.js `Client` (`on`, `once`, `login`, `ws`, `rest`, `application`, `user`, …).

### `type SpearClientOptions = Partial<ClientOptions>`

Same as discord.js `ClientOptions`, but `intents` may be omitted (defaults to `Intents.default`).

### `const Intents`

Ready-made intent presets (arrays of `GatewayIntentBits`).

| Key | Contents |
| --- | -------- |
| `Intents.none` | `[]` |
| `Intents.default` | `[Guilds]` |
| `Intents.guilds` | `[Guilds, GuildMembers]` |
| `Intents.messages` | `[Guilds, GuildMessages, MessageContent]` |
| `Intents.all` | Every intent (includes privileged). |

### `type Registerable = SlashCommand | EventDef | ComponentDef`

The union accepted by `SpearClient.register`.

---

## Commands

### `function command<O, R>(config): SlashCommand`

Define a leaf slash command.

```ts
interface CommandConfig<O extends OptionMap, R> {
  name: string;
  description: string;
  options?: O;
  defaultMemberPermissions?: PermissionResolvable | null;
  nsfw?: boolean;
  guildOnly?: boolean;
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
  run: (ctx: CommandContext<O>) => Awaitable<R>;
}
```

### `function commandGroup(config: CommandGroupConfig): SlashCommand`

Define a command that routes to subcommands and/or subcommand groups.

```ts
interface CommandGroupConfig {
  name: string;
  description: string;
  subcommands?: Record<string, Subcommand>;
  groups?: Record<string, SubcommandGroup>;
  defaultMemberPermissions?: PermissionResolvable | null;
  nsfw?: boolean;
  guildOnly?: boolean;
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
}
```

### `function subcommand<O, R>(config): Subcommand`

```ts
interface SubcommandConfig<O extends OptionMap, R> {
  description: string;
  options?: O;
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
  run: (ctx: CommandContext<O>) => Awaitable<R>;
}
```

### `function subcommandGroup(config: SubcommandGroupConfig): SubcommandGroup`

```ts
interface SubcommandGroupConfig {
  description: string;
  subcommands: Record<string, Subcommand>;
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
}
```

### `class SlashCommand`

| Member | Type | Description |
| ------ | ---- | ----------- |
| `name` | `string` | Top-level command name. |
| `hasAutocomplete` | `boolean` | True if any option declares autocomplete. |
| `toJSON()` | `RESTPostAPIChatInputApplicationCommandsJSONBody` | REST payload. |
| `execute(interaction)` | `Promise<void>` | Run for a chat-input interaction. |
| `autocomplete(interaction)` | `Promise<void>` | Run autocomplete for the focused option. |

### `class CommandContext<O> extends BaseContext<ChatInputCommandInteraction>`

| Member | Type | Description |
| ------ | ---- | ----------- |
| `options` | `ResolvedOptions<O>` | Resolved, fully-typed option values. |
| `commandName` | `string` | Invoked command name. |
| `subcommand` | `string \| null` | Invoked subcommand, if any. |
| `showModal(modal)` | `Promise<void>` | Present a modal. |

Plus all `BaseContext` members.

### `class CommandRegistry`

| Member | Type | Description |
| ------ | ---- | ----------- |
| `add(...commands: SlashCommand[])` | `this` | Register commands (override by name). |
| `remove(name: string)` | `boolean` | Remove a command. |
| `get(name: string)` | `SlashCommand \| undefined` | Look up a command. |
| `all()` | `SlashCommand[]` | All commands. |
| `names` | `string[]` | All command names. |
| `size` | `number` | Count. |
| `onError(handler: CommandErrorHandler)` | `this` | Set the error handler. |
| `toJSON()` | `RESTPostAPIApplicationCommandsJSONBody[]` | Serialise all commands. |
| `handle(interaction)` | `Promise<void>` | Dispatch a chat-input interaction. |
| `handleAutocomplete(interaction)` | `Promise<void>` | Dispatch an autocomplete interaction. |
| `deploy(options: DeployOptions)` | `Promise<DeployResult>` | Push commands to discord. |

```ts
type CommandErrorHandler = (error: Error, interaction: ChatInputCommandInteraction) => Awaitable<void>;
interface DeployOptions { token?: string; applicationId: string; guildId?: string; rest?: REST; }
type DeployResult = RESTPutAPIApplicationCommandsResult | RESTPutAPIApplicationGuildCommandsResult;
```

---

## Options

### `const option`

Type-safe option builders. Each returns an `OptionDef` whose resolved value type
is inferred (required → value, optional → `value | undefined`, `choices` →
literal union).

| Builder | Resolved type | Extra config |
| ------- | ------------- | ------------ |
| `option.string(config)` | `string` | `choices?`, `minLength?`, `maxLength?`, `autocomplete?` |
| `option.integer(config)` | `number` | `choices?`, `minValue?`, `maxValue?`, `autocomplete?` |
| `option.number(config)` | `number` | `choices?`, `minValue?`, `maxValue?`, `autocomplete?` |
| `option.boolean(config)` | `boolean` | — |
| `option.user(config)` | `User` | — |
| `option.channel(config)` | channel union | `channelTypes?` |
| `option.role(config)` | `Role \| APIRole` | — |
| `option.mentionable(config)` | user/role/member | — |
| `option.attachment(config)` | `Attachment` | — |

Common config (`BaseConfig`):

```ts
{
  description: string;
  required?: boolean;            // default false
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
}
```

`choices` items are `OptionChoice<V>`:

```ts
interface OptionChoice<V extends string | number = string | number> {
  name: string;
  value: V;
  nameLocalizations?: LocalizationMap;
}
```

`autocomplete`:

```ts
type AutocompleteHandler<V extends string | number> =
  (ctx: AutocompleteContext) => Awaitable<OptionChoice<V>[]>;
```

### Option types

| Symbol | Description |
| ------ | ----------- |
| `interface OptionDef<TValue, TRequired>` | A described option (phantom-typed for inference). |
| `type AnyOptionDef` | `OptionDef<OptionValue, boolean>`. |
| `type OptionMap` | `Record<string, AnyOptionDef>`. |
| `type ResolvedOption<O>` | The handler value for one option. |
| `type ResolvedOptions<O>` | The handler's `options` object. |
| `type OptionValue` | Union of all possible resolved values. |
| `type AllowedChannelType` | Channel types valid for a channel option. |
| `function toAPIOption(name, def)` | Serialise one option to REST. |
| `function readOption(resolver, name, def)` | Read a resolved value (null → undefined). |
| `function optionsHaveAutocomplete(options)` | True if any option has autocomplete. |

### `class AutocompleteContext`

| Member | Type | Description |
| ------ | ---- | ----------- |
| `interaction` | `AutocompleteInteraction` | Raw interaction. |
| `client` / `user` / `guild` / `guildId` | — | Convenience accessors. |
| `commandName` | `string` | Command being completed. |
| `focusedName` | `string` | Name of the focused option. |
| `value` | `string` | Current partial value typed by the user. |
| `respond(choices: OptionChoice[])` | `Promise<void>` | Send up to 25 suggestions. |

---

## Events

### `function event(name, run): EventDef` / `function event(config): EventDef`

```ts
type EventHandler<E extends keyof ClientEvents> = (...args: ClientEvents[E]) => Awaitable<void>;
interface EventConfig<E extends keyof ClientEvents> { name: E; once?: boolean; run: EventHandler<E>; }
interface EventDef { name: keyof ClientEvents; once: boolean; attach(client: Client): void; detach(client: Client): void; }
```

Thrown errors and rejected promises are routed to the client's `error` event.

### `class EventRegistry`

| Member | Type | Description |
| ------ | ---- | ----------- |
| `add(...defs: EventDef[])` | `this` | Register listeners. |
| `size` | `number` | Count. |
| `attachAll(client: Client)` | `void` | Attach every listener. |
| `detachAll(client: Client)` | `void` | Detach every listener. |

---

## Components

### Builders

| Function | Returns | Notes |
| -------- | ------- | ----- |
| `button(config)` | `Button<P>` | Interactive button. |
| `linkButton(config)` | `ButtonBuilder` | URL button, no handler. |
| `stringSelect(config)` | `StringSelect<P>` | String select; takes `options`. |
| `userSelect(config)` | `UserSelect<P>` | User select. |
| `roleSelect(config)` | `RoleSelect<P>` | Role select. |
| `channelSelect(config)` | `ChannelSelect<P>` | Channel select; takes `channelTypes?`. |
| `mentionableSelect(config)` | `MentionableSelect<P>` | User + role select. |
| `modal(config)` | `Modal<P>` | Modal with `fields`. |
| `textInput(config)` | `TextInputDef` | A modal text-input field. |
| `row(...components)` | `ActionRowBuilder<C>` | Wrap components in a row. |

Each registrable component (`Button`, `StringSelect`, …, `Modal`) extends its
routing interface and adds `build(...args: BuildArgs<P>)`, which returns the
discord.js builder. `build` requires exactly the params declared in the id
pattern.

```ts
interface ButtonConfig<P extends string, R> {
  id: P;                       // pattern: "name" or "name:{param}"
  label?: string;
  style?: ButtonStyleInput;    // "Primary" | "Secondary" | "Success" | "Danger" | ButtonStyle.*
  emoji?: ComponentEmojiResolvable;
  disabled?: boolean;
  run: (ctx: ButtonContext<Params<P>>) => Awaitable<R>;
}

interface LinkButtonConfig { url: string; label?: string; emoji?: ComponentEmojiResolvable; disabled?: boolean; }

interface StringSelectConfig<P extends string, R> {
  id: P;
  options: readonly SelectMenuComponentOptionData[];
  placeholder?: string; minValues?: number; maxValues?: number; disabled?: boolean;
  run: (ctx: StringSelectContext<Params<P>>) => Awaitable<R>;
}

interface EntitySelectConfig<P extends string> {
  id: P; placeholder?: string; minValues?: number; maxValues?: number; disabled?: boolean;
}
// user/role/mentionable selects take EntitySelectConfig & { run };
// channelSelect additionally takes { channelTypes?: readonly ChannelType[] }.

function textInput(config: {
  label: string;
  style?: TextInputStyleInput;     // "Short" | "Paragraph" | TextInputStyle
  placeholder?: string; required?: boolean; minLength?: number; maxLength?: number; value?: string;
}): TextInputDef;

interface ModalConfig<P extends string, F extends Record<string, TextInputDef>, R> {
  id: P;
  title: string;
  fields: F;
  run: (ctx: ModalContext<Params<P>, keyof F & string>) => Awaitable<R>;
}
```

### Component contexts

| Class | Extra members |
| ----- | ------------- |
| `MessageComponentContext<P, I>` | `params`, `customId`, `message`, `update(input)`, `deferUpdate()`, `showModal(modal)` (+ BaseContext) |
| `ButtonContext<P>` | — |
| `StringSelectContext<P>` | `values: string[]`, `value: string \| undefined` |
| `UserSelectContext<P>` | `values`, `users`, `members` |
| `RoleSelectContext<P>` | `values`, `roles` |
| `ChannelSelectContext<P>` | `values`, `channels` |
| `MentionableSelectContext<P>` | `values`, `users`, `roles`, `members` |
| `ModalContext<P, F>` | `params`, `fields: Record<F, string>`, `customId` (+ BaseContext) |

### `class ComponentRegistry`

| Member | Type | Description |
| ------ | ---- | ----------- |
| `add(...defs: ComponentDef[])` | `this` | Register components (override by namespace). |
| `onError(handler: ComponentErrorHandler)` | `this` | Set the error handler. |
| `size` | `number` | Count. |
| `handle(interaction: Interaction)` | `Promise<boolean>` | Route an interaction; `true` if matched. |

```ts
type ComponentErrorHandler = (error: Error, interaction: RepliableInteraction) => Awaitable<void>;
type ComponentDef = ButtonRoute | StringSelectRoute | UserSelectRoute | RoleSelectRoute
  | ChannelSelectRoute | MentionableSelectRoute | ModalRoute;
```

### Custom-id codec

| Symbol | Description |
| ------ | ----------- |
| `type ParamNames<S>` | Union of `{param}` names in a pattern. |
| `type Params<S>` | The params object a pattern resolves to. |
| `type BuildArgs<S>` | `build()` args (none when no params). |
| `const MAX_CUSTOM_ID_LENGTH` | `100`. |
| `function compilePattern(pattern)` | → `CompiledPattern { pattern, namespace, paramNames }`. |
| `function buildCustomId(compiled, params)` | Encode a concrete id. |
| `function parseCustomId(customId)` | → `ParsedCustomId { namespace, values }`. |
| `function paramsFromValues(paramNames, values)` | Map values onto names. |

---

## Contexts (shared)

### `abstract class BaseContext<I>`

The base for every interaction context.

| Member | Type | Description |
| ------ | ---- | ----------- |
| `interaction` | `I` | Raw discord.js interaction. |
| `client` / `user` / `member` / `guild` / `guildId` / `channel` / `channelId` / `locale` | — | Accessors. |
| `deferred` / `replied` | `boolean` | Interaction state. |
| `reply(input)` | `Promise<InteractionResponse>` | Initial response. |
| `replyEphemeral(input)` | `Promise<InteractionResponse>` | Hidden reply. |
| `defer({ ephemeral? })` | `Promise<InteractionResponse>` | Acknowledge, respond later. |
| `editReply(input)` | `Promise<Message>` | Edit the response. |
| `followUp(input)` | `Promise<Message>` | Additional message. |
| `send(input)` | `Promise<void>` | State-aware reply/edit/followUp. |
| `error(message)` | `Promise<void>` | State-aware ephemeral error. |

```ts
type ReplyData = InteractionReplyOptions & { ephemeral?: boolean };
type ReplyInput = string | ReplyData;
function normalizeReply(input: ReplyInput): InteractionReplyOptions;
function asEphemeral(input: ReplyInput): ReplyData;
```

---

## Plugins

```ts
interface SpearPlugin { name: string; setup(client: SpearClient): Awaitable<void>; }
function definePlugin(plugin: SpearPlugin): SpearPlugin;
```

---

## Loading

```ts
interface LoadOptions { extensions?: readonly string[]; recursive?: boolean; } // defaults: [.js,.mjs,.cjs], true
function collectModules(dir: string, options?: LoadOptions): Promise<Registerable[]>;
function loadInto(client: SpearClient, dir: string, options?: LoadOptions): Promise<number>;
```

`SpearClient.load(dir, options?)` is the method form of `loadInto`.

---

## Added in 0.2

New subsystems, each with a dedicated guide. The `SpearClient` options
`{ logger?, dotenv?, cooldown?, prefix?, usage? }` configure them.

### Logging — [guide](./logging.md)

```ts
class Logger { debug/info/warn/error(message: string, options?: { error?: Error; data?: Record<string, LogValue> }): void; child(scope: string): Logger; setLevel(level: LogThreshold): this; enabled(level: LogLevel): boolean; }
type LogLevel = "debug" | "info" | "warn" | "error";
type LogThreshold = LogLevel | "silent";
function consoleSink(entry: LogEntry): void;
function toError(value: unknown): Error;
// client.logger is a Logger; new SpearClient({ logger: { level: "debug" } })
```

### Environment — [guide](./env.md)

```ts
function parseEnv(content: string): Record<string, string>;
function loadEnv(options?: { path?: string; override?: boolean }): Record<string, string>;
const env: { string(k, fallback?); number(k, fallback?); boolean(k, fallback?); require(k): string };
// client auto-loads .env on start(); disable/configure via the dotenv option
```

### Cooldowns — [guide](./cooldown.md)

```ts
interface CooldownConfig { duration: number; scope?: "user" | "guild" | "channel" | "global"; exempt?: { users?: string[]; roles?: string[] }; overrides?: { users?: Record<string, number>; roles?: Record<string, number> }; message?: string | ((remainingMs: number) => string); }
class CooldownManager { consume(bucket, input, actor, now?); peek(...); reset(...); clear(); }
// command({ cooldown: number | CooldownConfig }); new SpearClient({ cooldown }); client.cooldowns
```

### Scheduled tasks — [guide](./scheduler.md)

```ts
function task(config: { name: string; cron?: string; interval?: number; runOnStart?: boolean; run: (client: SpearClient) => Awaitable<void> }): ScheduledTask;
function cron(expression: string): CronExpression; // .next(from?: Date): Date
class TaskScheduler { add/remove/list/size/active/start/stop }
// client.register(task(...)); client.schedule(config); client.scheduler
```

### Prefix commands — [guide](./prefix.md)

```ts
function prefixCommand(config: { name: string; aliases?: string[]; description?: string; cooldown?: CooldownInput; run: (ctx: PrefixContext) => Awaitable<R> }): PrefixCommand;
class PrefixContext { message; commandName; args: string[]; rest: string; reply(content); send(content); }
// new SpearClient({ prefix: "!" | string[] | { prefix, mention?, ignoreBots?, caseInsensitive? } }); client.prefix
// reading others' content needs the privileged MessageContent intent (Intents.messages)
```

### Usage tracking — [guide](./usage.md)

```ts
interface UsageEvent { type: "command" | "prefix" | "component" | "event"; name: string; userId?; userTag?; guildId?; channelId?; detail?; timestamp: Date; }
interface UsageStore { record(event): Awaitable<void>; all(): Awaitable<readonly UsageEvent[]>; }
class MemoryUsageStore { record; all; size; byUser(id); clear; }
class JsonFileUsageStore { constructor(path: string); record; all; }
class UsageTracker { setStore(store); reportTo(channelId, format?); track(event); store; enabled; }
// new SpearClient({ usage: { store?, channel?, format? } }); client.usage
```

---

## Added in 0.3

Driven by patterns repeated across long-running production bots: the role/
permission checks, `.catch(() => null)` fetches, embed factories, pagination
/confirm flows, mention/duration parsing, locks, config loaders and pluggable
log/usage transports a real Discord bot ends up writing.

### Embeds — preset replies

```ts
class Embeds { error(input); success(input); info(input); warn(input); build(level, input); }
function createEmbeds(opts?): Embeds; // alias for new Embeds(opts)
// SpearClient owns one as `client.embeds`; configure via the `embeds` option.
// BaseContext gains ctx.success/info/warn/error (state-aware send) + replySuccess/replyInfo/replyWarn/replyError.
```

### Guards — declarative preconditions

```ts
type Guard<TCtx extends GuardContext = GuardContext> = (ctx: TCtx) => Awaitable<GuardResult>;
function denied(reason?: string): GuardResult;
function guildOnly(reason?: string): Guard;
function dmOnly(reason?: string): Guard;
function requireAnyRole(roleIds: readonly string[], reason?: string): Guard;
function requireAllRoles(roleIds: readonly string[], reason?: string): Guard;
function requireOwner(ownerIds: readonly string[], reason?: string): Guard;
function requireUserPermissions(permission: PermissionResolvable, reason?: string): Guard;
function requireBotPermissions(permission: PermissionResolvable, reason?: string): Guard;
function guard<TCtx>(predicate: Guard<TCtx>): Guard<TCtx>;
// per-handler: command({ guards: [...] }), prefixCommand({ guards }), button({ guards }), userCommand({ guards }), ...
// client-wide: new SpearClient({ guards: [...] })
```

### Context-menu commands

```ts
function userCommand({ name, run: (ctx: UserContextMenuContext) => Awaitable<R>, guards?, cooldown? }): UserContextMenu;
function messageCommand({ name, run: (ctx: MessageContextMenuContext) => Awaitable<R>, guards?, cooldown? }): MessageContextMenu;
// SpearClient.deployAllCommands deploys slash + context menus in one PUT.
```

### Prefix typed arguments

```ts
function prefixArgs(): PrefixArgsBuilder<{}>;
// builder methods: .string/.integer/.number/.boolean/.snowflake/.duration/.rest
// prefixCommand<TArgs>({ args: a => a.snowflake("target").duration("dur").rest("reason"), run: ctx => ctx.options }))
```

### Pagination + Confirmation

```ts
function paginate<T>(interaction, items, { pageSize, render, user?, timeoutMs?, controls?, ephemeral? }): Promise<void>;
function buildPaginatorPage<T>(items, page, options): Promise<{ payload; pages }>;
function confirm(interaction, { title?, body, confirm?, cancel?, user?, timeoutMs?, ephemeral? }): Promise<{ confirmed, reason, interaction? }>;
```

### Primitives

```ts
class KeyedLock { tryAcquire(key, ttl?); run(key, fn, { onBusy?, ttl? }); isHeld(key); forget(key); dispose(); }
const safeFetch = { member, channel, message, user, guild, role, try }; // each returns T | null
function withSafeTimeout<T>(p: Promise<T>, ms): Promise<T | null>;
function formatDuration(ms, { locale?: "en" | "tr" | UnitLabels; largest?; units? }): string;
function parseDuration(input: string): number | null;
function discordTimestamp(date, style?: "t"|"T"|"d"|"D"|"f"|"F"|"R"): string;
function relativeTimestamp(date): string;
interface CacheStore { get; set; delete; has; increment; rateLimit; clear; }
class MemoryCache implements CacheStore { /* TTL, counter, fixed-window rate limit */ }
function loadConfig<T>({ file, parser?, schema?, encoding? }): T;
function loadConfigAsync<T>(opts): Promise<T>;
function lookup<K, V>(table, resourceName?): (key: K) => V;
```

### Logger transports

```ts
new Logger({ level, transports: [consoleSink, jsonlSink("./logs/bot.jsonl"), webhookSink({ url, minLevel: "error" })] });
function jsonlSink(path: string, { minLevel? }?): LogSink;
function webhookSink({ url, minLevel?, username? }): LogSink;
// Logger.addTransport(sink), setTransports([sinks])
```

### Scheduler — one-shot + reconcile

```ts
client.scheduler.delay(name, ms, fn) -> { cancel(): boolean };
client.scheduler.followUp(name, [10_000, 30_000, 60_000], (i) => ...) -> { cancel(): boolean };
client.scheduler.reconcile("voice-sessions", async (client) => { /* once on ready */ });
```

### Deploy diff + dry run

```ts
client.deployAllCommands({ guildId, dryRun: true });            // returns { skipped, body, reason: "dry-run" }
client.deployAllCommands({ guildId, strategy: "diff" });        // skips PUT when remote matches
client.deployAllCommands({ applicationId: "...", strategy: "diff" }); // explicit app id, no ready required
```

### Usage outcome + duration

```ts
interface UsageEvent {
  type; name; userId; userTag; guildId; channelId; detail?;
  outcome?: "success" | "error";
  durationMs?: number;
  errorMessage?: string;
  options?: Record<string, string | number | boolean | null>;
  timestamp: Date;
}
```