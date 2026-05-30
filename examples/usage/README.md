# Usage tracking

Record **who used what**. Every successful command, component, and
prefix-command use is auto-tracked into a store and/or mirrored to a Discord
channel — independent of the diagnostic logger.

- [`memory-store.ts`](./memory-store.ts) — track into a `MemoryUsageStore`, then query `client.usage.store`.
- [`channel-report.ts`](./channel-report.ts) — mirror each use into a Discord channel with a custom format.
- [`json-file-store.ts`](./json-file-store.ts) — durable newline-delimited JSON log with `JsonFileUsageStore`.

```bash
DISCORD_TOKEN=... npx tsx examples/usage/memory-store.ts
```

See [docs/usage.md](../../docs/usage.md) for the full reference.
