# Client

`SpearClient` is a discord.js `Client` with command, event and component
registries — plus interaction routing — wired up for you. You construct it the
same way you construct a discord.js client, register your handlers, log in, and
(optionally) push your slash commands to Discord.

```ts
import { SpearClient, Intents } from "spearkit";

const client = new SpearClient({ intents: Intents.default });
```

## Constructing a client

`new SpearClient(options?)` takes the same options as discord.js'
`ClientOptions`, except `intents` may be omitted: it defaults to
`Intents.default` (just the `Guilds` intent, enough for slash commands and
interactions).

```ts
import { SpearClient, Intents } from "spearkit";

// Explicit preset.
const a = new SpearClient({ intents: Intents.messages });

// Omitted — falls back to Intents.default.
const b = new SpearClient();
```

The options type is exported as `SpearClientOptions` (`Partial<ClientOptions>`),
so every other discord.js option (`partials`, `presence`, `sweepers`, …) is
available.

### Intents presets

`Intents` is a set of ready-made arrays of `GatewayIntentBits`. Pass one as
`intents`, or compose your own array of `GatewayIntentBits` if you need
something in between.

| Preset | Contents |
| ------ | -------- |
| `Intents.none` | `[]` |
| `Intents.default` | `[Guilds]` |
| `Intents.guilds` | `[Guilds, GuildMembers]` |
| `Intents.messages` | `[Guilds, GuildMessages, MessageContent]` |
| `Intents.all` | Every intent, including privileged ones. |

`Intents.messages` includes `MessageContent`, and `Intents.guilds` includes
`GuildMembers` — both are **privileged intents**. You must enable them in the
Discord developer portal for your application, otherwise the gateway will reject
the connection. `Intents.all` includes every privileged intent for the same
reason.

```ts
import { SpearClient, GatewayIntentBits } from "spearkit";

// A custom intent set, mixing a preset idea with explicit bits.
const client = new SpearClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
```

## The three registries

Every client owns three registries, each populated by `register` (or `load`):

| Registry | Property | Holds |
| -------- | -------- | ----- |
| `CommandRegistry` | `client.commands` | Slash commands; dispatches chat-input and autocomplete interactions. |
| `EventRegistry` | `client.events` | Event listeners; attached to the client automatically. |
| `ComponentRegistry` | `client.components` | Buttons, selects and modals; routes component interactions by custom id. |

You rarely touch them directly — `register` routes items into the right one —
but they are public if you need to inspect or manipulate them (e.g.
`client.commands.size`, `client.commands.toJSON()`).

## Registering handlers

`client.register(...items)` accepts commands, events and components in a single
call and routes each to its registry by kind. The accepted union is exported as
`Registerable` (`SlashCommand | EventDef | ComponentDef`). It returns the client
for chaining.

```ts
import { SpearClient, command, event, button, option } from "spearkit";

const client = new SpearClient();

const greet = command({
  name: "greet",
  description: "Greet someone",
  options: { who: option.user({ description: "Who", required: true }) },
  run: (ctx) => ctx.reply(`Hello ${ctx.options.who}!`), // who: User
});

const ready = event("clientReady", (c) => {
  console.log(`Logged in as ${c.user.tag}`); // c: Client<true>
});

const ping = button({
  id: "ping:{n}",
  label: "Ping",
  run: (ctx) => ctx.reply(`pong #${ctx.params.n}`), // n: string
});

// Commands, events and components in one call.
client.register(greet, ready, ping);
```

## Plugins

`client.use(...plugins)` installs one or more plugins, awaiting each plugin's
`setup`. It is async and returns the client.

```ts
import { SpearClient } from "spearkit";
import { statsPlugin } from "./plugins/stats.js";

const client = new SpearClient();
await client.use(statsPlugin);
```

See [Plugins](./plugins.md) for authoring `SpearPlugin`s.

## File-based loading

`client.load(dir, options?)` recursively imports a directory and registers every
command, event and component it exports. It returns the number of items
registered.

```ts
import { SpearClient } from "spearkit";

const client = new SpearClient();
const count = await client.load("./src/commands");
console.log(`Loaded ${count} handlers`);
```

See [File-based loading](./loading.md) for the layout and `LoadOptions`.

## Starting and deploying

`client.start(token?)` logs in. If you omit the token it falls back to the
`DISCORD_TOKEN` environment variable, and throws if neither is present.

```ts
import { SpearClient } from "spearkit";

const client = new SpearClient();

// Pass a token explicitly…
await client.start("your-token");

// …or set DISCORD_TOKEN and call start() with no argument.
await client.start();
```

`client.deployCommands({ guildId })` pushes the registered slash commands to
Discord using the client's own authenticated REST connection — there is no
separate token or application id to supply. Because it reads the application id
from the logged-in client, it **must run after the client is ready**. Pass a
`guildId` to deploy instantly to a single guild (ideal for development); omit it
to deploy globally.

```ts
import { SpearClient, Intents } from "spearkit";

const client = new SpearClient({ intents: Intents.default });
// …register commands…

await client.start(); // uses DISCORD_TOKEN

// Deploy once the client is ready.
client.once("clientReady", async () => {
  await client.deployCommands({ guildId: process.env.GUILD_ID });
});
```

## Everything discord.js still works

`SpearClient` extends discord.js `Client`, so the full client surface is
available unchanged. spearkit adds registries on top — it never hides what is
underneath:

```ts
import { SpearClient } from "spearkit";

const client = new SpearClient();

client.on("guildCreate", (guild) => console.log(`Joined ${guild.name}`));
client.ws.on("VOICE_SERVER_UPDATE", () => {});

await client.start();

console.log(client.application?.id); // application
console.log(client.user?.tag); // user
console.log(client.rest); // REST manager (used by deployCommands)

await client.destroy(); // graceful shutdown
```

## See also

- [Commands](./commands.md) — defining slash commands you register here.
- [Plugins](./plugins.md) — bundling features for `client.use`.
- [File-based loading](./loading.md) — populating the client from a directory.
