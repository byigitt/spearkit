import { command } from "spear";

// Default export — picked up automatically by client.load().
export default command({
  name: "ping",
  description: "Check that the bot is alive",
  run: (ctx) => ctx.reply(`Pong! ${ctx.client.ws.ping}ms`),
});
