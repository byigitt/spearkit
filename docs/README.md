# spearkit documentation

**discord.js++** — a developer-experience-first layer over discord.js. spearkit
re-exports all of discord.js (so it's a drop-in replacement) and adds an
ergonomic, fully type-safe API for events, slash commands and interactive
components.

## Contents

1. [Getting started](./getting-started.md) — install, first bot, project layout.
2. [Client](./client.md) — `SpearClient`, intents, `register`, `start`, deployment.
3. [Commands](./commands.md) — slash commands, subcommands, permissions, deployment.
4. [Options](./options.md) — typed option builders, choices, autocomplete.
5. [Components](./components.md) — buttons, selects, modals, custom-id routing.
6. [Context menus](./context-menus.md) — user and message "Apps" commands.
7. [Events](./events.md) — the `event()` helper and the event registry.
8. [Contexts](./context.md) — reply helpers shared by every handler.
9. [Guards](./guards.md) — role/permission/owner/guild preconditions.
10. [Auto-defer](./auto-defer.md) — beat the 3-second `Unknown interaction` error.
11. [Permissions & hierarchy](./permissions.md) — moderation preflight checks.
12. [Discord API errors](./errors.md) — recognise and recover from `DiscordAPIError`.
13. [Cooldowns](./cooldown.md) — per-user/role/guild rate limiting.
14. [Scheduled tasks](./scheduler.md) — cron and interval jobs.
15. [Prefix commands](./prefix.md) — classic `!text` commands.
16. [Collectors](./collectors.md) — await messages, modals and component clicks.
17. [Key-value store & settings](./store.md) — persist per-guild config + dynamic prefix.
18. [Messages & limits](./messages.md) — split long output, truncate text.
19. [Logging](./logging.md) — structured, leveled, scoped logging.
20. [Usage tracking](./usage.md) — record who used what (store + Discord channel).
21. [Environment & dotenv](./env.md) — load `.env` and read typed env vars.
22. [Graceful shutdown](./shutdown.md) — close cleanly on `SIGINT`/`SIGTERM`.
23. [Plugins](./plugins.md) — bundling features into reusable units.
24. [File-based loading](./loading.md) — one file per command/event/component.
25. [Migrating from discord.js](./migration.md) — the drop-in path.
26. [API reference](./api-reference.md) — every exported symbol.

## Why spearkit

- **Drop-in.** `import { Client, EmbedBuilder } from "spearkit"` — every discord.js
  export is available, so you can migrate one file at a time.
- **Fully type-safe.** No `any` or `unknown` leaks into your handlers. Option
  values, custom-id params and modal fields are all inferred from your
  definitions.
- **Co-located.** A command's options and handler, a button's appearance and
  click logic, a modal's fields and submit logic — each lives in one place.
- **No boilerplate.** No `interactionCreate` switch statements; spearkit routes
  commands, autocomplete, buttons, selects and modals for you.

## Thirty-second tour

```ts
import { SpearClient, Intents, command, option, button, row, event } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

const greet = command({
  name: "greet",
  description: "Greet someone",
  options: { who: option.user({ description: "Who", required: true }) },
  run: (ctx) => ctx.reply(`Hello ${ctx.options.who}!`), // who: User
});

const ping = button({
  id: "ping:{n}",
  label: "Ping",
  run: (ctx) => ctx.update(`pong #${ctx.params.n}`), // n: string
});

client.register(greet, ping, event("clientReady", (c) => console.log(c.user.tag)));
await client.start(process.env.DISCORD_TOKEN);
await client.deployCommands({ guildId: process.env.GUILD_ID });
```
