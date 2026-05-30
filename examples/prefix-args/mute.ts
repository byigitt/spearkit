/**
 * Prefix command with typed arguments:
 *   h!mute @user 1h spamming the chat
 *
 * The `args` schema produces a fully-typed `ctx.options` shape:
 *   { target: string; duration: number; reason?: string }
 *
 * On parse failure (missing argument, bad snowflake, unparsable duration)
 * spearkit replies with a red error embed; the handler never runs.
 */
import { prefixCommand } from "spearkit";

export const mute = prefixCommand({
  name: "mute",
  aliases: ["m"],
  description: "Mute a user for a duration",
  cooldown: 5000,
  args: (a) =>
    a
      .snowflake("target", { required: true })
      .duration("duration", { required: true })
      .rest("reason", { default: "No reason given." }),
  run: async (ctx) => {
    const seconds = Math.round(ctx.options.duration / 1000);
    await ctx.reply(`Muted <@${ctx.options.target}> for ${seconds}s: ${ctx.options.reason}`);
  },
});
