---
title: "storage"
description: "storage in the spearkit API."
---

## Classes

| Class | Description |
| :------ | :------ |
| [JsonStore](classes/JsonStore) | File-backed [KeyValueStore](interfaces/KeyValueStore) persisting the whole map as one JSON object. Reads are served from an in-memory cache (loaded once, lazily); writes are serialised through a queue and committed atomically (temp file + rename) so a crash mid-write can never corrupt the file. |
| [MemoryCache](classes/MemoryCache) | In-memory implementation of [CacheStore](interfaces/CacheStore). Lazy TTL expiration. |
| [MemoryStore](classes/MemoryStore) | In-memory [KeyValueStore](interfaces/KeyValueStore). Values are deep-cloned on read and write so callers can't accidentally mutate stored state — matching what a persistent backend would do. Ideal for tests and ephemeral data. |
| [RedisStore](classes/RedisStore) | A minimal async key-value store. Values must be JSON-serialisable. All backends share these semantics so you can develop against [MemoryStore](classes/MemoryStore) and ship with [JsonStore](classes/JsonStore) (or your own) without code changes. |
| [SqliteStore](classes/SqliteStore) | File- or memory-backed [KeyValueStore](interfaces/KeyValueStore) over `node:sqlite`. |

## Interfaces

| Interface | Description |
| :------ | :------ |
| [CacheSetOptions](interfaces/CacheSetOptions) | Options accepted by every write helper. |
| [CacheStore](interfaces/CacheStore) | A swappable cache backend. All operations are async to allow remote stores. |
| [CreateSettingsOptions](interfaces/CreateSettingsOptions) | Options for [createSettings](functions/createSettings). |
| [KeyValueStore](interfaces/KeyValueStore) | A minimal async key-value store. Values must be JSON-serialisable. All backends share these semantics so you can develop against [MemoryStore](classes/MemoryStore) and ship with [JsonStore](classes/JsonStore) (or your own) without code changes. |
| [LoadConfigOptions](interfaces/LoadConfigOptions) | Options accepted by [loadConfig](functions/loadConfig) / [loadConfigAsync](functions/loadConfigAsync). |
| [RateLimitResult](interfaces/RateLimitResult) | Result of a fixed-window [CacheStore.rateLimit](interfaces/CacheStore#ratelimit) hit. |
| [RedisCommands](interfaces/RedisCommands) | Minimal Redis commands used by [RedisStore](classes/RedisStore) and redisCooldownBackend. Compatible with node-redis: |
| [RedisSetOptions](interfaces/RedisSetOptions) | Options accepted by [RedisCommands.set](interfaces/RedisCommands#set) for NX/PX writes. |
| [RedisStoreOptions](interfaces/RedisStoreOptions) | Options for [RedisStore](classes/RedisStore). |
| [SettingsManager](interfaces/SettingsManager) | A typed settings accessor returned by [createSettings](functions/createSettings). |
| [SqliteStoreOptions](interfaces/SqliteStoreOptions) | Options for [SqliteStore](classes/SqliteStore). |

## Functions

| Function | Description |
| :------ | :------ |
| [createCache](functions/createCache) | Convenience factory: returns a default in-memory [CacheStore](interfaces/CacheStore). |
| [createSettings](functions/createSettings) | Build a typed, defaults-merged settings accessor over a [KeyValueStore](interfaces/KeyValueStore). `get` always returns a complete object (stored overrides on top of defaults), and `set` only persists the overrides — so widening `defaults` later is safe. |
| [loadConfig](functions/loadConfig) | Synchronously read + parse + (optionally) validate a config file. |
| [loadConfigAsync](functions/loadConfigAsync) | Asynchronous variant of [loadConfig](functions/loadConfig). |
| [lookup](functions/lookup) | Build a typed lookup over a `Record<key, value>` table. Throws on missing keys so config typos surface at startup, not at use. |
| [lookupOptional](functions/lookupOptional) | Build a non-throwing lookup that returns `undefined` for missing keys. |
| [namespaced](functions/namespaced) | Wrap a store so every key is transparently prefixed with `${prefix}:`. Lets several features share one backing file without key collisions. |
