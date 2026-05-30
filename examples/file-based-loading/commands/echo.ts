import { command, option } from "spear";

export default command({
  name: "echo",
  description: "Repeat a message",
  options: {
    text: option.string({ description: "What to say", required: true }),
    loud: option.boolean({ description: "Shout it" }),
  },
  run: (ctx) => ctx.reply(ctx.options.loud ? ctx.options.text.toUpperCase() : ctx.options.text),
});
