---
title: "runtime"
description: "runtime in the spearkit API."
---

## Classes

| Class | Description |
| :------ | :------ |
| [BufferedUsageStore](classes/BufferedUsageStore) | Bounded, batched wrapper for high-volume usage telemetry. |
| [I18n](classes/I18n) | Runtime translator. Prefer [createI18n](functions/createI18n) to infer message keys. |
| [JsonFileUsageStore](classes/JsonFileUsageStore) | File-backed store using newline-delimited JSON (`.jsonl`). Appends one line per event — durable, human-inspectable, and dependency-free. |
| [Logger](classes/Logger) | A leveled, scoped logger. Create one directly or read `client.logger`. [child](classes/Logger#child) loggers share the parent's threshold and transports, so calling [setLevel](classes/Logger#setlevel) on any of them affects the whole tree. |
| [MemoryUsageStore](classes/MemoryUsageStore) | In-memory store; great for tests and dashboards. Optionally capped. |
| [UsageTracker](classes/UsageTracker) | Routes each [UsageEvent](interfaces/UsageEvent) to a store and/or a Discord channel. The client owns one as `client.usage`. Tracking is fire-and-forget: a slow store or channel never blocks command handling, and failures are logged. |

## Interfaces

| Interface | Description |
| :------ | :------ |
| [BatchUsageStore](interfaces/BatchUsageStore) | Optional bulk-write extension used by [BufferedUsageStore](classes/BufferedUsageStore). |
| [BufferedUsageStoreOptions](interfaces/BufferedUsageStoreOptions) | Options for [BufferedUsageStore](classes/BufferedUsageStore). |
| [DispatchHandlerErrorOptions](interfaces/DispatchHandlerErrorOptions) | - |
| [EnvReader](interfaces/EnvReader) | Typed, ergonomic reader over `process.env`. |
| [I18nOptions](interfaces/I18nOptions) | - |
| [LoadEnvOptions](interfaces/LoadEnvOptions) | Options for [loadEnv](functions/loadEnv). |
| [LocaleTarget](interfaces/LocaleTarget) | Actor/location data supplied to an async locale resolver. |
| [LogEntry](interfaces/LogEntry) | A fully-resolved record handed to a [LogSink](type-aliases/LogSink). |
| [LoggerOptions](interfaces/LoggerOptions) | Construction options for a [Logger](classes/Logger). |
| [LogOptions](interfaces/LogOptions) | Extra context passed alongside a log message. |
| [UsageEvent](interfaces/UsageEvent) | A single recorded use. |
| [UsageOptions](interfaces/UsageOptions) | Client-level usage configuration (the `usage` option). |
| [UsageStore](interfaces/UsageStore) | A pluggable persistence backend for [UsageEvent](interfaces/UsageEvent)s. |

## Type Aliases

| Type Alias | Description |
| :------ | :------ |
| [HandlerErrorEvent](type-aliases/HandlerErrorEvent) | Error details passed to `SpearClient({ onHandlerError })`. |
| [HandlerErrorHandler](type-aliases/HandlerErrorHandler) | Return a string to override the user-facing message, `false` to suppress a response, or nothing to use spearkit's safe default. |
| [InteractionHandlerSource](type-aliases/InteractionHandlerSource) | - |
| [LocaleResolver](type-aliases/LocaleResolver) | - |
| [LogLevel](type-aliases/LogLevel) | Severity of a log entry, lowest to highest. |
| [LogSink](type-aliases/LogSink) | Receives every entry at or above the configured threshold. |
| [LogThreshold](type-aliases/LogThreshold) | A minimum severity to emit, or `"silent"` to suppress everything. |
| [LogValue](type-aliases/LogValue) | A primitive metadata value attached to a log entry. |
| [MessageKey](type-aliases/MessageKey) | - |
| [ParsedEnv](type-aliases/ParsedEnv) | The flat key/value map parsed from a `.env` file. |
| [TranslationCatalog](type-aliases/TranslationCatalog) | - |
| [TranslationMessages](type-aliases/TranslationMessages) | - |
| [TranslationParam](type-aliases/TranslationParam) | - |
| [TranslationParams](type-aliases/TranslationParams) | - |
| [TranslationValue](type-aliases/TranslationValue) | - |
| [UsageMetaValue](type-aliases/UsageMetaValue) | A primitive metadata value attached to a usage event. |
| [UsageOutcome](type-aliases/UsageOutcome) | Outcome of a tracked use — `"success"` if the handler returned without throwing. |
| [UsageType](type-aliases/UsageType) | What kind of interaction was used. |

## Variables

| Variable | Description |
| :------ | :------ |
| [env](variables/env) | Typed accessor over `process.env`. |

## Functions

| Function | Description |
| :------ | :------ |
| [consoleSink](functions/consoleSink) | Default sink: human-readable lines to the console (stderr for warn/error). |
| [createI18n](functions/createI18n) | Create an [I18n](classes/I18n) while inferring the union of catalog keys. |
| [formatUsage](functions/formatUsage) | Default one-line rendering of a usage event for a Discord channel. |
| [jsonlSink](functions/jsonlSink) | JSON-lines sink: appends one JSON object per entry to `path`. Fire-and-forget; filesystem errors are swallowed so logging never crashes the bot. |
| [loadEnv](functions/loadEnv) | Read a `.env` file and merge it into `process.env`. Existing variables win unless `override` is set. Missing files are ignored (returns `{}`), so it is safe to call unconditionally. |
| [parseEnv](functions/parseEnv) | Parse `.env`-formatted text into a flat object. Does not touch `process.env`. |
| [toError](functions/toError) | Coerce an unknown thrown value into an Error. |
| [webhookSink](functions/webhookSink) | Discord-webhook sink: POSTs an embed to a webhook URL for entries at or above `minLevel` (default `"warn"`). Useful for sending errors to a private `#bot-errors` channel. |
