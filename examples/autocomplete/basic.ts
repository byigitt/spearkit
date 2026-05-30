/**
 * Autocomplete — suggest values as the user types.
 *
 * Provide an `autocomplete` handler on a string/integer/number option. spearkit
 * marks the option autocompletable, routes the autocomplete interaction, and
 * sends whatever choices you return (capped at 25).
 */
import { command, option } from "spearkit";

const FRUITS = ["apple", "apricot", "banana", "blueberry", "cherry", "date"];

export const fruit = command({
  name: "fruit",
  description: "Pick a fruit",
  options: {
    name: option.string({
      description: "Fruit name",
      required: true,
      autocomplete: (ctx) =>
        FRUITS.filter((f) => f.startsWith(ctx.value.toLowerCase())).map((f) => ({
          name: f,
          value: f,
        })),
    }),
  },
  run: (ctx) => ctx.reply(`You picked ${ctx.options.name}`),
});

// Numeric autocomplete works too (values are numbers).
export const pick = command({
  name: "pick",
  description: "Pick a number",
  options: {
    n: option.integer({
      description: "A number",
      required: true,
      autocomplete: () => [1, 2, 3, 5, 8, 13].map((n) => ({ name: `#${n}`, value: n })),
    }),
  },
  run: (ctx) => ctx.reply(`You picked ${ctx.options.n}`),
});
