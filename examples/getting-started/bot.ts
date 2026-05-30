/**
 * Getting started — the smallest useful spear bot.
 *
 * Run with: DISCORD_TOKEN=... GUILD_ID=... npx tsx examples/getting-started/bot.ts
 */
import { Intents, SpearClient, command, event, option } from "spear";

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
  run: (ctx) => ctx.reply(`Hello ${ctx.options.who}!`), // who: User
});

const ready = event("clientReady", (c) => console.log(`Online as ${c.user.tag}`));

client.register(ping, greet, ready);

async function main(): Promise<void> {
  await client.start(); // reads DISCORD_TOKEN
  await client.deployCommands({ guildId: process.env.GUILD_ID }); // instant in one guild
}

void main();
