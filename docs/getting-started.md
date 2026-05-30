# Getting started

spearkit is **discord.js++**: it re-exports the entire discord.js surface and adds a
fully type-safe layer for events, slash commands and interactive components. This
page takes you from an empty folder to a running bot that responds to a slash
command.

## Install

spearkit sits alongside discord.js, so install both:

```bash
npm install spearkit discord.js
```

Everything in your code imports from `"spearkit"` — including the plain discord.js
symbols, which spearkit re-exports unchanged.

## Credentials you need

Create an application in the [Discord Developer Portal](https://discord.com/developers/applications)
and collect three values:

| Value | Where to find it | Used for |
| ----- | ---------------- | -------- |
| Bot token | Application → **Bot** → *Reset Token* | `client.start(token)` |
| Application id | Application → **General Information** → *Application ID* | command deployment (spearkit reads it from the client once ready) |
| Test guild id | Right-click your server in Discord (with Developer Mode on) → *Copy Server ID* | guild-scoped deploy |

Keep the token secret. The examples below read these from the environment
(`DISCORD_TOKEN`, `GUILD_ID`).

## Your first bot

```ts
import { SpearClient, Intents, command, option, event } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

const greet = command({
  name: "greet",
  description: "Greet someone",
  options: {
    who: option.user({ description: "Who to greet", required: true }),
  },
  run: (ctx) => ctx.reply(`Hello ${ctx.options.who}!`), // ctx.options.who: User
});

const ready = event("clientReady", (c) => console.log(`Online as ${c.user.tag}`));

client.register(greet, ready);

await client.start(process.env.DISCORD_TOKEN);
await client.deployCommands({ guildId: process.env.GUILD_ID });
```

What each step does:

1. **`new SpearClient({ intents })`** — a discord.js `Client` with command, event
   and component routing wired up. `Intents.default` is `[Guilds]`, enough for
   slash commands and interactions.
2. **`command({ ... })`** — defines a leaf slash command. Required options resolve
   to their value type (`who` is a `User`); optional options would resolve to
   `value | undefined`.
3. **`client.register(...)`** — routes each item to the matching registry
   (commands, events, components) by its kind.
4. **`client.start(token)`** — logs in. With no argument it falls back to the
   `DISCORD_TOKEN` environment variable.
5. **`client.deployCommands({ guildId })`** — pushes your command definitions to
   Discord over the client's own authenticated REST connection. Must run after the
   client is ready (i.e. after `start`).

### Guild vs global deploy

`deployCommands` takes an optional `guildId`:

- **Guild deploy** (`{ guildId }`) registers commands in a single server. Changes
  appear **instantly** — ideal while developing.
- **Global deploy** (omit `guildId`) registers commands across every server the
  bot is in. Propagation can take up to an hour.

```ts
await client.deployCommands({ guildId: process.env.GUILD_ID }); // instant, one guild
await client.deployCommands();                                  // global, slow to propagate
```

You only need to deploy when your command *definitions* change (names,
descriptions, options) — not on every restart.

## Suggested project layout

As a bot grows, give each command, event and component its own file:

```
my-bot/
  src/
    index.ts          # construct the client, register/load, start, deploy
    commands/
      greet.ts
      ping.ts
    events/
      ready.ts
    components/
      vote.ts
  package.json
  tsconfig.json
```

A module exports a command, event or component as a default or named export:

```ts
// src/commands/ping.ts
import { command } from "spearkit";

export default command({
  name: "ping",
  description: "Check that the bot is alive",
  run: (ctx) => ctx.reply(`Pong! ${ctx.client.ws.ping}ms`),
});
```

You can wire the pieces up explicitly with `register`, or let spearkit discover them
with `client.load` (see [File-based loading](./loading.md)).

## Running it

**With tsx** (run TypeScript directly, great for development):

```bash
npx tsx src/index.ts
```

**Compiled JavaScript** (for production):

```bash
npx tsc            # emit JS into dist/ per your tsconfig
node dist/index.js
```

Note that `client.load` imports **compiled JavaScript**, so if you use file-based
loading you must build before running the compiled output. Explicit `register`
calls work the same under `tsx` or `node`.

## See also

- [Client](./client.md) — `SpearClient`, intents, `register`, `start`, deployment.
- [Commands](./commands.md) — slash commands, subcommands, options, deployment.
