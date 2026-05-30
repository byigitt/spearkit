# Pagination

`paginate(interaction, items, options)` sends an item list across prev/next
button-controlled embeds, with a user-only filter and timeout-disable. See the
[API reference](../../docs/api-reference.md#pagination--confirmation).

- [`basic.ts`](./basic.ts) — a `/users` command that paginates the guild's
  members, 10 per page, with the buttons disabled after 5 minutes.
