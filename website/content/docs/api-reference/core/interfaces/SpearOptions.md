---
title: "SpearOptions"
description: "spearkit-specific client options layered on top of discord.js ClientOptions."
---

Defined in: [src/client.ts:74](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L74)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-autodefer"></a> `autoDefer?` | [`AutoDeferInput`](../../commands/type-aliases/AutoDeferInput) | Default auto-defer for every slash command and context menu (each handler may override). Prevents `Unknown interaction` (10062) on slow handlers by deferring automatically just before Discord's 3-second window closes. |
| <a id="property-cooldown"></a> `cooldown?` | [`CooldownInput`](../../cooldowns-and-scaling/type-aliases/CooldownInput) | A default cooldown applied to every command. A command's own cooldown overrides it. |
| <a id="property-cooldownstore"></a> `cooldownStore?` | [`CooldownStoreInput`](../../cooldowns-and-scaling/type-aliases/CooldownStoreInput) | Persist cooldowns across restarts/shards. A CooldownBackend or any KeyValueStore (SQLite, Redis, JSON). |
| <a id="property-dotenv"></a> `dotenv?` | \| `boolean` \| [`LoadEnvOptions`](../../runtime/interfaces/LoadEnvOptions) | Auto-load a `.env` file into `process.env` on [SpearClient.start](../classes/SpearClient#start). `true` (default) loads `.env` from the cwd; pass [LoadEnvOptions](../../runtime/interfaces/LoadEnvOptions) for a custom path or override behaviour, or `false` to disable. |
| <a id="property-embeds"></a> `embeds?` | \| [`EmbedsOptions`](../../contexts/interfaces/EmbedsOptions) \| [`Embeds`](../../contexts/classes/Embeds) | Default [Embeds](../../contexts/classes/Embeds) factory for preset replies. Pass an instance or options. |
| <a id="property-guards"></a> `guards?` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | Default guards (preconditions) applied before every command/component/prefix handler. |
| <a id="property-i18n"></a> `i18n?` | \| [`I18nOptions`](../../runtime/interfaces/I18nOptions)\<`Readonly`\<`Record`\<`string`, `Readonly`\<`Record`\<`string`, [`TranslationValue`](../../runtime/type-aliases/TranslationValue)\>\>\>\>\> \| [`I18n`](../../runtime/classes/I18n)\<`string`\> | Runtime translations exposed as `client.i18n` and `ctx.t(...)`. |
| <a id="property-logger"></a> `logger?` | \| [`LoggerOptions`](../../runtime/interfaces/LoggerOptions) \| [`Logger`](../../runtime/classes/Logger) | A [Logger](../../runtime/classes/Logger) instance, or options to build one. Exposed as `client.logger`. |
| <a id="property-onhandlererror"></a> `onHandlerError?` | [`HandlerErrorHandler`](../../runtime/type-aliases/HandlerErrorHandler) | Observe every routed handler failure. Return a string to override the safe user-facing reply or `false` to suppress it. |
| <a id="property-owners"></a> `owners?` | readonly `string`[] | Bot-owner user ids used by requireBotOwner. Also readable as `client.owners`. |
| <a id="property-prefix"></a> `prefix?` | \| `string` \| readonly `string`[] \| [`PrefixOptions`](../../prefix-commands/interfaces/PrefixOptions) | Enable prefix (text) commands. A string/array sets prefixes; an object configures matching. |
| <a id="property-usage"></a> `usage?` | [`UsageOptions`](../../runtime/interfaces/UsageOptions) | Track command/component/prefix usage to a store and/or a Discord channel. |
