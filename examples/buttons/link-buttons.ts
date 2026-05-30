/**
 * Buttons — link buttons.
 *
 * Link buttons open a URL; they have no custom-id and no handler. They can sit
 * in the same row as interactive buttons.
 */
import { command, button, linkButton, row } from "spear";

const docs = linkButton({ url: "https://discord.js.org", label: "Docs" });

const acknowledge = button({
  id: "ack",
  label: "Got it",
  style: "Secondary",
  run: (ctx) => ctx.update({ content: "Thanks!", components: [] }),
});

export const help = command({
  name: "help",
  description: "Show help with a link and a button",
  run: (ctx) =>
    ctx.reply({
      content: "Need help?",
      components: [row(acknowledge.build(), docs)],
    }),
});
