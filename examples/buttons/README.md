# Buttons

Define a button's appearance, custom-id pattern, and click handler together.

- [`basic.ts`](./basic.ts) — a button with no params.
- [`with-params.ts`](./with-params.ts) — typed `{param}`s in the custom-id; `build(params)`.
- [`link-buttons.ts`](./link-buttons.ts) — URL buttons alongside interactive ones.

`build()` returns a discord.js `ButtonBuilder`; wrap it in `row(...)`.

See also: [select-menus](../select-menus), [modals](../modals).
