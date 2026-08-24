/**
 * Polls — validated sugar over discord.js PollData.
 */
import { Intents, SpearClient, command, poll } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

export const lunch = command({
  name: "lunch",
  description: "Vote for lunch",
  run: (ctx) =>
    ctx.reply({
      poll: poll({
        question: "What should we order?",
        answers: [
          { text: "Pizza", emoji: "🍕" },
          { text: "Tacos", emoji: "🌮" },
          { text: "Salad", emoji: "🥗" },
        ],
        durationHours: 2,
      }),
    }),
});

client.register(lunch);

async function main(): Promise<void> {
  await client.start();
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

void main();
