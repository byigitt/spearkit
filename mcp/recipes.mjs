/** Canonical snippets an agent should copy, not invent. */
export const RECIPES = [
  {
    id: "bootstrap",
    title: "Minimal SpearClient bot",
    when: "New bot: connect, register a slash command, deploy after start.",
    related: ["getting-started", "client"],
    code: `import { SpearClient, Intents, command, event } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

const ping = command({
  name: "ping",
  description: "Check latency",
  run: (ctx) => ctx.reply(\`Pong! \${ctx.client.ws.ping}ms\`),
});

client.register(ping, event("clientReady", (c) => console.log(\`Online as \${c.user.tag}\`)));
await client.start(process.env.DISCORD_TOKEN);
await client.deployCommands({ guildId: process.env.GUILD_ID });`,
  },
  {
    id: "slash-command",
    title: "Slash command with typed options",
    when: "A /command that takes user input. Required options are non-nullable; optional are T | undefined; choices narrow to a literal union.",
    related: ["commands", "options"],
    code: `import { command, option } from "spearkit";

export const echo = command({
  name: "echo",
  description: "Repeat a message",
  options: {
    text: option.string({ description: "What to say", required: true }),
    times: option.integer({ description: "Count", minValue: 1, maxValue: 5 }),
    mode: option.string({
      description: "Visibility",
      choices: [
        { name: "Everyone", value: "public" },
        { name: "Just me", value: "private" },
      ],
    }),
  },
  run: (ctx) =>
    ctx.reply({
      content: ctx.options.text.repeat(ctx.options.times ?? 1),
      ephemeral: ctx.options.mode === "private",
    }),
});`,
  },
  {
    id: "autocomplete",
    title: "Co-located autocomplete",
    when: "Suggest values while the user types a string option.",
    related: ["options", "dx"],
    code: `import { command, option } from "spearkit";

const cities = ["Ankara", "Istanbul", "Izmir"];

export const where = command({
  name: "where",
  description: "Pick a city",
  options: {
    city: option.string({
      description: "City",
      required: true,
      autocomplete: (ctx) => ctx.suggest(cities),
    }),
  },
  run: (ctx) => ctx.reply(ctx.options.city),
});`,
  },
  {
    id: "subcommands",
    title: "commandGroup + subcommand",
    when: "Several related commands under one slash name, optionally nested groups.",
    related: ["commands"],
    code: `import { commandGroup, subcommand, subcommandGroup, option } from "spearkit";

export const admin = commandGroup({
  name: "admin",
  description: "Admin tools",
  guildOnly: true,
  subcommands: {
    say: subcommand({
      description: "Speak",
      options: { message: option.string({ description: "Text", required: true }) },
      run: (ctx) => ctx.reply(ctx.options.message),
    }),
  },
  groups: {
    users: subcommandGroup({
      description: "Manage users",
      subcommands: {
        ban: subcommand({
          description: "Ban",
          options: { target: option.user({ description: "Who", required: true }) },
          run: (ctx) => ctx.reply(\`Banned \${ctx.options.target.tag}\`),
        }),
      },
    }),
  },
});`,
  },
  {
    id: "button",
    title: "Button with custom-id params",
    when: "A clickable button. Put data in id: \"x:{param}\" and read ctx.params. Never parse custom ids by hand.",
    related: ["components"],
    code: `import { button, row } from "spearkit";

export const vote = button({
  id: "vote:{choice}",
  label: "Yes",
  style: "Success",
  run: (ctx) => ctx.update(\`You chose \${ctx.params.choice}\`),
});

// build() needs exactly the {param}s declared in id (custom ids cap at 100 chars):
await channel.send({ content: "Choose:", components: [row(vote.build({ choice: "yes" }))] });`,
  },
  {
    id: "select",
    title: "String select and entity selects",
    when: "A dropdown of fixed options, or pick users/roles/channels.",
    related: ["components"],
    code: `import { stringSelect, userSelect, row } from "spearkit";

export const colour = stringSelect({
  id: "colour",
  options: [
    { label: "Red", value: "red" },
    { label: "Blue", value: "blue" },
  ],
  run: (ctx) => ctx.replyEphemeral(ctx.values.join(", ")),
});

export const pickUser = userSelect({
  id: "pick-user",
  run: (ctx) => ctx.reply(\`Picked \${[...ctx.users.values()].map((u) => u.tag).join(", ")}\`),
});

await channel.send({
  content: "Pick:",
  components: [row(colour.build()), row(pickUser.build())],
});`,
  },
  {
    id: "modal",
    title: "Modal with typed fields",
    when: "A form. Each field is a Label; values are inferred (textInput → string, radioGroup → literal, checkbox → boolean, fileUpload → Attachment[]).",
    related: ["components"],
    code: `import { modal, textInput, radioGroup, checkboxGroup, checkbox, fileUpload } from "spearkit";

export const feedback = modal({
  id: "feedback:{ticket}",
  title: "Feedback",
  fields: {
    summary: textInput({ label: "Summary", required: true }),
    detail: textInput({ label: "Details", style: "Paragraph" }),
    severity: radioGroup({
      label: "Severity",
      options: [
        { label: "Low", value: "low" },
        { label: "High", value: "high" },
      ],
    }),
    topics: checkboxGroup({
      label: "Topics",
      minValues: 0,
      options: [
        { label: "Speed", value: "speed" },
        { label: "UI", value: "ui" },
      ],
    }),
    ok: checkbox({ label: "I understand" }),
    shots: fileUpload({ label: "Screenshots", minValues: 0 }),
  },
  run: (ctx) => ctx.reply(\`#\${ctx.params.ticket}: \${ctx.fields.summary}\`),
});

// From a command or button: await ctx.showModal(feedback.build({ ticket: "42" }));`,
  },
  {
    id: "prefix",
    title: "Prefix command with typed args",
    when: "Classic !text commands. Reading other users' messages needs Intents.messages and Message Content in the Developer Portal.",
    related: ["prefix"],
    code: `import { SpearClient, Intents, prefixCommand } from "spearkit";

const client = new SpearClient({ intents: Intents.messages, prefix: "!" });

export const mute = prefixCommand({
  name: "mute",
  args: (a) => a.snowflake("target").duration("d").rest("reason"),
  run: (ctx) =>
    ctx.reply(\`Muted \${ctx.options.target} for \${ctx.options.d}: \${ctx.options.reason}\`),
});

client.register(mute);`,
  },
  {
    id: "hybrid",
    title: "Slash + prefix from one definition",
    when: "The same command should work as /ping and !ping.",
    related: ["hybrid"],
    code: `import { hybridCommand } from "spearkit";

export const ping = hybridCommand({
  name: "ping",
  description: "Check latency",
  run: (ctx) => ctx.reply(\`Pong! \${ctx.client.ws.ping}ms\`),
});`,
  },
  {
    id: "context-menu",
    title: "User / message context menus",
    when: "A right-click Apps action. Deploy with slash commands via deployAllCommands.",
    related: ["context-menus"],
    code: `import { userCommand, messageCommand } from "spearkit";

export const report = userCommand({
  name: "Report",
  run: (ctx) => ctx.replyEphemeral(\`Reported \${ctx.targetUser.tag}\`),
});

export const quote = messageCommand({
  name: "Quote",
  run: (ctx) => ctx.reply(ctx.targetMessage.content || "(no text)"),
});

await client.deployAllCommands({ guildId: process.env.GUILD_ID, strategy: "diff" });`,
  },
  {
    id: "guards-cooldown",
    title: "Guards and cooldowns",
    when: "Restrict who can run a handler, or rate-limit it.",
    related: ["guards", "cooldown"],
    code: `import { command, guildOnly, requireAnyRole, requireUserPermissions } from "spearkit";

export const purge = command({
  name: "purge",
  description: "Delete messages",
  guards: [guildOnly(), requireAnyRole(["MOD_ROLE_ID"]), requireUserPermissions("ManageMessages")],
  cooldown: { duration: 10_000, scope: "user" },
  run: (ctx) => ctx.replySuccess("Done"),
});`,
  },
  {
    id: "paginate-confirm",
    title: "Pagination and confirm",
    when: "A paged list, or an Are you sure? gate before a destructive action.",
    related: ["components", "context"],
    code: `import { paginate, confirm, EmbedBuilder } from "spearkit";

await paginate(ctx.interaction, items, {
  pageSize: 10,
  render: (slice, { page, pages }) =>
    new EmbedBuilder().setTitle(\`Page \${page + 1}/\${pages}\`).setDescription(slice.join("\\n")),
});

const { confirmed } = await confirm(ctx.interaction, {
  body: "Reset everything?",
  confirm: { label: "Reset", style: "Danger" },
});
if (!confirmed) return ctx.error("Cancelled.");`,
  },
  {
    id: "events",
    title: "Gateway events",
    when: "React to Discord gateway events. Ready is clientReady, not ready.",
    related: ["events"],
    code: `import { event } from "spearkit";

export const ready = event("clientReady", (c) => console.log(\`Online as \${c.user.tag}\`));

export const welcome = event("guildMemberAdd", (member) => {
  console.log(\`\${member.user.tag} joined \${member.guild.name}\`);
});`,
  },
  {
    id: "auto-defer",
    title: "Beat the 3-second interaction window",
    when: "Handler work can take more than ~3s (Unknown interaction 10062). Defer then edit, or set autoDefer.",
    related: ["auto-defer", "context"],
    code: `import { command } from "spearkit";

export const slow = command({
  name: "slow",
  description: "Does slow work",
  autoDefer: true, // or { ephemeral: true, delayMs: 1500 }
  run: async (ctx) => {
    await doSlowWork();
    await ctx.editReply("Done");
  },
});`,
  },
  {
    id: "file-loading",
    title: "One file per handler",
    when: "A larger bot: discover commands/events/components from a directory.",
    related: ["loading", "plugins"],
    code: `import { fileURLToPath } from "node:url";
import { SpearClient, Intents } from "spearkit";

const here = fileURLToPath(new URL(".", import.meta.url));
const client = new SpearClient({ intents: Intents.default });

await client.load(\`\${here}commands\`, { typescript: true });
await client.load(\`\${here}events\`, { typescript: true });
await client.load(\`\${here}components\`, { typescript: true });

await client.start(process.env.DISCORD_TOKEN);
await client.deployCommands({ guildId: process.env.GUILD_ID });`,
  },
  {
    id: "scheduler",
    title: "Cron / interval tasks",
    when: "Run a job on a schedule after the bot is ready.",
    related: ["scheduler"],
    code: `import { task } from "spearkit";

export const daily = task({
  name: "daily-report",
  cron: "0 9 * * *",
  run: async (client) => {
    client.logger.info("daily tick");
  },
});`,
  },
  {
    id: "anti-patterns",
    title: "Mistakes to avoid",
    when: "Anytime you are tempted to write discord.js boilerplate, import from discord.js, or listen on ready.",
    related: ["migration", "getting-started"],
    code: `// Import everything from "spearkit" — never import from "discord.js".
// Use SpearClient, not Client.
// Ready event is "clientReady", not "ready".
// client.register(...) then await client.start(token) then await client.deployCommands(...).
// Never write an interactionCreate switch; never split custom ids by hand.
// component.build(...) takes exactly the {param}s in the id.
// Deploy only when command definitions change, not on every restart.
// Prefix commands that read other users' messages need Intents.messages + Message Content intent.`,
  },
];

export function listRecipes() {
  return RECIPES.map(({ id, title, when, related }) => ({ id, title, when, related }));
}

export function getRecipe(id) {
  const needle = id.trim().toLowerCase();
  const exact = RECIPES.find((r) => r.id === needle);
  if (exact) return exact;
  return RECIPES.find(
    (r) =>
      r.id.includes(needle) ||
      r.title.toLowerCase().includes(needle) ||
      r.when.toLowerCase().includes(needle),
  );
}
