/**
 * Runtime i18n — Discord locale with an async per-guild override.
 */
import {
  Intents,
  MemoryStore,
  SpearClient,
  command,
  createI18n,
  createSettings,
} from "spearkit";

const languages = createSettings({
  store: new MemoryStore(),
  defaults: { locale: null as string | null },
  namespace: "language",
});

const i18n = createI18n({
  defaultLocale: "en-US",
  messages: {
    "en-US": { "ping.reply": "Pong! {ms}ms" },
    tr: { "ping.reply": "Pong! {ms}ms" },
  },
  resolveLocale: async ({ guildId }) =>
    guildId ? (await languages.get(guildId)).locale : null,
});

const client = new SpearClient({ intents: Intents.default, i18n });

export const ping = command({
  name: "ping",
  description: "Check latency",
  run: async (ctx) =>
    ctx.reply(
      await ctx.t("ping.reply", {
        ms: ctx.client.ws.ping,
      }),
    ),
});

client.register(ping);

async function main(): Promise<void> {
  await client.start();
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

void main();
