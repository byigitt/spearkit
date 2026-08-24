# Everyday helpers

Small utilities for the tasks every bot copies from Stack Overflow: invite
links, autocomplete lists, mention parsing, and long replies.

## Choices and autocomplete

```ts
import { choices, command, filterChoices, option } from "spearkit";

const fruit = ["apple", "apricot", "banana"];

command({
  name: "pick",
  description: "Pick a fruit",
  options: {
    fruit: option.string({
      description: "Fruit",
      required: true,
      autocomplete: (ctx) => ctx.suggest(fruit), // or return filterChoices(fruit, ctx.value)
    }),
    difficulty: option.string({
      description: "How hard",
      choices: choices({ Easy: "easy", Hard: "hard" }),
    }),
  },
  run: (ctx) => ctx.reply(ctx.options.fruit),
});
```

`choices("red", "blue")` uses the same string for Discord's name and value.
`filterChoices` / `ctx.suggest` cap at 25 (Discord's autocomplete limit).

## Long replies, DMs, typing, progress

```ts
await ctx.sendLong(hugeLog);          // 2000-char chunks, follow-ups after the first
const dm = await ctx.dm("Secret");    // null if the user has DMs closed
await ctx.withTyping(async () => {
  await doSlowWork();
});
const progress = await ctx.progress("Working…");
await progress.update("Almost…");
await progress.done("Done.");
```

Prefix handlers get `sendLong`, `dm`, and `withTyping` as well.

## Invite URL

```ts
import { inviteUrl } from "spearkit";

inviteUrl({ clientId: "123", permissions: ["BanMembers"] });
// after ready:
client.inviteUrl({ permissions: ["BanMembers"] });
```

Default scopes are `bot` and `applications.commands`.

## Mentions

```ts
parseUserId("<@123>");           // "123"
parseRoleId("<@&123>");
parseChannelId("<#123>");
parseCustomEmoji("<a:wave:123>"); // { animated, name, id }
slashMention("play", "cmdId", "song"); // </play song:cmdId>
```

## Park a command

`command({ enabled: false, ... })` (also prefix / hybrid / context menus) stays
in source but is skipped by `client.register` and therefore not deployed.

## Bot owners

```ts
const client = new SpearClient({ owners: ["your-user-id"] });

command({
  name: "shutdown",
  description: "Stop the process",
  guards: [requireBotOwner()],
  run: (ctx) => ctx.reply("Bye."),
});
```

`requireBotOwner` also allows the Discord application owner. `requireOwner(["id"])`
still takes an explicit list.
