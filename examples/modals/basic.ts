/**
 * Modals — typed forms on Label components.
 *
 * `fields` keys become typed `ctx.fields`; id `{param}`s become typed
 * `ctx.params`. Every field renders as a Discord Label component; radio
 * groups, checkbox groups, checkboxes and file uploads submit their own
 * value shapes. Open a modal from a command (or a component) with showModal.
 */
import {
  checkbox,
  checkboxGroup,
  command,
  fileUpload,
  modal,
  radioGroup,
  textInput,
} from "spearkit";

export const feedback = modal({
  id: "feedback:{ticket}",
  title: "Send feedback",
  fields: {
    summary: textInput({ label: "Summary", required: true, maxLength: 100 }),
    detail: textInput({ label: "Details", style: "Paragraph", required: false, maxLength: 2000 }),
    severity: radioGroup({
      label: "Severity",
      options: [
        { label: "Annoyance", value: "low" },
        { label: "Blocking", value: "high" },
      ],
    }),
    mood: checkbox({ label: "I had a good experience" }),
    topics: checkboxGroup({
      label: "Topics",
      minValues: 0,
      maxValues: 2,
      options: [
        { label: "Speed", value: "speed" },
        { label: "UI", value: "ui" },
      ],
    }),
    proof: fileUpload({ label: "Screenshots", minValues: 0, maxValues: 3 }),
  },
  run: (ctx) =>
    ctx.reply({
      // ctx.params.ticket: string, ctx.fields.summary/detail: string,
      // ctx.fields.severity: "low" | "high", ctx.fields.mood: boolean,
      // ctx.fields.topics: ("speed" | "ui")[], ctx.fields.proof: Attachment[]
      content: `Thanks (#${ctx.params.ticket}): ${ctx.fields.summary}`,
      ephemeral: true,
    }),
});

export const ask = command({
  name: "feedback",
  description: "Open the feedback form",
  run: (ctx) => ctx.showModal(feedback.build({ ticket: "1234" })),
});
