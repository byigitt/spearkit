---
title: "SpearClient"
description: "A discord.js Client with batteries included: command, event, component, prefix-command, scheduler and context-menu registries plus interaction routing wired up automatically."
---

Defined in: [src/client.ts:138](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L138)

## Example

```ts
const client = new SpearClient({ intents: Intents.default });
client.register(ping, onReady, voteButton);
await client.start(process.env.TOKEN);
await client.deployAllCommands({ guildId: "123" });
```

## Extends

- `Client`

## Constructors

### Constructor

```ts
new SpearClient(options?: SpearClientOptions): SpearClient;
```

Defined in: [src/client.ts:165](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L165)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`SpearClientOptions`](../type-aliases/SpearClientOptions) |

#### Returns

`SpearClient`

#### Overrides

```ts
Client.constructor
```

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-commands"></a> `commands` | `readonly` | [`CommandRegistry`](../../commands/classes/CommandRegistry) | Slash command registry and dispatcher. |
| <a id="property-components"></a> `components` | `readonly` | [`ComponentRegistry`](../../components/classes/ComponentRegistry) | Button / select / modal registry and router. |
| <a id="property-contextmenus"></a> `contextMenus` | `readonly` | [`ContextMenuRegistry`](../../commands/classes/ContextMenuRegistry) | User- and message-context-menu command registry. |
| <a id="property-cooldowns"></a> `cooldowns` | `readonly` | [`CooldownManager`](../../cooldowns-and-scaling/classes/CooldownManager) | Shared cooldown manager used by command dispatch; also usable directly. |
| <a id="property-embeds"></a> `embeds` | `readonly` | [`Embeds`](../../contexts/classes/Embeds) | Preset embed factory used by `ctx.error/success/info/warn` and available to your code. |
| <a id="property-events"></a> `events` | `readonly` | [`EventRegistry`](../../events-and-tasks/classes/EventRegistry) | Event listener registry. |
| <a id="property-i18n"></a> `i18n?` | `readonly` | [`I18n`](../../runtime/classes/I18n)\<`string`\> | Configured runtime translations, if enabled. |
| <a id="property-logger"></a> `logger` | `readonly` | [`Logger`](../../runtime/classes/Logger) | Structured logger shared across spearkit and available to your code. |
| <a id="property-owners"></a> `owners` | `readonly` | readonly `string`[] | User ids treated as bot owners by requireBotOwner. |
| <a id="property-prefix"></a> `prefix` | `readonly` | [`PrefixRegistry`](../../prefix-commands/classes/PrefixRegistry) | Prefix (text) command registry, dispatched from `messageCreate`. |
| <a id="property-scheduler"></a> `scheduler` | `readonly` | [`TaskScheduler`](../../events-and-tasks/classes/TaskScheduler) | Cron/interval task scheduler; started on ready and stopped on destroy. |
| <a id="property-usage"></a> `usage` | `readonly` | [`UsageTracker`](../../runtime/classes/UsageTracker) | Usage tracker: records who used what to a store and/or a Discord channel. |

## Methods

### deployAllCommands()

```ts
deployAllCommands(options?: object): Promise<
  | DeployResult
  | {
  body: readonly unknown[];
  reason: "dry-run" | "no-changes";
  skipped: true;
}>;
```

Defined in: [src/client.ts:365](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L365)

Deploy slash commands AND context menus together. Supports a `diff`
strategy that fetches the remote set first and skips the PUT when
nothing changed, and a `dryRun` flag that returns the body without
touching Discord (perfect for CI deploy gates).

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | \{ `applicationId?`: `string`; `dryRun?`: `boolean`; `guildId?`: `string`; `strategy?`: `"always"` \| `"diff"`; \} | - |
| `options.applicationId?` | `string` | Override the application id (default reads from the ready client). |
| `options.dryRun?` | `boolean` | - |
| `options.guildId?` | `string` | - |
| `options.strategy?` | `"always"` \| `"diff"` | - |

#### Returns

`Promise`\<
  \| [`DeployResult`](../../commands/type-aliases/DeployResult)
  \| \{
  `body`: readonly `unknown`[];
  `reason`: `"dry-run"` \| `"no-changes"`;
  `skipped`: `true`;
\}\>

the API's DeployResult on PUT, or a skipped report when
`dryRun: true` is set OR `strategy: "diff"` finds no changes.

***

### deployCommands()

```ts
deployCommands(options?: object): Promise<DeployResult>;
```

Defined in: [src/client.ts:344](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L344)

Push the registered slash commands to Discord using the client's REST
connection. Slash-only — use [deployAllCommands](#deployallcommands) to include context
menus in the same request.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `guildId?`: `string`; \} |
| `options.guildId?` | `string` |

#### Returns

`Promise`\<[`DeployResult`](../../commands/type-aliases/DeployResult)\>

***

### destroy()

```ts
destroy(): Promise<void>;
```

Defined in: [src/client.ts:401](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L401)

Stop the scheduler, then tear down the discord.js client.

#### Returns

`Promise`\<`void`\>

#### Overrides

```ts
Client.destroy
```

***

### enableGracefulShutdown()

```ts
enableGracefulShutdown(options?: GracefulShutdownOptions): () => void;
```

Defined in: [src/client.ts:411](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L411)

Close the bot cleanly on `SIGINT`/`SIGTERM`: run an optional hook, then
`destroy()` (stopping the scheduler and gateway), then exit. Returns a
disposer that removes the signal handlers. Logs progress via `client.logger`.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`GracefulShutdownOptions`](../../events-and-tasks/interfaces/GracefulShutdownOptions) |

#### Returns

() => `void`

***

### inviteUrl()

```ts
inviteUrl(options?: Omit<InviteUrlOptions, "clientId">): string;
```

Defined in: [src/client.ts:331](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L331)

OAuth2 invite URL for this application. Call after the client is ready
(needs the application / user id).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | `Omit`\<[`InviteUrlOptions`](../../utilities/interfaces/InviteUrlOptions), `"clientId"`\> |

#### Returns

`string`

***

### load()

```ts
load(dir: string, options?: LoadOptions): Promise<number>;
```

Defined in: [src/client.ts:309](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L309)

Recursively load a directory and register every command, event and
component it exports. Returns the number of items registered.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `dir` | `string` |
| `options?` | [`LoadOptions`](../interfaces/LoadOptions) |

#### Returns

`Promise`\<`number`\>

***

### register()

```ts
register(...items: Registerable[]): this;
```

Defined in: [src/client.ts:273](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L273)

Register commands, events, components, scheduled tasks, prefix commands
and context menus in one call. Each item is routed to its matching registry.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`items` | [`Registerable`](../type-aliases/Registerable)[] |

#### Returns

`this`

***

### schedule()

```ts
schedule(config: TaskConfig): ScheduledTask;
```

Defined in: [src/client.ts:394](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L394)

Define and register a scheduled task in one call.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`TaskConfig`](../../events-and-tasks/interfaces/TaskConfig) |

#### Returns

[`ScheduledTask`](../../events-and-tasks/interfaces/ScheduledTask)

***

### start()

```ts
start(token?: string): Promise<SpearClient>;
```

Defined in: [src/client.ts:317](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L317)

Log in. Falls back to the `DISCORD_TOKEN` environment variable when no
token is passed.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `token?` | `string` |

#### Returns

`Promise`\<`SpearClient`\>

***

### use()

```ts
use(...plugins: SpearPlugin[]): Promise<SpearClient>;
```

Defined in: [src/client.ts:298](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L298)

Install one or more plugins, running each plugin's `setup`.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`plugins` | [`SpearPlugin`](../interfaces/SpearPlugin)[] |

#### Returns

`Promise`\<`SpearClient`\>
