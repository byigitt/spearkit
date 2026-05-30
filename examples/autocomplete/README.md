# Autocomplete

Suggest option values as the user types. Add an `autocomplete` handler to a
string/integer/number option; spear marks it autocompletable and routes the
request.

- [`basic.ts`](./basic.ts) — filter a static list (string and numeric).
- [`context-aware.ts`](./context-aware.ts) — use `ctx.value`, `ctx.guild`, etc.

See also: [options](../options).
