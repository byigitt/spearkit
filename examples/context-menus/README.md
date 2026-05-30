# Context-menu commands (Apps)

User-target ("Apps → user") and message-target ("Apps → message") commands as
first-class spearkit citizens. Cooldowns, guards and usage tracking compose
exactly like slash commands. Deploy with `client.deployAllCommands` to push
slash + context menus in a single REST PUT. See the
[API reference](../../docs/api-reference.md#context-menu-commands).

- [`user-menu.ts`](./user-menu.ts) — right-click a user → run a command.
- [`message-menu.ts`](./message-menu.ts) — right-click a message → run a command.
