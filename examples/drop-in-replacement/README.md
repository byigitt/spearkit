# Drop-in replacement

spearkit re-exports all of discord.js. Migrate by changing `from "discord.js"` to
`from "spearkit"` — nothing else changes.

- [`classic-discordjs.ts`](./classic-discordjs.ts) — 100% classic discord.js code, imported from spearkit.

Then adopt spearkit's helpers incrementally: swap `new Client(...)` for
`new SpearClient(...)`, move commands to `command()`, components to `button()` /
`stringSelect()` / `modal()`, etc.

See also: [getting-started](../getting-started), [complete-bot](../complete-bot).
