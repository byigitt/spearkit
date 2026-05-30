/**
 * Plugins — installing them.
 *
 * `client.use(...plugins)` runs each plugin's setup in order (awaiting async
 * ones) before you start the client.
 */
import { Intents, SpearClient } from "spearkit";
import { moderation, tags } from "./moderation.js";

const client = new SpearClient({ intents: Intents.default });

async function main(): Promise<void> {
  await client.use(moderation, tags); // installs every plugin
  await client.start();
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

void main();
