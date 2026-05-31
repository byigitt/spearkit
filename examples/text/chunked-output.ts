/**
 * Long output without losing the tail — split on the 2000-char message limit.
 *
 * `chunkMessage` breaks text on line (and, for over-long lines, word) boundaries
 * so each piece fits Discord's limit. `truncate` is the one-liner for "fit this
 * into a field/footer".
 */
import { chunkMessage, command, option, truncate } from "spearkit";

export const dump = command({
  name: "dump",
  description: "Echo a long block of text across as many messages as needed",
  options: { text: option.string({ description: "Text to echo", required: true }) },
  run: async (ctx) => {
    const parts = chunkMessage(ctx.options.text);
    await ctx.reply(parts[0] ?? "(nothing to show)");
    for (const part of parts.slice(1)) await ctx.followUp(part);
  },
});

export const preview = command({
  name: "preview",
  description: "Show a short preview of some text",
  options: { text: option.string({ description: "Text", required: true }) },
  run: (ctx) => ctx.reply(truncate(ctx.options.text, 100)),
});
