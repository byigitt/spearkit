# Options

Type-safe option builders. Required options resolve to the value type; optional
ones to `value | undefined`; `choices` to a literal union.

- [`all-types.ts`](./all-types.ts) — every option type in one command.
- [`choices.ts`](./choices.ts) — choices narrowing to literal unions.
- [`constraints.ts`](./constraints.ts) — min/max, length, and channel-type filters.

See also: [autocomplete](../autocomplete), [slash-commands](../slash-commands).
