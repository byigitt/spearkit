# Modals

Text-input forms. `fields` keys become typed `ctx.fields`; custom-id `{param}`s
become typed `ctx.params`.

- [`basic.ts`](./basic.ts) — a modal opened from a command.
- [`from-button.ts`](./from-button.ts) — a button opens a modal, passing a param through.

Open a modal with `ctx.showModal(myModal.build(params))`.

See also: [buttons](../buttons), [contexts-and-replies](../contexts-and-replies).
