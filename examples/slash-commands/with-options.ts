/**
 * Slash commands — typed options.
 *
 * Option values are inferred: required -> the value type, optional -> value |
 * undefined. See ../options for every option type.
 */
import { command, option } from "spearkit";

export const echo = command({
  name: "echo",
  description: "Repeat a message",
  options: {
    text: option.string({ description: "What to say", required: true }),
    times: option.integer({ description: "Repeat count", minValue: 1, maxValue: 5 }),
  },
  run: (ctx) => {
    const text: string = ctx.options.text; // required -> string
    const times: number | undefined = ctx.options.times; // optional -> number | undefined
    return ctx.reply(text.repeat(times ?? 1));
  },
});

export const profile = command({
  name: "profile",
  description: "Show a member's profile",
  options: {
    member: option.user({ description: "Member", required: true }),
    detailed: option.boolean({ description: "Show extra detail" }),
  },
  run: (ctx) =>
    ctx.reply({
      content: `${ctx.options.member.tag}${ctx.options.detailed ? " (detailed)" : ""}`,
      ephemeral: true,
    }),
});
