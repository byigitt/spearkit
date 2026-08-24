/**
 * Hybrid command — one definition for slash and `!prefix`.
 *
 * Run with: DISCORD_TOKEN=... npx tsx examples/hybrid/ping.ts
 * Needs MessageContent (Intents.messages) for the prefix path.
 */
import { Intents, SpearClient, hybridCommand } from "spearkit";

const client = new SpearClient({ intents: Intents.messages, prefix: "!" });

export const ping = hybridCommand({
  name: "ping",
  description: "Check latency",
  run: (ctx) => ctx.reply(`pong (${ctx.kind}) ${ctx.client.ws.ping}ms`),
});

client.register(ping);

async function main(): Promise<void> {
  await client.start();
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

void main();
