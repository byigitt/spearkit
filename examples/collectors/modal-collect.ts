/**
 * Show a modal and wait for it inline with `ctx.awaitModal`.
 *
 * Instead of registering a separate modal handler and threading state through
 * its custom-id, you can show the modal and await its submission right where you
 * opened it. The wait is scoped to this user + this modal and is always bounded,
 * sidestepping the "Unknown interaction after a cancelled modal" trap.
 */
import { command, modal, textInput } from "spearkit";

const feedbackForm = modal({
  id: "feedback-form",
  title: "Feedback",
  fields: { text: textInput({ label: "Your feedback", style: "Paragraph", required: true }) },
  // Fallback handler if you also register() and route it; unused when awaited.
  run: (ctx) => ctx.replyEphemeral(`Thanks: ${ctx.fields.text}`),
});

export const feedback = command({
  name: "feedback",
  description: "Open a feedback form and collect the answer",
  run: async (ctx) => {
    const submitted = await ctx.awaitModal(feedbackForm.build(), { time: 120_000 });
    if (submitted === null) return; // dismissed or timed out
    const text = submitted.fields.getTextInputValue("text");
    await submitted.reply({ content: `Thanks for the feedback: ${text}`, ephemeral: true });
  },
});
