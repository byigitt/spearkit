# Prefix typed args

Declare a positional argument schema once and receive a typed `ctx.options`
just like a slash command. Built-ins: `string`, `integer`, `number`,
`boolean`, `snowflake` (raw ids + mentions), `duration` (parses `"1h30m"` or
`"1 saat"`), and `rest` (everything left in the message). See the
[API reference](../../docs/api-reference.md#prefix-typed-arguments).

- [`mute.ts`](./mute.ts) — classic `h!mute @user 1h spamming` flow with a
  required snowflake, an optional duration, and a free-form reason.
