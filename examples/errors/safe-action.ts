/**
 * Graceful Discord API errors — recognise and recover instead of crashing.
 *
 * `isDiscordError(err, code)` narrows the throw and matches a named code;
 * `explainDiscordError(err)` turns recognised failures into a user-facing
 * sentence. Here, DMing a user can fail because they disabled DMs — a normal,
 * recoverable outcome, not a bug.
 */
import {
  DiscordErrorCode,
  command,
  explainDiscordError,
  isDiscordError,
  option,
} from "spearkit";

export const dm = command({
  name: "dm",
  description: "Send a user a direct message",
  options: {
    user: option.user({ description: "Who to message", required: true }),
    text: option.string({ description: "What to say", required: true }),
  },
  run: async (ctx) => {
    try {
      await ctx.options.user.send(ctx.options.text);
      await ctx.success(`Message sent to ${ctx.options.user.username}.`);
    } catch (err) {
      if (isDiscordError(err, DiscordErrorCode.CannotSendMessagesToThisUser)) {
        return ctx.error("That user has DMs disabled or has blocked me.");
      }
      // Any other recognised Discord error → friendly text; otherwise generic.
      await ctx.error(explainDiscordError(err) ?? "Couldn't send that message.");
    }
  },
});
