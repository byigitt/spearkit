# Cooldowns

Rate-limit commands per user, role, guild, channel or globally. See the
[cooldowns guide](../../docs/cooldown.md).

- [`basic.ts`](./basic.ts) — a bare `cooldown: 5000` (ms) per-user limit.
- [`roles-and-exempt.ts`](./roles-and-exempt.ts) — exempt a mod role, give a VIP role a shorter cooldown.
- [`global-default.ts`](./global-default.ts) — a client-wide default that commands can override.
