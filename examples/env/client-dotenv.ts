/**
 * Env — the client auto-loads .env on start via the `dotenv` option.
 *
 * Run with: npx tsx examples/env/client-dotenv.ts
 * (Put DISCORD_TOKEN in a .env.local next to where you run this.)
 */
import { SpearClient } from "spearkit";

// `dotenv` controls the auto-load on start():
//   true  (default) -> load ./.env
//   false           -> skip; use process.env as-is
//   { path?, override? } -> same shape as loadEnv's options
const client = new SpearClient({
  dotenv: { path: ".env.local", override: false },
});

async function main(): Promise<void> {
  // start() runs the configured loadEnv first, then logs in with the resulting
  // DISCORD_TOKEN — no need to pass the token explicitly.
  await client.start();
  client.logger.info("logged in via .env.local");
}

void main();
