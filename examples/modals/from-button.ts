/**
 * Modals — opened from a button.
 *
 * A button handler can call showModal. The button's param flows into the
 * modal's id, so the submit handler knows the context.
 */
import { button, command, modal, row, textInput } from "spear";

export const reportForm = modal({
  id: "report:{messageId}",
  title: "Report message",
  fields: {
    reason: textInput({ label: "Why are you reporting this?", style: "Paragraph", required: true }),
  },
  run: (ctx) =>
    ctx.reply({
      content: `Reported message ${ctx.params.messageId}: ${ctx.fields.reason}`,
      ephemeral: true,
    }),
});

export const openReport = button({
  id: "open-report:{messageId}",
  label: "Report",
  style: "Danger",
  run: (ctx) => ctx.showModal(reportForm.build({ messageId: ctx.params.messageId })),
});

export const moderate = command({
  name: "moderate",
  description: "Show a report button",
  run: (ctx) =>
    ctx.reply({
      content: "Found something wrong?",
      components: [row(openReport.build({ messageId: "987654321" }))],
      ephemeral: true,
    }),
});
