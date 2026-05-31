# Auto-defer

The single most common discord.js error is
`DiscordAPIError[10062]: Unknown interaction`. An interaction token is valid for
only **3 seconds** before your first response; any handler that awaits a database
query or an HTTP call risks blowing past that window, after which the interaction
is dead and every reply throws.

Auto-defer removes the footgun: spearkit arms a timer when your handler starts
and, if you haven't responded in time, calls `deferReply()` for you. The timer is
cancelled the instant your handler replies or defers itself.

## Per command

```ts
import { command, option } from "spearkit";

export const weather = command({
  name: "weather",
  description: "Look up the weather",
  autoDefer: true, // defers automatically if the handler takes too long
  options: { city: option.string({ description: "City", required: true }) },
  run: async (ctx) => {
    const report = await fetchWeather(ctx.options.city); // slow
    await ctx.send(`Weather in ${ctx.options.city}: ${report}`);
  },
});
```

> With auto-defer on, respond via `ctx.send(...)` or `ctx.editReply(...)`, not
> `ctx.reply(...)` — the initial reply slot may already be taken by the
> auto-defer. `ctx.send` is state-aware and always does the right thing.

## Options

`autoDefer` accepts `true` (defaults) or an object:

```ts
command({
  name: "report",
  description: "Generate a report",
  autoDefer: { ephemeral: true, delayMs: 1500 },
  run: async (ctx) => ctx.send("…"),
});
```

| Field | Default | Meaning |
| --- | --- | --- |
| `ephemeral` | `false` | Defer as a hidden ("thinking…") response. |
| `delayMs` | `2000` | How long to wait before the safety defer fires. Kept under the 3s cutoff. |

## Client-wide default

Apply auto-defer to **every** slash command and context menu; each handler can
still override with its own `autoDefer`.

```ts
import { SpearClient } from "spearkit";

const client = new SpearClient({ autoDefer: true });
```

## Scope

Auto-defer covers slash commands and context menus (answered with `deferReply`).
Component handlers (buttons/selects) usually respond instantly with `update`, so
they're not auto-deferred — call `ctx.deferUpdate()` yourself if a component
handler does slow work.

## Lower-level helpers

`normalizeAutoDefer(input)` resolves `true`/object/`undefined` into an
`AutoDeferConfig`; `armAutoDefer(interaction, config)` arms the timer and returns
a cancel function. Both are exported for custom dispatch.
