# Logging

spearkit's leveled, scoped logger: a custom sink, child scopes, and using
`client.logger`.

- [`custom-sink.ts`](./custom-sink.ts) — a standalone `Logger` whose sink collects entries; child scopes and levels.
- [`client-logger.ts`](./client-logger.ts) — the `logger` client option and `client.logger` inside handlers.

```bash
DISCORD_TOKEN=... npx tsx examples/logging/client-logger.ts
```

See [docs/logging.md](../../docs/logging.md) for the full reference.
