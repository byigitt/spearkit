/**
 * Graceful shutdown — close cleanly on Ctrl-C or a container stop.
 *
 * `enableGracefulShutdown` runs your hook (flush a database, etc.), then
 * `destroy()` (which stops spearkit's scheduler and the gateway connection),
 * then exits — with a hard timeout so a wedged shutdown can't hang forever.
 */
import { Intents, SpearClient, command } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

client.register(
  command({ name: "ping", description: "Health check", run: (ctx) => ctx.reply("pong") }),
);

async function main(): Promise<void> {
  client.enableGracefulShutdown({
    onShutdown: () => console.log("flushing state before exit…"),
  });
  await client.start();
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

// Start (and register OS signal handlers) only when run directly, not on import.
if (process.argv[1] !== undefined && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  void main();
}
