/**
 * Prefix commands — aliases and a per-user cooldown.
 *
 * `!daily`, `!claim`, and `!d` all trigger the same command, and each user may
 * only run it once every five seconds. spearkit replies with the remaining time
 * when someone is on cooldown.
 *
 * Run with: DISCORD_TOKEN=... npx tsx examples/prefix/aliases-and-cooldown.ts
 */
import { Intents, SpearClient, prefixCommand } from "spearkit";

const client = new SpearClient({ intents: Intents.messages, prefix: "!" });

export const daily = prefixCommand({
  name: "daily",
  aliases: ["claim", "d"],
  description: "Claim your daily reward",
  cooldown: 5_000, // one use per user per 5 seconds (shared client.cooldowns)
  run: (ctx) => ctx.reply(`Reward claimed via "${ctx.commandName}"! Come back soon.`),
});

client.register(daily);

async function main(): Promise<void> {
  await client.start(); // reads DISCORD_TOKEN
}

void main();
