/**
 * Everyday DX — choices, autocomplete filtering, long replies.
 */
import { Intents, SpearClient, choices, command, option } from "spearkit";

const fruit = ["apple", "apricot", "banana", "blueberry", "cherry"] as const;

export const pick = command({
  name: "pick",
  description: "Pick a fruit",
  options: {
    fruit: option.string({
      description: "Fruit",
      required: true,
      autocomplete: (ctx) => ctx.suggest(fruit),
    }),
    difficulty: option.string({
      description: "How hard",
      choices: choices({ Easy: "easy", Hard: "hard" }),
    }),
  },
  run: async (ctx) => {
    await ctx.sendLong(`You picked ${ctx.options.fruit}.`);
  },
});

const client = new SpearClient({
  intents: Intents.default,
  owners: process.env.OWNER_ID === undefined ? [] : [process.env.OWNER_ID],
});

client.register(pick);

async function main(): Promise<void> {
  await client.start();
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

void main();
