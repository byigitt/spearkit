# Environment & dotenv

spearkit includes a tiny, dependency-free `.env` loader and a typed reader over
`process.env`, so a bot needs no extra dotenv dependency. The client auto-loads
`.env` on `start()`, and the same helpers are exported for your own use.

## Loading a `.env` file

`loadEnv(options?)` reads a `.env` file and merges it into `process.env`. By
default it reads `.env` from the current working directory. Variables already
present in `process.env` win unless you pass `override: true`. A missing file is
ignored — it simply returns `{}` — so it is safe to call unconditionally.

```ts
import { loadEnv } from "spearkit";

const parsed = loadEnv();                       // reads ./.env
loadEnv({ path: ".env.local" });                // a different file
loadEnv({ override: true });                    // let the file win over existing vars
```

`loadEnv` returns the parsed key/value pairs it read from the file:

```ts
import { loadEnv } from "spearkit";

const parsed = loadEnv(); // ParsedEnv = Record<string, string>
console.log(Object.keys(parsed));
```

## Parsing without touching `process.env`

`parseEnv(text)` parses `.env`-formatted text into a flat object and never
mutates `process.env`. It understands single/double quotes, a leading `export `,
`#` comments, and `\n`/`\r`/`\t` escapes inside double quotes.

```ts
import { parseEnv } from "spearkit";

const vars = parseEnv(`
# a comment
export TOKEN="abc#notacomment"
GREETING="line one\nline two"
RAW='no $escapes here'
`);

vars.TOKEN;    // "abc#notacomment"
vars.GREETING; // "line one\nline two" (real newline)
vars.RAW;      // "no $escapes here"
```

## The typed `env` reader

`env` reads from `process.env` with coercion and optional fallbacks. Empty
strings count as missing.

```ts
import { env } from "spearkit";

env.string("REGION");            // string | undefined
env.string("REGION", "eu");      // string (fallback when missing)

env.number("PORT");              // number | undefined
env.number("PORT", 3000);        // number (fallback when missing or non-numeric)

env.boolean("DEBUG");            // boolean | undefined
env.boolean("DEBUG", false);     // boolean

env.require("DISCORD_TOKEN");    // string, throws if missing or empty
```

`env.boolean` treats `true`/`1`/`yes`/`on` as `true` and `false`/`0`/`no`/`off`
as `false` (case-insensitive); anything else yields the fallback. `env.require`
throws a descriptive error when the variable is missing or empty — use it for
values your bot cannot run without.

```ts
import { loadEnv, env } from "spearkit";

loadEnv();
const token = env.require("DISCORD_TOKEN"); // guaranteed string
const port = env.number("PORT", 8080);      // number
const verbose = env.boolean("VERBOSE", false);
```

## Auto-loading on the client

`SpearClient` calls `loadEnv()` for you inside `client.start()`, so `.env` is
picked up before login. That means `await client.start()` finds
`DISCORD_TOKEN` from `.env` without any extra wiring:

```ts
import { SpearClient } from "spearkit";

const client = new SpearClient();

async function main(): Promise<void> {
  await client.start(); // loads .env, then reads DISCORD_TOKEN
}

void main();
```

### The `dotenv` option

Control the auto-load with the `dotenv` construction option:

```ts
import { SpearClient } from "spearkit";

// Default: load ./.env on start.
new SpearClient({ dotenv: true });

// Disable auto-loading entirely (e.g. env is provided by the platform).
new SpearClient({ dotenv: false });

// Customize: same shape as loadEnv's options.
new SpearClient({ dotenv: { path: ".env.production", override: true } });
```

| `dotenv` value | Effect |
| -------------- | ------ |
| `true` / omitted | Load `.env` from the cwd on `start()`. |
| `false` | Skip auto-loading; `process.env` is used as-is. |
| `{ path?, override? }` | Load with those `loadEnv` options. |

## See also

- [Client](./client.md) — the `dotenv` and other construction options.
- [Logging](./logging.md) — structured logging that pairs with `env`-driven config.
