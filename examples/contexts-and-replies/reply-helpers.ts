/**
 * Contexts — reply helpers shared by every handler.
 *
 * reply / replyEphemeral / defer / editReply / followUp / send / error all live
 * on the context. `{ ephemeral: true }` works on any reply payload.
 */
import { command, option } from "spear";

// Plain reply, and the ephemeral shortcut.
export const hi = command({
  name: "hi",
  description: "Say hi (only you can see it)",
  run: (ctx) => ctx.reply({ content: "Hi!", ephemeral: true }),
});

export const secret = command({
  name: "secret",
  description: "Ephemeral via the helper",
  run: (ctx) => ctx.replyEphemeral("Only you can read this."),
});

// Defer for slow work, then edit the response.
export const report = command({
  name: "report",
  description: "Generate a slow report",
  run: async (ctx) => {
    await ctx.defer(); // acknowledge within 3s
    const data = await new Promise<string>((r) => setTimeout(() => r("done"), 1000));
    await ctx.editReply(`Report: ${data}`);
  },
});

// send() is state-aware: reply, editReply (if deferred), or followUp (if replied).
export const flexible = command({
  name: "flexible",
  description: "State-aware send",
  run: async (ctx) => {
    await ctx.reply("first");
    await ctx.send("second"); // becomes a follow-up because we already replied
  },
});

// error() is an always-ephemeral, state-aware failure message.
export const guarded = command({
  name: "guarded",
  description: "Guild-only with a friendly error",
  options: { who: option.user({ description: "Member", required: true }) },
  run: async (ctx) => {
    if (!ctx.guild) return ctx.error("This only works in a server.");
    await ctx.reply(`Hello ${ctx.options.who} from ${ctx.guild.name}.`);
  },
});
