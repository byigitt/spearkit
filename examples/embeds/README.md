# Embed preset replies

Configure the colors/icons once, then use `ctx.success/info/warn/error` for
state-aware sends that look the same everywhere. See the
[API reference](../../docs/api-reference.md#embeds--preset-replies).

- [`presets.ts`](./presets.ts) — `ctx.success/info/warn/error` after a command
  runs, plus the explicit `ctx.replySuccess` variants.
- [`custom-factory.ts`](./custom-factory.ts) — override colors/icons via the
  `embeds` client option, then use `client.embeds.error(...)` from anywhere.
