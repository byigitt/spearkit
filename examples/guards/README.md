# Guards — declarative preconditions

Stop writing the same role/permission/guild-only checks at the top of every
handler. Attach a guard list to any command, component or prefix command and
spearkit will reply with a red error embed and skip the handler when one
denies. See the [API reference](../../docs/api-reference.md#guards--declarative-preconditions).

- [`basic.ts`](./basic.ts) — `guildOnly`, `requireUserPermissions`,
  `requireAnyRole`, custom inline guard.
- [`client-wide.ts`](./client-wide.ts) — a default guard set that runs before
  every handler in the client.
- [`owner-only.ts`](./owner-only.ts) — owner-only `eval` command pattern.
