/**
 * Env — load a .env file, then read typed values out of process.env.
 *
 * Run with: npx tsx examples/env/load-and-read.ts
 * (Create a .env with DISCORD_TOKEN, PORT, and DEBUG to see real values.)
 */
import { loadEnv, env } from "spearkit";

// Merge .env into process.env. Existing vars win unless { override: true }.
// A missing file is ignored (returns {}), so this is always safe to call.
const parsed = loadEnv(); // reads ./.env
console.log(`loaded ${Object.keys(parsed).length} key(s) from .env`);

// `require` throws a descriptive error if the variable is missing or empty.
const token = env.require("DISCORD_TOKEN"); // string

// `number` coerces and falls back when missing or non-numeric.
const port = env.number("PORT", 3000); // number

// `boolean` reads true/1/yes/on vs false/0/no/off (case-insensitive).
const debug = env.boolean("DEBUG", false); // boolean

console.log(`token length: ${token.length}, port: ${port}, debug: ${debug}`);
