/**
 * "Type your answer" flows — wait for the user's next message, no raw collector.
 *
 * `ctx.awaitMessageFrom()` resolves to the next message from the invoking user
 * in the same channel, or `null` on timeout. No event wiring, no filter
 * boilerplate, no forgotten timeout.
 */
import { command } from "spearkit";

export const survey = command({
  name: "survey",
  description: "Ask a quick question",
  run: async (ctx) => {
    await ctx.reply("What's your favourite colour? (reply in chat within 30s)");
    const answer = await ctx.awaitMessageFrom(ctx.user.id, { time: 30_000 });
    if (answer === null) return ctx.followUp("Timed out — no answer received.");
    await ctx.followUp(`Nice choice — **${answer.content}**!`);
  },
});
