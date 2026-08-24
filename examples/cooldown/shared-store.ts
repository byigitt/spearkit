/**
 * Share cooldowns across processes with Redis SET NX PX.
 *
 * This file uses an in-process stand-in so the example stays dependency-free.
 * Swap `redis` for `createClient()` from the `redis` package in production.
 */
import {
  Intents,
  SpearClient,
  command,
  redisCooldownBackend,
  type RedisCommands,
  type RedisSetOptions,
} from "spearkit";

const memory = new Map<string, { value: string; expiresAt?: number }>();

const redis: RedisCommands = {
  async get(key) {
    const row = memory.get(key);
    if (row === undefined) return null;
    if (row.expiresAt !== undefined && row.expiresAt <= Date.now()) {
      memory.delete(key);
      return null;
    }
    return row.value;
  },
  async set(key, value, options?: RedisSetOptions) {
    const existing = await this.get(key);
    if (options?.NX === true && existing !== null) return null;
    memory.set(key, {
      value,
      expiresAt: options?.PX === undefined ? undefined : Date.now() + options.PX,
    });
    return "OK";
  },
  async del(key) {
    const keys = typeof key === "string" ? [key] : [...key];
    let removed = 0;
    for (const item of keys) {
      if (memory.delete(item)) removed += 1;
    }
    return removed;
  },
  async keys(pattern) {
    const prefix = pattern.endsWith("*") ? pattern.slice(0, -1) : pattern;
    return [...memory.keys()].filter((key) => key.startsWith(prefix));
  },
  async pttl(key) {
    const row = memory.get(key);
    if (row === undefined) return -2;
    if (row.expiresAt === undefined) return -1;
    return Math.max(0, row.expiresAt - Date.now());
  },
};

const client = new SpearClient({
  intents: Intents.default,
  cooldownStore: redisCooldownBackend(redis),
});

export const daily = command({
  name: "daily",
  description: "Claim a daily reward",
  cooldown: 86_400_000,
  run: (ctx) => ctx.reply("Claimed."),
});

client.register(daily);

async function main(): Promise<void> {
  await client.start();
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

void main();
