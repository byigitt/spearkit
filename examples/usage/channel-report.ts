/**
 * Usage tracking — mirror every use into a Discord channel.
 *
 * With `usage: { channel }`, spearkit posts one line per successful command,
 * component, or prefix-command use into the given channel id using the default
 * `formatUsage` renderer. Pass `format` to customise the line.
 *
 * Run with: DISCORD_TOKEN=... npx tsx examples/usage/channel-report.ts
 */
import { Intents, SpearClient, command, type UsageEvent } from "spearkit";

const client = new SpearClient({
  intents: Intents.default,
  usage: {
    channel: "CHANNEL_ID", // replace with the audit channel's id
    format: (event: UsageEvent) =>
      `${event.userTag ?? "someone"} used \`${event.name}\` (${event.type})`,
  },
});

const ping = command({
  name: "ping",
  description: "Check that the bot is alive",
  run: (ctx) => ctx.reply("Pong!"),
});

client.register(ping);

async function main(): Promise<void> {
  await client.start(); // reads DISCORD_TOKEN
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

void main();
