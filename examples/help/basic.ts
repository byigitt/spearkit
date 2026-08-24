/**
 * Automatic help — generated from live command registries.
 */
import { Intents, SpearClient, command, helpCommand } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

const ping = command({
  name: "ping",
  description: "Check latency",
  run: (ctx) => ctx.reply(`Pong! ${ctx.client.ws.ping}ms`),
});

client.register(ping, helpCommand({ title: "Bot commands" }));

async function main(): Promise<void> {
  await client.start();
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

void main();
