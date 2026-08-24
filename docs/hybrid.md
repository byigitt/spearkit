# Hybrid commands

One definition, two surfaces: a slash command (typed `options`) and a prefix
command (typed `args`) that share a handler. Use this when a bot still has `!`
users but you don't want two copies of the same logic.

Enable prefix dispatch on the client (`prefix: "!"`) and register the hybrid
once — `client.register(ping)` adds both halves.

```ts
import { Intents, SpearClient, hybridCommand, option } from "spearkit";

const client = new SpearClient({ intents: Intents.messages, prefix: "!" });

const ping = hybridCommand({
  name: "echo",
  description: "Repeat text",
  options: { text: option.string({ description: "What to echo", required: true }) },
  args: (a) => a.string("text"),
  run: (ctx) => ctx.reply(`${ctx.options.text} (${ctx.kind})`),
});

client.register(ping);
```

`ctx.kind` is `"slash"` or `"prefix"`. `ctx.options` is the slash option map on
slash runs and the parsed args on prefix runs. Matching names on both schemas
lets one `run` serve both; branch on `ctx.kind` when the surfaces must differ.

`install` / `contexts` / `guildOnly` apply to the slash half. Prefix still needs
the `MessageContent` intent (`Intents.messages`) to read other users' messages.
