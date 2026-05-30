/**
 * File-based loading — one command/event/component per file.
 *
 * `client.load(dir)` imports a directory and registers every command, event and
 * component it exports. It imports COMPILED JavaScript, so build first, then run
 * the emitted index.js.
 *
 *   npx tsc && node dist/examples/file-based-loading/index.js
 */
import { fileURLToPath } from "node:url";
import { Intents, SpearClient } from "spearkit";

const here = fileURLToPath(new URL(".", import.meta.url));

async function main(): Promise<void> {
  const client = new SpearClient({ intents: Intents.default });

  const loaded =
    (await client.load(`${here}commands`)) +
    (await client.load(`${here}events`)) +
    (await client.load(`${here}components`));
  console.log(`Loaded ${loaded} modules.`);

  await client.start();
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

void main();
