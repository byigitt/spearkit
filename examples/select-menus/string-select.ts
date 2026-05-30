/**
 * Select menus — string select.
 *
 * `ctx.values` holds the chosen values; `ctx.value` is the first one.
 */
import { command, row, stringSelect } from "spearkit";

export const colour = stringSelect({
  id: "colour",
  placeholder: "Pick a colour",
  minValues: 1,
  maxValues: 1,
  options: [
    { label: "Red", value: "red", emoji: "🔴" },
    { label: "Green", value: "green", description: "the calm one" },
    { label: "Blue", value: "blue", default: true },
  ],
  run: (ctx) => ctx.reply({ content: `You picked ${ctx.value}`, ephemeral: true }),
});

// Multi-select: maxValues > 1, read ctx.values.
export const toppings = stringSelect({
  id: "toppings",
  placeholder: "Pick toppings",
  minValues: 1,
  maxValues: 3,
  options: [
    { label: "Cheese", value: "cheese" },
    { label: "Mushroom", value: "mushroom" },
    { label: "Olives", value: "olives" },
    { label: "Onion", value: "onion" },
  ],
  run: (ctx) => ctx.reply({ content: `Chosen: ${ctx.values.join(", ")}`, ephemeral: true }),
});

export const pizza = command({
  name: "pizza",
  description: "Build a pizza",
  run: (ctx) => ctx.reply({ content: "Choose toppings:", components: [row(toppings.build())] }),
});
