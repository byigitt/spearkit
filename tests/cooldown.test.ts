import { describe, expect, it } from "vitest";
import {
  CooldownManager,
  effectiveDuration,
  formatCooldownMessage,
  keyValueCooldownBackend,
  normalizeCooldown,
  redisCooldownBackend,
  type CooldownActor,
} from "../src/cooldown.js";
import { MemoryStore } from "../src/store.js";
import { SqliteStore } from "../src/sqlite-store.js";
import type { RedisCommands, RedisSetOptions } from "../src/redis-store.js";
import { CommandRegistry } from "../src/commands/registry.js";
import { command } from "../src/commands/command.js";
import { fakeChatInput } from "./helpers.js";

const actor: CooldownActor = { userId: "u1", roleIds: ["r1", "r2"], guildId: "g1", channelId: "c1" };

describe("normalizeCooldown", () => {
  it("treats a number as a duration", () => {
    expect(normalizeCooldown(500)).toEqual({ duration: 500 });
    expect(normalizeCooldown({ duration: 1, scope: "guild" })).toEqual({ duration: 1, scope: "guild" });
  });
});

describe("CooldownManager.consume", () => {
  it("allows, then blocks within the window, then allows again", async () => {
    const cd = new CooldownManager();
    expect(await cd.consume("b", 1000, actor, 0)).toEqual({ allowed: true });
    const blocked = await cd.consume("b", 1000, actor, 400);
    expect(blocked).toEqual({ allowed: false, remaining: 600 });
    expect(await cd.consume("b", 1000, actor, 1000)).toEqual({ allowed: true });
  });

  it("keys separately per scope", async () => {
    const cd = new CooldownManager();
    const other: CooldownActor = { ...actor, userId: "u2" };
    await cd.consume("b", { duration: 1000, scope: "guild" }, actor, 0);
    expect((await cd.consume("b", { duration: 1000, scope: "guild" }, other, 100)).allowed).toBe(false);
    expect((await cd.consume("b", { duration: 1000, scope: "user" }, other, 100)).allowed).toBe(true);
  });

  it("peek does not record", async () => {
    const cd = new CooldownManager();
    expect((await cd.peek("b", 1000, actor, 0)).allowed).toBe(true);
    expect((await cd.consume("b", 1000, actor, 0)).allowed).toBe(true);
    expect((await cd.peek("b", 1000, actor, 100)).allowed).toBe(false);
  });

  it("reset clears a bucket", async () => {
    const cd = new CooldownManager();
    await cd.consume("b", 1000, actor, 0);
    expect((await cd.consume("b", 1000, actor, 100)).allowed).toBe(false);
    expect(await cd.reset("b", actor, "user")).toBe(true);
    expect((await cd.consume("b", 1000, actor, 100)).allowed).toBe(true);
  });
});

describe("effectiveDuration", () => {
  it("exempts users and roles", () => {
    expect(effectiveDuration({ duration: 1000, exempt: { users: ["u1"] } }, actor)).toBeNull();
    expect(effectiveDuration({ duration: 1000, exempt: { roles: ["r2"] } }, actor)).toBeNull();
  });

  it("applies user override over role override", () => {
    const config = { duration: 9000, overrides: { users: { u1: 500 }, roles: { r1: 2000 } } };
    expect(effectiveDuration(config, actor)).toBe(500);
  });

  it("picks the most lenient matching role override", () => {
    const config = { duration: 9000, overrides: { roles: { r1: 3000, r2: 1000 } } };
    expect(effectiveDuration(config, actor)).toBe(1000);
  });

  it("falls back to the base duration", () => {
    expect(effectiveDuration({ duration: 1234 }, actor)).toBe(1234);
  });
});

describe("formatCooldownMessage", () => {
  it("uses string, function, or a default", () => {
    expect(formatCooldownMessage({ duration: 1, message: "wait" }, 500)).toBe("wait");
    expect(formatCooldownMessage({ duration: 1, message: (ms) => `${ms}ms` }, 500)).toBe("500ms");
    expect(formatCooldownMessage({ duration: 1 }, 1500)).toMatch(/2s/);
  });
});

describe("command dispatch enforces cooldown", () => {
  it("runs the first call and blocks the second", async () => {
    const reg = new CommandRegistry().add(
      command({ name: "ping", description: "d", cooldown: 60_000, run: (ctx) => ctx.reply("pong") }),
    );
    reg.setCooldowns(new CooldownManager());

    const first = fakeChatInput({ commandName: "ping" });
    await reg.handle(first.interaction);
    const second = fakeChatInput({ commandName: "ping" });
    await reg.handle(second.interaction);

    expect(first.capture.replies).toEqual([{ content: "pong" }]);
    expect(second.capture.replies).toHaveLength(1);
    const blocked = second.capture.replies[0] as { content: string };
    expect(blocked.content).toMatch(/cooldown/i);
  });

  it("does not enforce a cooldown when none is configured", async () => {
    const reg = new CommandRegistry().add(
      command({ name: "free", description: "d", run: (ctx) => ctx.reply("ok") }),
    );
    reg.setCooldowns(new CooldownManager());
    const a = fakeChatInput({ commandName: "free" });
    await reg.handle(a.interaction);
    const b = fakeChatInput({ commandName: "free" });
    await reg.handle(b.interaction);
    expect(a.capture.replies).toEqual([{ content: "ok" }]);
    expect(b.capture.replies).toEqual([{ content: "ok" }]);
  });
});

class MemoryRedis implements RedisCommands {
  private readonly data = new Map<string, { value: string; expiresAt?: number }>();

  private live(key: string): { value: string; expiresAt?: number } | undefined {
    const row = this.data.get(key);
    if (row === undefined) return undefined;
    if (row.expiresAt !== undefined && row.expiresAt <= Date.now()) {
      this.data.delete(key);
      return undefined;
    }
    return row;
  }

  async get(key: string): Promise<string | null> {
    return this.live(key)?.value ?? null;
  }

  async set(key: string, value: string, options?: RedisSetOptions): Promise<unknown> {
    if (options?.NX === true && this.live(key) !== undefined) return null;
    this.data.set(key, {
      value,
      expiresAt: options?.PX === undefined ? undefined : Date.now() + options.PX,
    });
    return "OK";
  }

  async del(key: string | readonly string[]): Promise<number> {
    const keys = typeof key === "string" ? [key] : key;
    let removed = 0;
    for (const item of keys) {
      if (this.data.delete(item)) removed += 1;
    }
    return removed;
  }

  async keys(pattern: string): Promise<string[]> {
    const prefix = pattern.endsWith("*") ? pattern.slice(0, -1) : pattern;
    return [...this.data.keys()].filter(
      (key) => this.live(key) !== undefined && key.startsWith(prefix),
    );
  }

  async pttl(key: string): Promise<number> {
    const row = this.live(key);
    if (row === undefined) return -2;
    if (row.expiresAt === undefined) return -1;
    return Math.max(0, row.expiresAt - Date.now());
  }
}

describe("shared cooldown backends", () => {
  it("shares last-hit timestamps across managers on a KeyValueStore", async () => {
    const store = new MemoryStore();
    const a = new CooldownManager(store);
    const b = new CooldownManager(keyValueCooldownBackend(store));
    expect(await a.consume("daily", 60_000, actor, 0)).toEqual({ allowed: true });
    expect(await b.consume("daily", 60_000, actor, 100)).toEqual({
      allowed: false,
      remaining: 59_900,
    });
  });

  it("shares sqlite-backed cooldowns across managers", async () => {
    const store = new SqliteStore(":memory:");
    const a = new CooldownManager(store);
    const b = new CooldownManager(store);
    expect((await a.consume("vote", 5_000, actor, 10)).allowed).toBe(true);
    expect((await b.consume("vote", 5_000, actor, 20)).allowed).toBe(false);
  });

  it("uses Redis SET NX so a second shard is blocked", async () => {
    const redis = new MemoryRedis();
    const a = new CooldownManager(redisCooldownBackend(redis));
    const b = new CooldownManager(redisCooldownBackend(redis));
    expect((await a.consume("spin", 5_000, actor)).allowed).toBe(true);
    const blocked = await b.consume("spin", 5_000, actor);
    expect(blocked.allowed).toBe(false);
  });
});
