/**
 * Logging — the client's logger and the `logger` construction option.
 *
 * Run with: DISCORD_TOKEN=... npx tsx examples/logging/client-logger.ts
 */
import { SpearClient, command, event } from "spearkit";

// `logger` accepts LoggerOptions (built into a Logger) or a Logger instance.
// At level "debug" you also see spearkit's own dispatch traces.
const client = new SpearClient({ logger: { level: "debug" } });

// `client.logger` is shared across spearkit and available to your code.
const ping = command({
  name: "ping",
  description: "Check that the bot is alive",
  run: (ctx) => {
    client.logger.child("ping").info("handled", {
      data: { user: ctx.user.id, ms: ctx.client.ws.ping },
    });
    return ctx.reply(`Pong! ${ctx.client.ws.ping}ms`);
  },
});

const ready = event("clientReady", (c) => {
  client.logger.info("online", { data: { tag: c.user.tag } });
});

client.register(ping, ready);

async function main(): Promise<void> {
  client.logger.info("logging in");
  await client.start(); // reads DISCORD_TOKEN from .env
}

void main();
