/**
 * Starter bot — edit this file, then `npm start`.
 *
 * Lifecycle: register → start → deployCommands (after start).
 * Import discord.js symbols from "spearkit", not "discord.js".
 */
import { Intents, SpearClient, command, event, option } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

const ping = command({
  name: "ping",
  description: "Check that the bot is alive",
  run: (ctx) => ctx.reply(`Pong! ${ctx.client.ws.ping}ms`),
});

const greet = command({
  name: "greet",
  description: "Greet someone",
  options: { who: option.user({ description: "Who to greet", required: true }) },
  run: (ctx) => ctx.reply(`Hello ${ctx.options.who}!`),
});

client.register(
  ping,
  greet,
  event("clientReady", (c) => console.log(`Online as ${c.user.tag}`)),
);

await client.start();
await client.deployCommands({ guildId: process.env.GUILD_ID });
