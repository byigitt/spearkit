# File-based loading

Instead of importing and registering every handler by hand, you can keep one
handler per file and let spearkit discover them. The loader imports a directory,
inspects each module's exports, and registers everything that is a command,
event, component, scheduled task or prefix command.

## `client.load`

```ts
load(dir: string, options?: LoadOptions): Promise<number>
```

`client.load` imports `dir` and registers every spearkit-registrable export it finds,
resolving to the number of items registered.

```ts
import { fileURLToPath } from "node:url";
import { SpearClient, Intents } from "spearkit";

const here = fileURLToPath(new URL(".", import.meta.url));

const client = new SpearClient({ intents: Intents.default });

const loaded =
  (await client.load(`${here}commands`)) +
  (await client.load(`${here}events`)) +
  (await client.load(`${here}components`));
console.log(`Loaded ${loaded} modules.`);

await client.start(process.env.DISCORD_TOKEN);
await client.deployCommands({ guildId: process.env.GUILD_ID });
```

### What gets registered

For every imported file, spearkit walks **all** of its exports — default *and*
named — and registers each value that is a command (`command`, `commandGroup`),
an event (`event`), a component (`button`, `stringSelect`, `modal`, …), a
scheduled task (`task`) or a prefix command (`prefixCommand`). Other exports
(helpers, constants, types) are ignored, and context-menu commands are **not**
auto-detected — register those explicitly. So both of these are picked up:

```ts
// default export
export default command({ name: "ping", description: "…", run: (ctx) => ctx.reply("pong") });
```

```ts
// named export
export const vote = button({ id: "vote:{choice}", label: "Vote", run: (ctx) => ctx.update(ctx.params.choice) });
```

### Options

```ts
interface LoadOptions {
  extensions?: readonly string[]; // default: [".js", ".mjs", ".cjs"]
  recursive?: boolean;            // default: true
}
```

- **`extensions`** — which file extensions to import. By default the loader reads
  `.js`, `.mjs` and `.cjs` — i.e. **compiled JavaScript**, not `.ts` source.
- **`recursive`** — by default the loader descends into subdirectories. Pass
  `recursive: false` to load only the top level.

```ts
await client.load(`${here}features`, { recursive: false });
```

> The loader imports compiled JavaScript. **Build your TypeScript first**, then run
> (and load) the emitted output — `npx tsc && node dist/index.js`. Loading a
> directory of `.ts` source files will not match the default extensions.

## Standalone helpers

`client.load` is the method form of `loadInto`. Both helpers are exported if you
want to collect or register modules separately.

```ts
collectModules(dir: string, options?: LoadOptions): Promise<Registerable[]>
loadInto(client: SpearClient, dir: string, options?: LoadOptions): Promise<number>
```

- **`collectModules`** imports a directory and returns the registrable exports it
  found, without touching any client. Use it to inspect, filter, or combine
  modules before registering.
- **`loadInto`** calls `collectModules` and then `client.register(...)` for you,
  returning the count.

```ts
import { collectModules, loadInto } from "spearkit";

// Inspect before registering:
const items = await collectModules(`${here}commands`);
console.log(`Found ${items.length} modules`);
client.register(...items);

// Or do both in one step:
const count = await loadInto(client, `${here}events`);
```

## Example layout

The `examples/file-based-loading` project keeps each handler in its own file:

```
file-based-loading/
  index.ts            # construct client, load each folder, start, deploy
  commands/
    ping.ts           # export default command({ ... })
    echo.ts           # export default command({ ... })
  events/
    ready.ts          # export default event("clientReady", ...)
  components/
    vote.ts           # export const vote = button({ ... })
```

A command file looks like this:

```ts
// commands/echo.ts
import { command, option } from "spearkit";

export default command({
  name: "echo",
  description: "Repeat a message",
  options: {
    text: option.string({ description: "What to say", required: true }),
    loud: option.boolean({ description: "Shout it" }),
  },
  // text: string, loud: boolean | undefined
  run: (ctx) => ctx.reply(ctx.options.loud ? ctx.options.text.toUpperCase() : ctx.options.text),
});
```

Build the project, then run the compiled `index.js`; `client.load` will import the
emitted `.js` files and register `ping`, `echo`, `ready` and `vote` for you.

## See also

- [Client](./client.md) — `load`, `register`, and the registries the loader writes to.
- [Events](./events.md) — the `event()` helper that event modules export.
