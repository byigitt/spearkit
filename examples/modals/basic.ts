/**
 * Modals — text-input forms.
 *
 * `fields` keys become typed `ctx.fields`; id `{param}`s become typed
 * `ctx.params`. Open a modal from a command (or a component) with showModal.
 */
import { command, modal, textInput } from "spear";

export const feedback = modal({
  id: "feedback:{ticket}",
  title: "Send feedback",
  fields: {
    summary: textInput({ label: "Summary", required: true, maxLength: 100 }),
    detail: textInput({ label: "Details", style: "Paragraph", required: false, maxLength: 2000 }),
  },
  run: (ctx) =>
    ctx.reply({
      // ctx.params.ticket: string, ctx.fields.summary/detail: string
      content: `Thanks (#${ctx.params.ticket}): ${ctx.fields.summary}`,
      ephemeral: true,
    }),
});

export const ask = command({
  name: "feedback",
  description: "Open the feedback form",
  run: (ctx) => ctx.showModal(feedback.build({ ticket: "1234" })),
});
