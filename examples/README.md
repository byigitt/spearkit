# spearkit examples

Each folder demonstrates one topic. Every `.ts` file imports from `"spearkit"`; in
this repo that resolves to the source (via the tsconfig path mapping), so all
examples type-check against the real API. In your own project, `npm install
spearkit discord.js` and the same imports work unchanged.

## Folders

| Folder | Shows |
| ------ | ----- |
| [`getting-started/`](./getting-started) | The smallest useful bot. |
| [`slash-commands/`](./slash-commands) | Commands, options, subcommands, permissions. |
| [`options/`](./options) | Every option type, choices, constraints. |
| [`autocomplete/`](./autocomplete) | Suggesting option values as the user types. |
| [`buttons/`](./buttons) | Buttons, typed custom-id params, link buttons. |
| [`select-menus/`](./select-menus) | String and entity (user/role/channel/mentionable) selects. |
| [`modals/`](./modals) | Text-input forms, opening modals from buttons. |
| [`events/`](./events) | Typed event listeners, `once`, error routing. |
| [`contexts-and-replies/`](./contexts-and-replies) | reply / defer / send / error helpers. |
| [`deploy/`](./deploy) | Registering commands (standalone and from the client). |
| [`plugins/`](./plugins) | Bundling features into reusable plugins. |
| [`file-based-loading/`](./file-based-loading) | One file per handler, loaded with `client.load()`. |
| [`cooldown/`](./cooldown) | Per-user/role/guild rate limiting. |
| [`scheduler/`](./scheduler) | Cron and interval scheduled tasks. |
| [`prefix/`](./prefix) | Classic `!text` prefix commands. |
| [`logging/`](./logging) | Structured, leveled, scoped logging. |
| [`usage/`](./usage) | Record who used what (store + Discord channel). |
| [`env/`](./env) | Load `.env` and read typed env vars. |
| [`embeds/`](./embeds) | Preset `error/success/info/warn` reply embeds. |
| [`guards/`](./guards) | Declarative role/permission/owner preconditions. |
| [`context-menus/`](./context-menus) | User and message context-menu commands. |
| [`prefix-args/`](./prefix-args) | Typed `ctx.options` for prefix commands. |
| [`pagination/`](./pagination) | Buttoned paginated embed lists. |
| [`confirm/`](./confirm) | Yes/no confirmation prompts. |
| [`auto-defer/`](./auto-defer) | Beat the 3-second `Unknown interaction` (10062) error. |
| [`errors/`](./errors) | Recognise and recover from `DiscordAPIError`. |
| [`permissions/`](./permissions) | Moderation permission + role-hierarchy preflight. |
| [`store/`](./store) | Per-guild settings + dynamic prefix, persisted to JSON. |
| [`collectors/`](./collectors) | Await a reply or a modal submission inline. |
| [`text/`](./text) | Split long output to the 2000-char limit; truncate. |
| [`shutdown/`](./shutdown) | Close cleanly on `SIGINT`/`SIGTERM`. |
| [`drop-in-replacement/`](./drop-in-replacement) | Classic discord.js, imported from spearkit. |
| [`complete-bot/`](./complete-bot) | Everything wired into one client. |

## Running

These are TypeScript. Run directly with a TypeScript runner, or compile first:

```bash
# environment most examples expect
export DISCORD_TOKEN="your-bot-token"
export DISCORD_APP_ID="your-application-id"   # deploy/ and drop-in-replacement/
export GUILD_ID="a-test-guild-id"             # optional, for instant deploys

# run directly
npx tsx examples/getting-started/bot.ts

# or compile then run
npx tsc && node examples/getting-started/bot.js
```

`file-based-loading` uses `client.load()`, which imports compiled JavaScript —
build it before running the compiled `index.js`.
