/**
 * Complete bot — every spearkit feature wired into one client.
 *
 * Use this as a map; the other example folders break each feature out on its
 * own. Run with: DISCORD_TOKEN=... GUILD_ID=... npx tsx examples/complete-bot/bot.ts
 */
import {
  ButtonStyle,
  Intents,
  SpearClient,
  button,
  command,
  commandGroup,
  event,
  modal,
  option,
  row,
  stringSelect,
  subcommand,
  textInput,
} from "spearkit";

const client = new SpearClient({ intents: Intents.default });

// --- commands --------------------------------------------------------------

const echo = command({
  name: "echo",
  description: "Repeat a message",
  options: {
    text: option.string({ description: "What to say", required: true }),
    times: option.integer({ description: "How many times", minValue: 1, maxValue: 5 }),
  },
  run: (ctx) => ctx.reply(ctx.options.text.repeat(ctx.options.times ?? 1)),
});

const fruits = ["apple", "banana", "cherry", "date"];
const fruit = command({
  name: "fruit",
  description: "Pick a fruit",
  options: {
    name: option.string({
      description: "Fruit name",
      required: true,
      autocomplete: (ctx) =>
        fruits.filter((f) => f.startsWith(ctx.value)).map((f) => ({ name: f, value: f })),
    }),
  },
  run: (ctx) => ctx.reply(`You picked ${ctx.options.name}`),
});

const admin = commandGroup({
  name: "admin",
  description: "Admin tools",
  guildOnly: true,
  subcommands: {
    say: subcommand({
      description: "Make the bot say something",
      options: { message: option.string({ description: "Message", required: true }) },
      run: (ctx) => ctx.reply({ content: ctx.options.message, ephemeral: true }),
    }),
  },
});

// --- components ------------------------------------------------------------

const vote = button({
  id: "vote:{choice}",
  label: "Vote",
  style: ButtonStyle.Success,
  run: (ctx) => ctx.update(`You voted: ${ctx.params.choice}`),
});

const colour = stringSelect({
  id: "colour",
  placeholder: "Pick a colour",
  options: [
    { label: "Red", value: "red" },
    { label: "Green", value: "green" },
    { label: "Blue", value: "blue" },
  ],
  run: (ctx) => ctx.reply({ content: `Chosen: ${ctx.values.join(", ")}`, ephemeral: true }),
});

const feedback = modal({
  id: "feedback:{ticket}",
  title: "Feedback",
  fields: {
    summary: textInput({ label: "Summary", required: true }),
    detail: textInput({ label: "Details", style: "Paragraph" }),
  },
  run: (ctx) =>
    ctx.reply({ content: `Thanks (#${ctx.params.ticket}): ${ctx.fields.summary}`, ephemeral: true }),
});

const panel = command({
  name: "panel",
  description: "Show the demo panel",
  run: (ctx) =>
    ctx.reply({
      content: "Try the controls:",
      components: [row(vote.build({ choice: "yes" })), row(colour.build())],
    }),
});

const ask = command({
  name: "ask",
  description: "Open the feedback modal",
  run: (ctx) => ctx.showModal(feedback.build({ ticket: "1234" })),
});

// --- events ----------------------------------------------------------------

const ready = event("clientReady", (c) => console.log(`Logged in as ${c.user.tag}`));

// --- wire up ---------------------------------------------------------------

client.register(echo, fruit, admin, panel, ask, vote, colour, feedback, ready);

async function main(): Promise<void> {
  await client.start();
  await client.deployCommands({ guildId: process.env.GUILD_ID });
  console.log("Commands deployed.");
}

void main();
