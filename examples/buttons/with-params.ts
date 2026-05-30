/**
 * Buttons — typed custom-id params.
 *
 * `{param}` segments in the id become a typed `ctx.params` object, and `build`
 * requires exactly those params. spear encodes/decodes them for you.
 */
import { command, button, row } from "spear";

// One handler serves every vote button; the choice rides in the custom-id.
export const vote = button({
  id: "vote:{choice}",
  label: "Vote",
  style: "Success",
  run: (ctx) => ctx.update(`You voted: ${ctx.params.choice}`), // choice: string
});

// Multiple params: build("page:3:next").
export const page = button({
  id: "page:{index}:{dir}",
  label: "Next",
  run: (ctx) => ctx.update(`page ${ctx.params.index}, direction ${ctx.params.dir}`),
});

export const poll = command({
  name: "poll",
  description: "Start a yes/no poll",
  run: (ctx) =>
    ctx.reply({
      content: "Vote:",
      components: [
        row(
          vote.build({ choice: "yes" }).setLabel("Yes"),
          vote.build({ choice: "no" }).setLabel("No"),
        ),
      ],
    }),
});
