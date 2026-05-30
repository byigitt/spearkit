/**
 * Prefix commands — the smallest `!` command.
 *
 * Reading other users' message content is privileged, so we use the
 * `Intents.messages` preset (which includes the MessageContent intent) and
 * enable prefix dispatch with `prefix: "!"`.
 *
 * Run with: DISCORD_TOKEN=... npx tsx examples/prefix/basic.ts
 */
import { Intents, SpearClient, prefixCommand } from "spearkit";

const client = new SpearClient({ intents: Intents.messages, prefix: "!" });

// !greet world  ->  "Hello, world!"
const greet = prefixCommand({
  name: "greet",
  description: "Greet someone by name",
  run: (ctx) => {
    const who = ctx.args[0] ?? "stranger"; // args is string[]
    return ctx.reply(`Hello, ${who}!`);
  },
});

client.register(greet);

async function main(): Promise<void> {
  await client.start(); // reads DISCORD_TOKEN
}

void main();
