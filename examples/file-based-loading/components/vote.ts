import { button } from "spear";

// Named exports are registered too.
export const vote = button({
  id: "vote:{choice}",
  label: "Vote",
  style: "Success",
  run: (ctx) => ctx.update(`You voted: ${ctx.params.choice}`),
});
