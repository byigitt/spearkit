/**
 * Client-wide guards — applied before every command/component/prefix handler.
 * Per-handler guards run AFTER, so the per-handler list extends the defaults.
 *
 *   DISCORD_TOKEN=... npx tsx examples/guards/client-wide.ts
 */
import {
  SpearClient,
  Intents,
  command,
  guildOnly,
  requireAnyRole,
} from "spearkit";

const ADMIN_ROLES = ["111111111111111111", "222222222222222222"];

const client = new SpearClient({
  intents: Intents.guilds,
  // Every command/component/prefix dispatch must come from a guild AND from a
  // member with one of these roles. The denial reply is a red embed.
  guards: [guildOnly(), requireAnyRole(ADMIN_ROLES, "Admins only.")],
});

client.register(
  command({ name: "ping", description: "Check latency", run: (c) => c.reply("pong") }),
);

async function main(): Promise<void> {
  await client.start();
}

void main();
