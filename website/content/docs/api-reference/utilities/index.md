---
title: "Utilities"
description: "Formatting, mentions, invites, choices, safe fetches, locks, and Discord errors."
---

## Classes

| Class | Description |
| :------ | :------ |
| [KeyedLock](classes/KeyedLock) | Acquire, release and run-while-locked operations keyed on an arbitrary string. |

## Interfaces

| Interface | Description |
| :------ | :------ |
| [ChunkOptions](interfaces/ChunkOptions) | Options for [chunkMessage](functions/chunkMessage). |
| [FilterChoicesOptions](interfaces/FilterChoicesOptions) | Options for [filterChoices](functions/filterChoices). |
| [FormatDurationOptions](interfaces/FormatDurationOptions) | Options for [formatDuration](functions/formatDuration). |
| [InviteUrlOptions](interfaces/InviteUrlOptions) | Options for [inviteUrl](functions/inviteUrl). |
| [KeyedLockOptions](interfaces/KeyedLockOptions) | Construction options for [KeyedLock](classes/KeyedLock). |
| [ParsedCustomEmoji](interfaces/ParsedCustomEmoji) | A custom emoji parsed from `<:name:id>` / `<a:name:id>`. |
| [SafeFetchOptions](interfaces/SafeFetchOptions) | Shared options for every safe-fetch helper. |

## Type Aliases

| Type Alias | Description |
| :------ | :------ |
| [DiscordErrorCodeValue](type-aliases/DiscordErrorCodeValue) | A numeric Discord JSON error code value. |
| [DiscordTimestampStyle](type-aliases/DiscordTimestampStyle) | Discord timestamp style: `t/T/d/D/f/F/R`. |
| [LockRelease](type-aliases/LockRelease) | Release a previously-acquired lease. Idempotent — safe to call multiple times. |

## Variables

| Variable | Description |
| :------ | :------ |
| [DiscordErrorCode](variables/DiscordErrorCode) | The Discord JSON error codes spearkit cares about most, by readable name. This is a curated subset of discord.js' RESTJSONErrorCodes covering the failures bots actually hit and can recover from. Values are the numeric codes Discord returns on `DiscordAPIError.code`. |
| [MESSAGE\_CHARACTER\_LIMIT](variables/MESSAGE_CHARACTER_LIMIT) | The hard cap Discord enforces on a single message's `content`. |
| [safeFetch](variables/safeFetch) | Cache-first, timeout-bounded fetch helpers grouped for ergonomic imports. |

## Functions

| Function | Description |
| :------ | :------ |
| [choices](functions/choices) | Build `{ name, value }` choices from a display→value map. |
| [chunkMessage](functions/chunkMessage) | Split `text` into chunks that each fit within Discord's per-message limit, breaking on line boundaries (and word boundaries for over-long lines) so you never silently lose the tail of a long reply. |
| [discordTimestamp](functions/discordTimestamp) | Render a Discord-flavoured timestamp tag (`<t:1234:R>`). |
| [explainDiscordError](functions/explainDiscordError) | Render an end-user-appropriate sentence for a Discord error, or `null` if the error isn't a recognised, explainable Discord failure (in which case you should fall back to a generic "something went wrong" message and log it). |
| [fetchChannel](functions/fetchChannel) | Resolve a channel by id from the client. Returns `null` on failure. |
| [fetchGuild](functions/fetchGuild) | Resolve a guild by id from the client. Returns `null` on failure. |
| [fetchMember](functions/fetchMember) | Resolve a guild member with a cache-hit fast path. Returns `null` on failure. |
| [fetchMessage](functions/fetchMessage) | Resolve a message id in a given channel's messages manager. |
| [fetchRole](functions/fetchRole) | Resolve a role id from a guild's roles manager. Returns `null` on failure. |
| [fetchUser](functions/fetchUser) | Resolve a user by id from the client. Returns `null` on failure. |
| [filterChoices](functions/filterChoices) | Filter a choice list by the user's current autocomplete query. |
| [formatDuration](functions/formatDuration) | Format a millisecond duration into human-readable text. |
| [inviteUrl](functions/inviteUrl) | Build a Discord OAuth2 invite URL. |
| [isDiscordError](functions/isDiscordError) | Narrow an unknown thrown value to a DiscordAPIError. Pass a `code` (or several) to also assert the specific failure — ideal for "ignore this one error, re-throw the rest" recovery. |
| [isHTTPError](functions/isHTTPError) | Narrow to a transport-level HTTPError (timeouts, 5xx, aborted requests) — failures with an HTTP status but no Discord JSON code. |
| [isRateLimitError](functions/isRateLimitError) | Whether the thrown value is a Discord rate-limit (HTTP 429) response. |
| [parseChannelId](functions/parseChannelId) | Channel mention (`<#id>`) or a bare snowflake. |
| [parseCustomEmoji](functions/parseCustomEmoji) | Parse a custom emoji mention. Unicode emoji returns `null`. |
| [parseDuration](functions/parseDuration) | Parse a human duration like `"1h30m"`, `"2 days"`, `"1 saat 30 dakika"` or `"5000ms"` into milliseconds. Returns `null` if nothing parseable was found. |
| [parseRoleId](functions/parseRoleId) | Role mention (`<@&id>`) or a bare snowflake. |
| [parseSnowflake](functions/parseSnowflake) | Extract a snowflake from raw digits, or `null`. |
| [parseUserId](functions/parseUserId) | User mention (`<@id>` / `<@!id>`) or a bare snowflake. |
| [relativeTimestamp](functions/relativeTimestamp) | Short-hand for the relative Discord timestamp (`R` style). |
| [safeTry](functions/safeTry) | Wrap an arbitrary best-effort operation so a failure resolves to `null` instead of throwing. Useful for sends/deletes whose outcome is non-critical. |
| [slashMention](functions/slashMention) | Chat-input command mention (`</name:id>`). Subcommands use a space: `</play song:123>`. |
| [truncate](functions/truncate) | Truncate `text` to at most `max` characters, appending `suffix` (default `…`) when it had to cut. The result — suffix included — never exceeds `max`. |
| [withSafeTimeout](functions/withSafeTimeout) | Time-bound an arbitrary promise; resolves to `null` on timeout or rejection. |
