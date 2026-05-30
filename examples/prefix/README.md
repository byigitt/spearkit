# Prefix commands

Classic text commands like `!greet` alongside slash commands. Reading other
users' message content is privileged, so these examples use `Intents.messages`
(which includes the MessageContent intent) — and you must enable **Message
Content Intent** for your app in the Discord Developer Portal.

- [`basic.ts`](./basic.ts) — a `!greet <name>` command that replies using `ctx.args`.
- [`aliases-and-cooldown.ts`](./aliases-and-cooldown.ts) — a command with aliases and a per-user cooldown.

```bash
DISCORD_TOKEN=... npx tsx examples/prefix/basic.ts
```

See [docs/prefix.md](../../docs/prefix.md) for the full reference.
