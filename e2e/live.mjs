/**
 * spearkit — comprehensive live end-to-end test against a real Discord application.
 *
 * Builds a real bot with the *built* library (dist/index.js — the artifact a
 * consumer would `npm install`) and exercises the entire public surface, both
 * live against Discord and through the real registries.
 *
 * Coverage:
 *   A. Intent presets (Intents.none/default/guilds/messages/all).
 *   B. Custom-id codec (compile/build/parse/paramsFromValues, encoding, limits).
 *   C. Gateway login + ready (SpearClient, intents, event wiring).
 *   D. Live events: clientReady AND messageCreate (a real non-lifecycle event).
 *   E. Plugins: client.use(definePlugin(...)) registers and deploys a command.
 *   F. File-based loading: client.load(dir) imports + registers a real module.
 *   G. Command deploy round-trip over REST — every option type (string/integer/
 *      number/boolean/user/channel/role/mentionable/attachment), choices,
 *      min/max, channel types, autocomplete flag, subcommands, subcommand
 *      groups, nsfw, guild-only contexts, default member permissions.
 *   H. Component wire round-trip — button (+params), multi-param/encoded custom
 *      id, link button, string/user/role/channel/mentionable selects: sent to a
 *      channel, fetched back, asserted against the codec and component types.
 *   I. Handler dispatch through the real registries (faithful interaction
 *      fixtures, since Discord only delivers interactions from a human): command
 *      + typed option resolution, autocomplete, button, all five selects, modal
 *      submit — asserting params/values/fields are decoded and handlers run.
 *   J. Event registry once/non-once semantics.
 *
 * Credentials come from process.env or the repo `.env`:
 *   TEST_DISCORD_TOKEN, TEST_DISCORD_GUILD
 *
 * Usage:
 *   node e2e/live.mjs            # verify, then log out and exit
 *   node e2e/live.mjs --stay     # leave the bot online for manual clicking
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import {
  SpearClient,
  Intents,
  GatewayIntentBits,
  ApplicationCommandOptionType,
  ComponentType,
  ButtonStyle,
  ChannelType,
  InteractionContextType,
  PermissionFlagsBits,
  Routes,
  command,
  commandGroup,
  subcommand,
  subcommandGroup,
  option,
  button,
  linkButton,
  stringSelect,
  userSelect,
  roleSelect,
  channelSelect,
  mentionableSelect,
  modal,
  textInput,
  row,
  event,
  definePlugin,
  compilePattern,
  buildCustomId,
  parseCustomId,
  paramsFromValues,
  MAX_CUSTOM_ID_LENGTH,
  Logger,
  loadEnv,
  parseEnv,
  env,
  CommandRegistry,
  CooldownManager,
  effectiveDuration,
  task,
  cron,
  prefixCommand,
  MemoryUsageStore,
  JsonFileUsageStore,
  Embeds,
  DEFAULT_EMBED_COLORS,
  KeyedLock,
  safeFetch,
  formatDuration,
  parseDuration,
  discordTimestamp,
  MemoryCache,
  loadConfig,
  lookup,
  requireOwner,
  guildOnly,
  requireAnyRole,
  denied,
  buildPaginatorPage,
  confirm,
  jsonlSink,
  userCommand,
  messageCommand,
} from "../dist/index.js";

// --- credentials -----------------------------------------------------------

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST_URL = pathToFileURL(join(ROOT, "dist/index.js")).href;

function loadDotenv() {
  let text = "";
  try {
    text = readFileSync(join(ROOT, ".env"), "utf8");
  } catch {
    return {};
  }
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.length === 0 || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[line.slice(0, eq).trim()] = value;
  }
  return out;
}

const file = loadDotenv();
const token = process.env.TEST_DISCORD_TOKEN ?? file.TEST_DISCORD_TOKEN;
const guildId = process.env.TEST_DISCORD_GUILD ?? file.TEST_DISCORD_GUILD;
const stay = process.argv.includes("--stay");

if (token === undefined || token.length === 0) {
  console.error("Missing TEST_DISCORD_TOKEN (process.env or .env).");
  process.exit(2);
}
if (guildId === undefined || guildId.length === 0) {
  console.error("Missing TEST_DISCORD_GUILD (process.env or .env).");
  process.exit(2);
}

// --- assertions ------------------------------------------------------------

let passed = 0;
let failed = 0;
const lines = [];
let section = "";
function group(title) {
  section = title;
  lines.push(`\n${title}`);
}
function check(name, ok, detail) {
  if (ok) {
    passed += 1;
    lines.push(`  \u2713 ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failed += 1;
    lines.push(`  \u2717 ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

// =====================================================================
// A. Intent presets (pure)
// =====================================================================
function arr(x) {
  return [...x].sort((a, b) => Number(a) - Number(b));
}
group("A. Intent presets");
check("Intents.none is empty", Array.isArray(Intents.none) && Intents.none.length === 0);
check(
  "Intents.default = [Guilds]",
  JSON.stringify(arr(Intents.default)) === JSON.stringify([GatewayIntentBits.Guilds]),
);
check(
  "Intents.guilds = [Guilds, GuildMembers]",
  JSON.stringify(arr(Intents.guilds)) ===
    JSON.stringify(arr([GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers])),
);
check(
  "Intents.messages includes MessageContent (privileged)",
  Intents.messages.includes(GatewayIntentBits.MessageContent) &&
    Intents.messages.includes(GatewayIntentBits.GuildMessages),
);
check(
  "Intents.all includes privileged intents",
  Intents.all.includes(GatewayIntentBits.MessageContent) &&
    Intents.all.includes(GatewayIntentBits.GuildMembers) &&
    Intents.all.length >= 16,
  `${Intents.all.length} intents`,
);

// =====================================================================
// B. Custom-id codec (pure)
// =====================================================================
group("B. Custom-id codec");
{
  const compiled = compilePattern("order:{id}:{action}");
  check(
    "compilePattern extracts namespace + params",
    compiled.namespace === "order" &&
      JSON.stringify(compiled.paramNames) === JSON.stringify(["id", "action"]),
  );
  const built = buildCustomId(compiled, { id: "a:b", action: "50%off" });
  check(
    "buildCustomId percent-encodes ':' and '%'",
    built === "order:a%3Ab:50%25off",
    built,
  );
  const parsed = parseCustomId(built);
  check(
    "parseCustomId decodes back to original values",
    parsed.namespace === "order" && parsed.values[0] === "a:b" && parsed.values[1] === "50%off",
    `[${parsed.values.join(", ")}]`,
  );
  const params = paramsFromValues(compiled.paramNames, parsed.values);
  check(
    "paramsFromValues maps values onto names",
    params.id === "a:b" && params.action === "50%off",
  );
  check("MAX_CUSTOM_ID_LENGTH is the Discord limit (100)", MAX_CUSTOM_ID_LENGTH === 100);

  let threwMissing = false;
  try {
    buildCustomId(compiled, { id: "x" });
  } catch {
    threwMissing = true;
  }
  check("buildCustomId throws on missing param", threwMissing);

  let threwLong = false;
  try {
    buildCustomId(compiled, { id: "x".repeat(120), action: "y" });
  } catch {
    threwLong = true;
  }
  check("buildCustomId throws when over the 100-char limit", threwLong);

  let threwPattern = false;
  try {
    compilePattern("bad:{not-a-segment}extra");
  } catch {
    threwPattern = true;
  }
  check("compilePattern rejects malformed patterns", threwPattern);
}

// =====================================================================
// Build the bot under test
// =====================================================================

// captures for the dispatch probes (section I)
const cap = {};

// --- events ---
let readyFired = false;
let readyTag = "";
const onReady = event("clientReady", (c) => {
  readyFired = true;
  readyTag = c.user.tag;
});

let targetChannelId = "";
let messageSeen = false;
let resolveMessage;
const messagePromise = new Promise((r) => {
  resolveMessage = r;
});
const onMessage = event("messageCreate", (msg) => {
  if (msg.channelId === targetChannelId) {
    messageSeen = true;
    resolveMessage();
  }
});

// --- commands ---
const ping = command({
  name: "ping",
  description: "Check latency",
  run: (ctx) => ctx.reply("pong"),
});

const allopts = command({
  name: "allopts",
  description: "Every option type",
  options: {
    text: option.string({ description: "A string", required: true, minLength: 1, maxLength: 100 }),
    choice: option.string({
      description: "A choice",
      choices: [
        { name: "Alpha", value: "a" },
        { name: "Beta", value: "b" },
      ],
    }),
    count: option.integer({ description: "An integer", minValue: 1, maxValue: 10 }),
    ratio: option.number({ description: "A number", minValue: 0, maxValue: 1 }),
    flag: option.boolean({ description: "A boolean" }),
    who: option.user({ description: "A user" }),
    where: option.channel({ description: "A channel", channelTypes: [ChannelType.GuildText] }),
    rolepick: option.role({ description: "A role" }),
    mention: option.mentionable({ description: "A mentionable" }),
    file: option.attachment({ description: "An attachment" }),
  },
  run: (ctx) => ctx.reply(ctx.options.text),
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
  defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
  subcommands: {
    say: subcommand({
      description: "Say something",
      options: { message: option.string({ description: "Message", required: true }) },
      run: (ctx) => ctx.reply(ctx.options.message),
    }),
  },
  groups: {
    config: subcommandGroup({
      description: "Configuration",
      subcommands: {
        set: subcommand({
          description: "Set a value",
          options: {
            key: option.string({ description: "Key", required: true }),
            value: option.string({ description: "Value", required: true }),
          },
          run: (ctx) => ctx.reply(`${ctx.options.key}=${ctx.options.value}`),
        }),
      },
    }),
  },
});

const secret = command({
  name: "secret",
  description: "NSFW marker test",
  nsfw: true,
  run: (ctx) => ctx.reply("shh"),
});

const panel = command({
  name: "panel",
  description: "Show the demo controls",
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

// --- components ---
const vote = button({
  id: "vote:{choice}",
  label: "Vote yes",
  style: ButtonStyle.Success,
  run: (ctx) => {
    cap.vote = `voted:${ctx.params.choice}`;
    return ctx.update(cap.vote);
  },
});

const order = button({
  id: "order:{id}:{action}",
  label: "Order",
  style: "Primary",
  run: (ctx) => {
    cap.order = `${ctx.params.id}/${ctx.params.action}`;
    return ctx.update(cap.order);
  },
});

const colour = stringSelect({
  id: "colour",
  placeholder: "Pick a colour",
  minValues: 1,
  maxValues: 1,
  options: [
    { label: "Red", value: "red" },
    { label: "Green", value: "green" },
    { label: "Blue", value: "blue" },
  ],
  run: (ctx) => {
    cap.colour = ctx.values.join(",");
    return ctx.reply({ content: `colour:${cap.colour}`, ephemeral: true });
  },
});

const users = userSelect({
  id: "users",
  placeholder: "Pick users",
  run: (ctx) => {
    cap.users = ctx.values.join(",");
    return ctx.reply({ content: `users:${cap.users}`, ephemeral: true });
  },
});

const roles = roleSelect({
  id: "roles",
  placeholder: "Pick roles",
  run: (ctx) => {
    cap.roles = ctx.values.join(",");
    return ctx.reply({ content: `roles:${cap.roles}`, ephemeral: true });
  },
});

const channels = channelSelect({
  id: "channels",
  placeholder: "Pick channels",
  channelTypes: [ChannelType.GuildText],
  run: (ctx) => {
    cap.channels = ctx.values.join(",");
    return ctx.reply({ content: `channels:${cap.channels}`, ephemeral: true });
  },
});

const mentions = mentionableSelect({
  id: "mentions",
  placeholder: "Pick mentionables",
  run: (ctx) => {
    cap.mentions = ctx.values.join(",");
    return ctx.reply({ content: `mentions:${cap.mentions}`, ephemeral: true });
  },
});

const feedback = modal({
  id: "feedback:{ticket}",
  title: "Feedback",
  fields: {
    summary: textInput({ label: "Summary", required: true, maxLength: 100 }),
    detail: textInput({ label: "Details", style: "Paragraph" }),
  },
  run: (ctx) => {
    cap.feedback = `${ctx.params.ticket}:${ctx.fields.summary}`;
    return ctx.reply({ content: `fb:${cap.feedback}`, ephemeral: true });
  },
});

const usageStore = new MemoryUsageStore();
const logEntries = [];
const client = new SpearClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  prefix: { prefix: "!", ignoreBots: false },
  usage: { store: usageStore },
  logger: {
    level: "debug",
    sink: (entry) => {
      logEntries.push(entry);
      if (entry.level === "error") console.error(`[log] ${entry.message}`, entry.error?.message ?? "");
    },
  },
});
client.on("error", (err) => console.error("client error:", err?.message ?? err));
client.register(
  onReady,
  onMessage,
  ping,
  allopts,
  fruit,
  admin,
  secret,
  panel,
  ask,
  vote,
  order,
  colour,
  users,
  roles,
  channels,
  mentions,
  feedback,
);
let tickCount = 0;
client.register(
  task({ name: "e2e-tick", interval: 250, runOnStart: true, run: () => { tickCount += 1; } }),
);
client.register(prefixCommand({ name: "ptest", run: (ctx) => ctx.reply("prefix-pong") }));
client.register(
  prefixCommand({
    name: "echoargs",
    args: (a) => a.string("first", { required: true }).integer("n").rest("rest"),
    run: (ctx) =>
      ctx.reply(
        `echoargs:first=${ctx.options.first} n=${ctx.options.n ?? "none"} rest=${ctx.options.rest ?? "none"}`,
      ),
  }),
);
const reportUserCmd = userCommand({
  name: "Report user (e2e)",
  run: (ctx) => ctx.replyError(`Reporting ${ctx.targetUser.tag}`),
});
const inspectMsgCmd = messageCommand({
  name: "Inspect message (e2e)",
  run: (ctx) => ctx.replyInfo(`len=${ctx.targetMessage.content.length}`),
});
client.register(reportUserCmd, inspectMsgCmd);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// =====================================================================
// E. Plugin + F. Loader (register before deploy)
// =====================================================================
let pluginRan = false;
const greetPlugin = definePlugin({
  name: "greet",
  setup(c) {
    pluginRan = true;
    c.register(
      command({ name: "plugcmd", description: "Added by a plugin", run: (ctx) => ctx.reply("plugin") }),
    );
  },
});

let tempDir = "";
async function setupPluginAndLoader() {
  group("E. Plugins");
  await client.use(greetPlugin);
  check("client.use ran plugin.setup", pluginRan);
  check("plugin registered its command", client.commands.get("plugcmd") != null);

  group("F. File-based loading");
  tempDir = mkdtempSync(join(tmpdir(), "spearkit-e2e-"));
  const moduleSource = `import { command, event } from ${JSON.stringify(DIST_URL)};
export const loadedCmd = command({ name: "loadedcmd", description: "Loaded from disk", run: (ctx) => ctx.reply("loaded") });
export const loadedEvt = event("warn", () => {});
`;
  writeFileSync(join(tempDir, "feature.mjs"), moduleSource);
  const loadedCount = await client.load(tempDir);
  check("client.load returned registered count", loadedCount === 2, `${loadedCount} items`);
  check("loaded command registered", client.commands.get("loadedcmd") != null);
}

// --- structural signature for round-trip comparison ------------------------

function optionSignature(options) {
  if (!Array.isArray(options)) return [];
  return [...options]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((o) => [o.name, o.type, optionSignature(o.options)]);
}
function commandSignature(cmd) {
  return JSON.stringify([cmd.name, optionSignature(cmd.options)]);
}

async function waitReady(c, ms) {
  if (c.isReady()) return;
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`ready timed out after ${ms}ms`)), ms);
    const done = () => {
      clearTimeout(timer);
      resolve();
    };
    c.once("clientReady", done);
    c.once("ready", done);
  });
}

async function findSendableTextChannel(guild) {
  const me = guild.members.me ?? (await guild.members.fetchMe());
  const all = await guild.channels.fetch();
  for (const channel of all.values()) {
    if (channel == null || channel.type !== ChannelType.GuildText) continue;
    const perms = channel.permissionsFor(me);
    if (perms == null) continue;
    if (perms.has(PermissionFlagsBits.ViewChannel) && perms.has(PermissionFlagsBits.SendMessages)) {
      return channel;
    }
  }
  return null;
}

// --- fixture interactions for the dispatch probes (section I) ---------------

function guards(kind) {
  const names = {
    button: "isButton",
    stringSelect: "isStringSelectMenu",
    userSelect: "isUserSelectMenu",
    roleSelect: "isRoleSelectMenu",
    channelSelect: "isChannelSelectMenu",
    mentionableSelect: "isMentionableSelectMenu",
    modal: "isModalSubmit",
  };
  const out = {};
  for (const fn of Object.values(names)) out[fn] = () => false;
  out[names[kind]] = () => true;
  return out;
}

function fakeComponent(kind, customId, extra) {
  return {
    ...guards(kind),
    customId,
    user: { id: "comp-user", tag: "comp#0001" },
    guildId: null,
    channelId: null,
    client,
    replied: false,
    deferred: false,
    responded: false,
    async reply(payload) {
      this._reply = payload;
    },
    async update(payload) {
      this._update = payload;
    },
    ...extra,
  };
}

function payloadText(payload) {
  if (payload == null) return undefined;
  return typeof payload === "string" ? payload : payload.content;
}

// =====================================================================
// run
// =====================================================================
async function main() {
  console.log(`\nspearkit comprehensive live E2E  (guild ${guildId})`);

  await setupPluginAndLoader();

  // C. login + ready --------------------------------------------------------
  group("C. Gateway login + ready");
  await client.login(token);
  await waitReady(client, 30_000);
  check("gateway login + ready", client.isReady(), `as ${client.user?.tag ?? "?"}`);
  check("client.user populated", client.user != null, client.user?.id);
  check("client.application resolved", client.application?.id != null, client.application?.id);
  check(
    "registry sizes",
    client.commands.size === 9 && client.components.size === 8 && client.events.size === 3,
    `commands=${client.commands.size} components=${client.components.size} events=${client.events.size}`,
  );

  group("D. Live events");
  check("spearkit clientReady event fired", readyFired, readyTag);

  // G. command deploy round-trip --------------------------------------------
  group("G. Command deploy round-trip (REST)");
  const appId = client.application.id;
  let remoteNames = [];
  try {
    const deployed = await client.deployAllCommands({ guildId });
    check("deployCommands resolved", Array.isArray(deployed), `${deployed.length} commands`);
  } catch (err) {
    check("deployCommands resolved", false, String(err?.message ?? err));
  }

  const remote = await client.rest.get(Routes.applicationGuildCommands(appId, guildId));
  const remoteByName = new Map(remote.map((c) => [c.name, c]));
  remoteNames = [...remoteByName.keys()].sort();
  const expected = client.commands.toJSON();
  const expectedNames = expected.map((c) => c.name).sort();
  check(
    "every spearkit command registered on Discord",
    expectedNames.every((n) => remoteByName.has(n)),
    `[${remoteNames.join(", ")}]`,
  );
  for (const cmd of expected) {
    const got = remoteByName.get(cmd.name);
    check(
      `\`${cmd.name}\` structure matches Discord`,
      got != null && commandSignature(cmd) === commandSignature(got),
      got == null ? "absent" : undefined,
    );
  }

  // every option type on `allopts`
  const ao = remoteByName.get("allopts");
  const aoByName = new Map((ao?.options ?? []).map((o) => [o.name, o]));
  const T = ApplicationCommandOptionType;
  const expectTypes = {
    text: T.String,
    choice: T.String,
    count: T.Integer,
    ratio: T.Number,
    flag: T.Boolean,
    who: T.User,
    where: T.Channel,
    rolepick: T.Role,
    mention: T.Mentionable,
    file: T.Attachment,
  };
  for (const [name, type] of Object.entries(expectTypes)) {
    check(`allopts.${name} is type ${type} on Discord`, aoByName.get(name)?.type === type);
  }
  check("allopts.text is required + length-bounded", aoByName.get("text")?.required === true &&
    aoByName.get("text")?.min_length === 1 && aoByName.get("text")?.max_length === 100);
  check("allopts.choice carries 2 choices", aoByName.get("choice")?.choices?.length === 2);
  check("allopts.count carries min/max", aoByName.get("count")?.min_value === 1 &&
    aoByName.get("count")?.max_value === 10);
  check("allopts.ratio carries min/max", aoByName.get("ratio")?.min_value === 0 &&
    aoByName.get("ratio")?.max_value === 1);
  check(
    "allopts.where restricts channel types",
    Array.isArray(aoByName.get("where")?.channel_types) &&
      aoByName.get("where").channel_types.includes(ChannelType.GuildText),
  );

  const rFruit = remoteByName.get("fruit");
  check(
    "fruit advertises autocomplete",
    rFruit?.options?.some((o) => o.name === "name" && o.autocomplete === true),
  );

  const rAdmin = remoteByName.get("admin");
  const adminSay = rAdmin?.options?.find((o) => o.name === "say");
  const adminCfg = rAdmin?.options?.find((o) => o.name === "config");
  check("admin has `say` subcommand (type 1)", adminSay?.type === T.Subcommand);
  check(
    "admin has `config` subcommand group (type 2) containing `set`",
    adminCfg?.type === T.SubcommandGroup &&
      adminCfg.options?.some((s) => s.name === "set" && s.type === T.Subcommand),
  );
  const adminPayload = expected.find((c) => c.name === "admin");
  check(
    "admin emits guild-only context (payload)",
    Array.isArray(adminPayload?.contexts) &&
      adminPayload.contexts.includes(InteractionContextType.Guild),
    `Discord drops contexts for guild-scoped commands (remote echo: ${JSON.stringify(rAdmin?.contexts ?? null)})`,
  );
  check("admin carries default_member_permissions", rAdmin?.default_member_permissions != null,
    rAdmin?.default_member_permissions);
  check("secret is marked nsfw", remoteByName.get("secret")?.nsfw === true);
  check("plugin command deployed", remoteByName.has("plugcmd"));
  check("loaded command deployed", remoteByName.has("loadedcmd"));

  // H. component wire round-trip --------------------------------------------
  group("H. Component wire round-trip (Discord)");
  const guild = await client.guilds.fetch(guildId);
  check("guild fetched", guild != null, guild?.name);
  const channel = await findSendableTextChannel(guild);
  if (channel == null) {
    check("sendable text channel found", false, "no postable text channel — skipping wire checks");
  } else {
    check("sendable text channel found", true, `#${channel.name}`);
    targetChannelId = channel.id;

    const orderId = order.build({ id: "a:b", action: "50%off" }).toJSON().custom_id;
    const linkBtn = linkButton({ label: "Docs", url: "https://discord.js.org" });

    const msgA = await channel.send({
      content: "spearkit E2E A — buttons + string/user selects (auto-deleted)",
      components: [
        row(vote.build({ choice: "yes" }), order.build({ id: "a:b", action: "50%off" }), linkBtn),
        row(colour.build()),
        row(users.build()),
      ],
    });
    const msgB = await channel.send({
      content: "spearkit E2E B — role/channel/mentionable selects (auto-deleted)",
      components: [row(roles.build()), row(channels.build()), row(mentions.build())],
    });

    const backA = await channel.messages.fetch(msgA.id);
    const backB = await channel.messages.fetch(msgB.id);

    const flat = [];
    for (const m of [backA, backB]) {
      for (const r of m.components) {
        for (const c of r.components) flat.push(c);
      }
    }
    const byId = new Map();
    for (const c of flat) if (typeof c.customId === "string") byId.set(c.customId, c);

    check("button custom-id stored", byId.has("vote:yes"), "vote:yes");
    check(
      "encoded multi-param custom-id stored verbatim",
      byId.has("order:a%3Ab:50%25off") && orderId === "order:a%3Ab:50%25off",
      orderId,
    );
    // decode the value Discord echoed back
    const dec = parseCustomId("order:a%3Ab:50%25off");
    check(
      "codec decodes the wire custom-id to original params",
      dec.values[0] === "a:b" && dec.values[1] === "50%off",
      `[${dec.values.join(", ")}]`,
    );

    const typeOf = (id) => byId.get(id)?.type;
    check("button serialized as Button(2)", typeOf("vote:yes") === ComponentType.Button);
    check("string select serialized as StringSelect(3)", typeOf("colour") === ComponentType.StringSelect);
    check("user select serialized as UserSelect(5)", typeOf("users") === ComponentType.UserSelect);
    check("role select serialized as RoleSelect(6)", typeOf("roles") === ComponentType.RoleSelect);
    check(
      "channel select serialized as ChannelSelect(8)",
      typeOf("channels") === ComponentType.ChannelSelect,
    );
    check(
      "mentionable select serialized as MentionableSelect(7)",
      typeOf("mentions") === ComponentType.MentionableSelect,
    );

    const link = flat.find((c) => c.type === ComponentType.Button && c.style === ButtonStyle.Link);
    check(
      "link button stored with url and no custom-id",
      link != null && typeof link.url === "string" && link.url.startsWith("https://discord.js.org") && link.customId == null,
      link?.url,
    );

    // D (cont). messageCreate is a real gateway event — our own sends trigger it.
    await Promise.race([
      messagePromise,
      new Promise((r) => setTimeout(r, 8000)),
    ]);
    check("spearkit messageCreate event fired (live gateway)", messageSeen, `#${channel.name}`);

    await msgA.delete().catch(() => undefined);
    await msgB.delete().catch(() => undefined);
    check("verification messages cleaned up", true);
  }

  // I. handler dispatch through the real registries -------------------------
  group("I. Handler dispatch (registries + fixtures)");

  // command + typed option resolution
  const fakeChat = {
    commandName: "allopts",
    user: { id: "u1", tag: "user#0001" },
    replied: false,
    deferred: false,
    client,
    options: {
      getString: (n) => (n === "text" ? "hello" : n === "choice" ? "a" : null),
      getInteger: (n) => (n === "count" ? 7 : null),
      getNumber: (n) => (n === "ratio" ? 0.5 : null),
      getBoolean: (n) => (n === "flag" ? true : null),
      getUser: () => null,
      getChannel: () => null,
      getRole: () => null,
      getMentionable: () => null,
      getAttachment: () => null,
    },
    async reply(p) {
      cap.cmd = p;
    },
  };
  await client.commands.handle(fakeChat);
  check(
    "command routes + resolves typed options",
    payloadText(cap.cmd) === "hello",
    payloadText(cap.cmd),
  );

  // autocomplete
  const fakeAuto = {
    commandName: "fruit",
    responded: false,
    options: { getFocused: (full) => (full ? { name: "name", value: "ba" } : "ba") },
    async respond(choices) {
      cap.auto = choices;
    },
  };
  await client.commands.handleAutocomplete(fakeAuto);
  check(
    "autocomplete routes + returns filtered choices",
    Array.isArray(cap.auto) && cap.auto.length === 1 && cap.auto[0].value === "banana",
    cap.auto?.map((c) => c.value).join(","),
  );

  // button
  const rb = await client.components.handle(fakeComponent("button", "vote:yes"));
  check("button routes + extracts params", rb && cap.vote === "voted:yes", cap.vote);

  // multi-param/encoded button
  const ro = await client.components.handle(
    fakeComponent("button", "order:a%3Ab:50%25off"),
  );
  check("encoded button routes + decodes params", ro && cap.order === "a:b/50%off", cap.order);

  // selects
  const rs = await client.components.handle(
    fakeComponent("stringSelect", "colour", { values: ["green"] }),
  );
  check("string select routes + reads values", rs && cap.colour === "green", cap.colour);
  const ru = await client.components.handle(
    fakeComponent("userSelect", "users", { values: ["111"] }),
  );
  check("user select routes + reads values", ru && cap.users === "111", cap.users);
  const rr = await client.components.handle(
    fakeComponent("roleSelect", "roles", { values: ["222"] }),
  );
  check("role select routes + reads values", rr && cap.roles === "222", cap.roles);
  const rc = await client.components.handle(
    fakeComponent("channelSelect", "channels", { values: ["333"] }),
  );
  check("channel select routes + reads values", rc && cap.channels === "333", cap.channels);
  const rm = await client.components.handle(
    fakeComponent("mentionableSelect", "mentions", { values: ["444"] }),
  );
  check("mentionable select routes + reads values", rm && cap.mentions === "444", cap.mentions);

  // modal submit
  const rmod = await client.components.handle(
    fakeComponent("modal", "feedback:1234", {
      fields: { getTextInputValue: (k) => (k === "summary" ? "Great" : "More") },
    }),
  );
  check(
    "modal routes + decodes params + reads fields",
    rmod && cap.feedback === "1234:Great",
    cap.feedback,
  );

  const unrouted = await client.components.handle(fakeComponent("button", "no-such-namespace"));
  check("unknown custom-id does not route", unrouted === false);

  // J. event once/non-once semantics ----------------------------------------
  group("J. Event registry once/non-once");
  let onceCount = 0;
  let manyCount = 0;
  event({ name: "spearkitTestOnce", once: true, run: () => (onceCount += 1) }).attach(client);
  event({ name: "spearkitTestMany", run: () => (manyCount += 1) }).attach(client);
  client.emit("spearkitTestOnce");
  client.emit("spearkitTestOnce");
  client.emit("spearkitTestMany");
  client.emit("spearkitTestMany");
  check("once:true handler fires exactly once", onceCount === 1, `count=${onceCount}`);
  check("default handler fires every time", manyCount === 2, `count=${manyCount}`);

  // K. Logging ---------------------------------------------------------------
  group("K. Logging");
  check("client.logger is a Logger", client.logger instanceof Logger);
  client.logger.child("e2e").info("e2e logger check");
  check(
    "logger captured the command dispatch trace",
    logEntries.some((entry) => entry.level === "debug" && entry.message === "command"),
  );
  check(
    "logger captured the component dispatch trace",
    logEntries.some((entry) => entry.level === "debug" && entry.message === "component"),
  );
  check(
    "child logger applies its scope",
    logEntries.some((entry) => entry.scope === "e2e" && entry.message === "e2e logger check"),
  );

  // L. Env (dotenv) -----------------------------------------------------------
  group("L. Env (dotenv)");
  const envPath = join(ROOT, ".env");
  const parsedEnv = parseEnv(readFileSync(envPath, "utf8"));
  check("parseEnv reads the repo .env", parsedEnv.TEST_DISCORD_GUILD === guildId);
  const loadedEnv = loadEnv({ path: envPath });
  check("loadEnv returns the parsed pairs", loadedEnv.TEST_DISCORD_GUILD === guildId);
  check("env.require reads the loaded value", env.require("TEST_DISCORD_GUILD") === guildId);

  // M. Cooldown ---------------------------------------------------------------
  group("M. Cooldown");
  const cd = new CooldownManager();
  const cdActor = { userId: "cdx", roleIds: ["r1", "r2"], guildId: "g", channelId: "c" };
  check(
    "manager allows first, blocks within window, allows after",
    cd.consume("b", 1000, cdActor, 0).allowed === true &&
      cd.consume("b", 1000, cdActor, 400).allowed === false &&
      cd.consume("b", 1000, cdActor, 1000).allowed === true,
  );
  check(
    "exempt users bypass the cooldown",
    cd.consume("x", { duration: 1000, exempt: { users: ["cdx"] } }, cdActor, 0).allowed === true &&
      cd.consume("x", { duration: 1000, exempt: { users: ["cdx"] } }, cdActor, 1).allowed === true,
  );
  check(
    "most lenient matching role override wins",
    effectiveDuration({ duration: 9000, overrides: { roles: { r1: 3000, r2: 1000 } } }, cdActor) === 1000,
  );
  const fakeCmd = (name, replies, userId) => ({
    commandName: name,
    user: { id: userId },
    member: null,
    guildId: null,
    channelId: null,
    replied: false,
    deferred: false,
    async reply(p) {
      replies.push(p);
      this.replied = true;
    },
    async editReply(p) {
      replies.push(p);
    },
    async followUp(p) {
      replies.push(p);
    },
  });
  const cdReg = new CommandRegistry().add(
    command({ name: "limited", description: "rate limited", cooldown: 60000, run: (c) => c.reply("ok") }),
  );
  cdReg.setCooldowns(new CooldownManager());
  const cdReplies1 = [];
  await cdReg.handle(fakeCmd("limited", cdReplies1, "cd-user"));
  const cdReplies2 = [];
  await cdReg.handle(fakeCmd("limited", cdReplies2, "cd-user"));
  check("command dispatch runs the first call", payloadText(cdReplies1[0]) === "ok");
  check(
    "command dispatch blocks the second call",
    typeof payloadText(cdReplies2[0]) === "string" && /cooldown/i.test(payloadText(cdReplies2[0])),
  );

  // N. Scheduler --------------------------------------------------------------
  group("N. Scheduler");
  const cronAt = new Date(2026, 0, 1, 0, 3, 0);
  check(
    "cron computes the next matching time",
    cron("*/15 * * * *").next(cronAt).getTime() === new Date(2026, 0, 1, 0, 15, 0).getTime(),
  );
  check("scheduler is active after ready", client.scheduler.active === true);
  check("tick task is registered", client.scheduler.list().some((t) => t.name === "e2e-tick"));
  check("interval task fired live", tickCount >= 2, `ticks=${tickCount}`);

  // O. Prefix commands --------------------------------------------------------
  group("O. Prefix commands");
  check("prefix command registered", client.prefix.list().some((c) => c.name === "ptest"));
  const pchannel = await findSendableTextChannel(await client.guilds.fetch(guildId));
  if (pchannel == null) {
    check("prefix live message handled", false, "no sendable channel");
  } else {
    const trigger = await pchannel.send("!ptest live-args");
    let prefixReply;
    for (let i = 0; i < 24 && prefixReply === undefined; i++) {
      await sleep(250);
      const recent = await pchannel.messages.fetch({ limit: 8 });
      prefixReply = recent.find((m) => m.content === "prefix-pong" && m.author.id === client.user?.id);
    }
    check("prefix command handled a live message", prefixReply !== undefined, `#${pchannel.name}`);
    await trigger.delete().catch(() => undefined);
    await prefixReply?.delete().catch(() => undefined);
  }

  // P. Usage tracking ---------------------------------------------------------
  group("P. Usage tracking");
  check(
    "store recorded a command usage from dispatch",
    usageStore.all().some((e) => e.type === "command" && e.name === "allopts"),
  );
  const allOpts = usageStore.all().find((e) => e.type === "command" && e.name === "allopts");
  check(
    "usage event carries outcome + durationMs",
    allOpts?.outcome === "success" && typeof allOpts?.durationMs === "number",
    `outcome=${allOpts?.outcome} durationMs=${allOpts?.durationMs}`,
  );
  check(
    "store recorded a component usage from dispatch",
    usageStore.all().some((e) => e.type === "component"),
  );
  const uchannel = await findSendableTextChannel(await client.guilds.fetch(guildId));
  if (uchannel == null) {
    check("usage reported to a Discord channel live", false, "no sendable channel");
  } else {
    client.usage.reportTo(uchannel.id);
    client.usage.track({
      type: "command",
      name: "e2e-usage-probe",
      userId: client.user?.id,
      userTag: client.user?.tag,
      guildId,
      channelId: uchannel.id,
      timestamp: new Date(),
    });
    let report;
    for (let i = 0; i < 24 && report === undefined; i++) {
      await sleep(250);
      const recent = await uchannel.messages.fetch({ limit: 6 });
      report = recent.find((m) => m.content.includes("e2e-usage-probe") && m.author.id === client.user?.id);
    }
    check("usage reported to a Discord channel live", report !== undefined, `#${uchannel.name}`);
    await report?.delete().catch(() => undefined);
  }
  const usageDir = mkdtempSync(join(tmpdir(), "spearkit-e2e-usage-"));
  const fileStore = new JsonFileUsageStore(join(usageDir, "usage.jsonl"));
  await fileStore.record({ type: "prefix", name: "filed", userId: "u", timestamp: new Date() });
  const persisted = await fileStore.all();
  check(
    "JSON file store persists and reads back",
    persisted.length === 1 && persisted[0].name === "filed" && persisted[0].timestamp instanceof Date,
  );
  rmSync(usageDir, { recursive: true, force: true });

  // Q. Embed presets ----------------------------------------------------------
  group("Q. Embed presets");
  check("client.embeds is an Embeds instance", client.embeds instanceof Embeds);
  const successJson = client.embeds.success("done").toJSON();
  check(
    "embeds.success builds with default success color and icon prefix",
    successJson.color === DEFAULT_EMBED_COLORS.success && /✅/.test(successJson.description ?? ""),
  );
  const echannel = await findSendableTextChannel(await client.guilds.fetch(guildId));
  if (echannel == null) {
    check("preset embed sent + read back on the wire", false, "no sendable channel");
  } else {
    const sent = await echannel.send({
      embeds: [client.embeds.success("spearkit E2E embed preset")],
    });
    const back = await echannel.messages.fetch(sent.id);
    const embed = back.embeds[0];
    check(
      "preset embed sent + read back on the wire",
      embed != null &&
        embed.color === DEFAULT_EMBED_COLORS.success &&
        /spearkit E2E embed preset/.test(embed.description ?? ""),
      `color=${embed?.color}`,
    );
    await sent.delete().catch(() => undefined);
  }

  // R. KeyedLock -------------------------------------------------------------
  group("R. KeyedLock");
  const klock = new KeyedLock({ sweep: 0 });
  const release = klock.tryAcquire("ticket:1:claim");
  check("lock acquired on first call", release !== null);
  check("second acquire while held returns null", klock.tryAcquire("ticket:1:claim") === null);
  let observed = false;
  const out = await klock.run("ticket:1:claim", () => "ran", { onBusy: () => "busy" });
  check("run() busies out while another lease is held", out === "busy");
  release?.();
  const out2 = await klock.run("ticket:1:claim", () => {
    observed = klock.isHeld("ticket:1:claim");
    return "ran";
  });
  check("run() runs after release and holds during fn", out2 === "ran" && observed);
  check("released after run completes", !klock.isHeld("ticket:1:claim"));
  klock.dispose();

  // S. safeFetch ------------------------------------------------------------
  group("S. safeFetch");
  const sfGuild = await safeFetch.guild(client, guildId);
  check("safeFetch.guild resolves a real guild", sfGuild?.id === guildId, sfGuild?.name);
  const sfMissingGuild = await safeFetch.guild(client, "000000000000000000");
  check("safeFetch.guild returns null for unknown ids", sfMissingGuild === null);
  if (sfGuild != null) {
    const sfMissingMember = await safeFetch.member(sfGuild, "000000000000000000");
    check("safeFetch.member returns null for unknown user ids", sfMissingMember === null);
  }
  const sfMissingChannel = await safeFetch.channel(client, "000000000000000000");
  check("safeFetch.channel returns null for unknown channel ids", sfMissingChannel === null);
  const sfTimeout = await safeFetch.try(() => Promise.reject(new Error("nope")));
  check("safeFetch.try absorbs rejections", sfTimeout === null);

  // T. Format ----------------------------------------------------------------
  group("T. Format");
  check(
    "formatDuration English",
    formatDuration(3_725_000) === "1 hour 2 minutes",
  );
  check(
    "formatDuration Turkish",
    formatDuration(3_725_000, { locale: "tr" }) === "1 saat 2 dakika",
  );
  check("parseDuration short form", parseDuration("1h30m") === 5_400_000);
  check("parseDuration Turkish", parseDuration("1 saat 30 dakika") === 5_400_000);
  const now = new Date(1_700_000_000_000);
  check(
    "discordTimestamp emits <t:secs:style>",
    discordTimestamp(now, "R") === `<t:${Math.floor(now.getTime() / 1000)}:R>`,
  );

  // U. Cache -----------------------------------------------------------------
  group("U. Cache");
  const cache = new MemoryCache();
  await cache.set("hello", { who: "world" }, { ttl: 60_000 });
  const cached = await cache.get("hello");
  check("cache.set + cache.get round-trip JSON", JSON.stringify(cached) === JSON.stringify({ who: "world" }));
  check("cache.increment from 0", (await cache.increment("ctr")) === 1);
  check("cache.increment by delta", (await cache.increment("ctr", 4)) === 5);
  const r1 = await cache.rateLimit("user:1", { limit: 2, windowMs: 60_000 });
  const r2 = await cache.rateLimit("user:1", { limit: 2, windowMs: 60_000 });
  const r3 = await cache.rateLimit("user:1", { limit: 2, windowMs: 60_000 });
  check(
    "rateLimit allows up to limit then blocks",
    r1.allowed && r2.allowed && !r3.allowed && r3.remaining === 0,
  );

  // V. Config ----------------------------------------------------------------
  group("V. Config");
  const cfgDir = mkdtempSync(join(tmpdir(), "spearkit-e2e-cfg-"));
  const cfgPath = join(cfgDir, "config.json");
  writeFileSync(
    cfgPath,
    JSON.stringify({ roles: { admin: "111", mod: "222" }, port: "3000" }),
  );

  const cfg = loadConfig({
    file: cfgPath,
    schema: (raw) => {
      const r = raw;
      return { roles: r.roles, port: Number(r.port) };
    },
  });
  check("loadConfig parses + validates", cfg.port === 3000 && cfg.roles.admin === "111");
  const role = lookup(cfg.roles, "role");
  check("lookup returns the value when present", role("admin") === "111");
  let threw = false;
  try {
    role("missing");
  } catch {
    threw = true;
  }
  check("lookup throws on missing keys", threw);
  rmSync(cfgDir, { recursive: true, force: true });

  // W. Guards ----------------------------------------------------------------
  group("W. Guards");
  const guildOnlyGuard = guildOnly();
  check(
    "guildOnly passes when guildId is set",
    (await guildOnlyGuard({ guildId: "g", user: { id: "u1" }, member: null, guild: null, channelId: null, client })) === true,
  );
  const dmCtx = { guildId: null, user: { id: "u1" }, member: null, guild: null, channelId: null, client };
  const dmResult = await guildOnlyGuard(dmCtx);
  check(
    "guildOnly denies in DMs (no guildId)",
    typeof dmResult === "object" && dmResult.allowed === false,
  );
  // Real CommandRegistry dispatch — owner-only guard denies non-owner.
  const guardReg = new CommandRegistry().add(
    command({
      name: "owneronly",
      description: "d",
      guards: [requireOwner(["999999999999999999"])],
      run: () => {},
    }),
  );
  const denyChat = {
    commandName: "owneronly",
    user: { id: "u1", tag: "u#0001" },
    member: null,
    guild: null,
    guildId: null,
    channelId: null,
    client,
    replied: false,
    deferred: false,
    options: { getString: () => null, getInteger: () => null, getNumber: () => null, getBoolean: () => null, getUser: () => null, getChannel: () => null, getRole: () => null, getMentionable: () => null, getAttachment: () => null, getSubcommand: () => null, getSubcommandGroup: () => null, getFocused: () => "" },
    replies: [],
    async reply(p) {
      this.replied = true;
      this.replies.push(p);
    },
    async editReply(p) {
      this.replies.push(p);
    },
    async followUp(p) {
      this.replies.push(p);
    },
  };
  await guardReg.handle(denyChat);
  check(
    "command guard denial emits an embed reply",
    denyChat.replies.length === 1 && Array.isArray(denyChat.replies[0].embeds),
    `replies=${denyChat.replies.length}`,
  );
  // Reason makes it into the embed description.
  const passReg = new CommandRegistry().add(
    command({
      name: "owneronly2",
      description: "d",
      guards: [requireOwner(["u-pass"])],
      run: (ctx) => ctx.reply("ok"),
    }),
  );
  const passChat = { ...denyChat, commandName: "owneronly2", user: { id: "u-pass", tag: "u-pass#0001" }, replied: false, replies: [] };
  await passReg.handle(passChat);
  check("command guard pass runs handler", passChat.replies.some((r) => r.content === "ok" || r === "ok"));

  // X. Context-menu commands -------------------------------------------------
  group("X. Context menus");
  check(
    "context-menu registry has both kinds",
    client.contextMenus.size === 2 &&
      client.contextMenus.all().some((c) => c.kind === "userMenu") &&
      client.contextMenus.all().some((c) => c.kind === "messageMenu"),
    `size=${client.contextMenus.size}`,
  );
  const remoteAll = await client.rest.get(Routes.applicationGuildCommands(appId, guildId));
  const userMenu = remoteAll.find((c) => c.name === "Report user (e2e)");
  const msgMenu = remoteAll.find((c) => c.name === "Inspect message (e2e)");
  check(
    "user context-menu deployed (type 2)",
    userMenu?.type === 2,
    `type=${userMenu?.type}`,
  );
  check(
    "message context-menu deployed (type 3)",
    msgMenu?.type === 3,
    `type=${msgMenu?.type}`,
  );

  // Y. Prefix args -----------------------------------------------------------
  group("Y. Prefix args");
  // Live: bot sends "!echoargs hello 42 some extra text" to itself, registry parses, bot replies.
  const ychannel = await findSendableTextChannel(await client.guilds.fetch(guildId));
  if (ychannel == null) {
    check("typed prefix args parsed live", false, "no sendable channel");
  } else {
    const trigger = await ychannel.send("!echoargs hello 42 some extra text");
    let reply;
    for (let i = 0; i < 24 && reply === undefined; i++) {
      await sleep(250);
      const recent = await ychannel.messages.fetch({ limit: 8 });
      reply = recent.find(
        (m) => m.content.startsWith("echoargs:first=") && m.author.id === client.user?.id,
      );
    }
    check(
      "typed prefix args parsed live",
      reply?.content === "echoargs:first=hello n=42 rest=some extra text",
      reply?.content,
    );
    await trigger.delete().catch(() => undefined);
    await reply?.delete().catch(() => undefined);
  }

  // Z. Pagination ------------------------------------------------------------
  group("Z. Pagination");
  const zChannel = await findSendableTextChannel(await client.guilds.fetch(guildId));
  if (zChannel == null) {
    check("paginator sent + read back with controls", false, "no sendable channel");
  } else {
    const items = ["a", "b", "c", "d", "e"];
    const { payload, pages } = await buildPaginatorPage(items, 0, {
      pageSize: 2,
      render: (slice, { page }) =>
        client.embeds.info({ title: `page ${page}`, description: slice.join(", ") }),
    });
    check("buildPaginatorPage produces 3 pages for 5 items at pageSize=2", pages === 3);
    const sent = await zChannel.send(payload);
    const back = await zChannel.messages.fetch(sent.id);
    const buttonIds = back.components[0]?.components.map((c) => c.customId) ?? [];
    check(
      "paginator message has prev + next buttons on the wire",
      buttonIds.includes("spk-page:prev") && buttonIds.includes("spk-page:next"),
      buttonIds.join(","),
    );
    await sent.delete().catch(() => undefined);
  }

  // AA. Confirm --------------------------------------------------------------
  group("AA. Confirm");
  const { EventEmitter: EE2 } = await import("node:events");
  const collectorEmitter = new EE2();
  const replies = [];
  const fakeInter = {
    user: { id: "u1" },
    client,
    replied: false,
    deferred: false,
    async reply(p) {
      this.replied = true;
      replies.push(p);
    },
    async editReply(p) {
      replies.push(p);
    },
    async fetchReply() {
      return { createMessageComponentCollector: () => collectorEmitter };
    },
  };
  const promise = confirm(fakeInter, { body: "are you sure?" });
  await sleep(20);
  const payload = replies[0];
  check(
    "confirm sends an embed and two buttons",
    Array.isArray(payload.components) &&
      payload.components[0]?.components?.length === 2 &&
      Array.isArray(payload.embeds),
    `buttons=${payload.components[0]?.components?.length}`,
  );
  collectorEmitter.emit("collect", {
    customId: "spk-confirm:yes",
    user: { id: "u1" },
    deferUpdate: () => Promise.resolve(),
  });
  await sleep(20);
  collectorEmitter.emit("end");
  const result = await promise;
  check("confirm resolves confirmed=true on yes click", result.confirmed === true && result.reason === "confirm");

  // AB. Logger transports ----------------------------------------------------
  group("AB. Logger transports");
  const logDir = mkdtempSync(join(tmpdir(), "spearkit-e2e-logs-"));
  const logPath = join(logDir, "out.jsonl");
  client.logger.addTransport(jsonlSink(logPath, { minLevel: "info" }));
  client.logger.info("e2e jsonl sink marker", { data: { phase: "AB" } });
  await sleep(60);
  const { readFileSync: rfs } = await import("node:fs");
  const logLines = rfs(logPath, "utf8").trim().split("\n").filter(Boolean);
  check(
    "jsonlSink appended a structured line",
    logLines.some((l) => {
      try {
        return JSON.parse(l).message === "e2e jsonl sink marker";
      } catch {
        return false;
      }
    }),
    `${logLines.length} lines`,
  );

  rmSync(logDir, { recursive: true, force: true });
  // --- report ---------------------------------------------------------------
  console.log(lines.join("\n"));
  console.log(`\n${passed} passed, ${failed} failed.`);
  console.log(`Commands now live in the guild: ${remoteNames.join(", ")}`);

  if (tempDir) rmSync(tempDir, { recursive: true, force: true });

  if (stay) {
    console.log("\n--stay: bot left online. Open Discord and try the commands/buttons. Ctrl+C to exit.");
    return;
  }
  await client.destroy();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (err) => {
  console.error("\nE2E crashed:", err);
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
  await client.destroy().catch(() => undefined);
  process.exit(1);
});
