# Deploy

Registering slash commands with Discord. Guild deploys are instant; global
deploys can take up to an hour. Deploy only when command definitions change.

- [`standalone.ts`](./standalone.ts) — a separate script using `CommandRegistry.deploy`.
- [`from-client.ts`](./from-client.ts) — `client.deployCommands` using the client's own REST.

```bash
DISCORD_TOKEN=... DISCORD_APP_ID=... GUILD_ID=... npx tsx examples/deploy/standalone.ts
```

See also: [getting-started](../getting-started), [slash-commands](../slash-commands).
