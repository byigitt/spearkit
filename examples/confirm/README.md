# Confirmation prompts

`confirm(interaction, options)` shows a yes/no button prompt, waits for the
click, and resolves to `{ confirmed, reason, interaction? }`. See the
[API reference](../../docs/api-reference.md#pagination--confirmation).

- [`destructive.ts`](./destructive.ts) — a destructive action gated by a
  confirm prompt; the Confirm button is styled `Danger`.
