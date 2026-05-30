# Environment & dotenv

spearkit's built-in `.env` loader and typed `env` reader, plus the client's
auto-load on start.

- [`load-and-read.ts`](./load-and-read.ts) — `loadEnv()` then `env.require`/`env.number`/`env.boolean`.
- [`client-dotenv.ts`](./client-dotenv.ts) — the `dotenv` client option; `await client.start()` picks up `DISCORD_TOKEN`.

```bash
DISCORD_TOKEN=... npx tsx examples/env/client-dotenv.ts
```

See [docs/env.md](../../docs/env.md) for the full reference.
