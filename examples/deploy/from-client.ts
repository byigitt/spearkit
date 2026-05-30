/**
 * Deploy — from the running client.
 *
 * `client.deployCommands` uses the client's own authenticated REST connection,
 * so there is no separate token or application id to pass. It must run after
 * the client is ready.
 */
import { Intents, SpearClient, command } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

client.register(command({ name: "ping", description: "Check latency", run: (c) => c.reply("pong") }));

async function main(): Promise<void> {
  await client.start(); // reads DISCORD_TOKEN

  // Guild deploy is instant — great for development.
  await client.deployCommands({ guildId: process.env.GUILD_ID });

  // Global deploy (every guild), slower to propagate:
  // await client.deployCommands();
}

void main();
