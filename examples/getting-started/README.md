# Getting started

The smallest useful spear bot: a client, two commands, an event, login, and a
guild command deploy.

- [`bot.ts`](./bot.ts) — construct `SpearClient`, register handlers, `start`, `deployCommands`.

```bash
DISCORD_TOKEN=... GUILD_ID=... npx tsx examples/getting-started/bot.ts
```

Next: [slash-commands](../slash-commands), [contexts-and-replies](../contexts-and-replies).
