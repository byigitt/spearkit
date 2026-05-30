/**
 * Deploy — a standalone registration script (no running client).
 *
 * Run this once, and whenever your command *definitions* change.
 *   DISCORD_TOKEN=... DISCORD_APP_ID=... GUILD_ID=... npx tsx examples/deploy/standalone.ts
 *
 * Guild deploys (with a guildId) are instant; global deploys (no guildId) can
 * take up to an hour to propagate.
 */
import { CommandRegistry, command, option } from "spearkit";

const ping = command({ name: "ping", description: "Check latency", run: () => {} });
const echo = command({
  name: "echo",
  description: "Repeat a message",
  options: { text: option.string({ description: "What to say", required: true }) },
  run: () => {},
});

async function main(): Promise<void> {
  const token = process.env.DISCORD_TOKEN;
  const applicationId = process.env.DISCORD_APP_ID;
  const guildId = process.env.GUILD_ID; // omit for a global deploy
  if (token === undefined || applicationId === undefined) {
    throw new Error("Set DISCORD_TOKEN and DISCORD_APP_ID");
  }

  const registry = new CommandRegistry().add(ping, echo);
  const result = await registry.deploy({ token, applicationId, guildId });
  console.log(`Deployed ${Array.isArray(result) ? result.length : 0} commands.`);
}

void main();
