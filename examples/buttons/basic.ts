/**
 * Buttons — appearance, custom-id and click handler in one place.
 *
 * Register the button (client.register(refresh)), build it into a row, and send
 * it on a message. spear routes the click to `run`.
 */
import { command, button, row } from "spear";

export const refresh = button({
  id: "refresh",
  label: "Refresh",
  style: "Primary",
  run: (ctx) => ctx.update(`Refreshed at ${new Date().toLocaleTimeString()}`),
});

// A command that posts the button.
export const status = command({
  name: "status",
  description: "Show a refreshable status",
  run: (ctx) => ctx.reply({ content: "Status: OK", components: [row(refresh.build())] }),
});
