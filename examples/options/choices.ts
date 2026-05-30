/**
 * Options — choices narrow the value to a literal union.
 */
import { command, option } from "spear";

export const order = command({
  name: "order",
  description: "Order a drink",
  options: {
    size: option.string({
      description: "Size",
      required: true,
      choices: [
        { name: "Small", value: "sm" },
        { name: "Medium", value: "md" },
        { name: "Large", value: "lg" },
      ],
    }),
    sugar: option.integer({
      description: "Sugars",
      choices: [
        { name: "None", value: 0 },
        { name: "One", value: 1 },
        { name: "Two", value: 2 },
      ],
    }),
  },
  run: (ctx) => {
    const size: "sm" | "md" | "lg" = ctx.options.size; // narrowed to the choice values
    const sugar: 0 | 1 | 2 | undefined = ctx.options.sugar; // optional -> union | undefined
    return ctx.reply(`A ${size} drink with ${sugar ?? 0} sugar(s).`);
  },
});
