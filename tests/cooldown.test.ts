import { describe, expect, it } from "vitest";
import {
  CooldownManager,
  effectiveDuration,
  formatCooldownMessage,
  normalizeCooldown,
  type CooldownActor,
} from "../src/cooldown.js";
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
  it("allows, then blocks within the window, then allows again", () => {
    const cd = new CooldownManager();
    expect(cd.consume("b", 1000, actor, 0)).toEqual({ allowed: true });
    const blocked = cd.consume("b", 1000, actor, 400);
    expect(blocked).toEqual({ allowed: false, remaining: 600 });
    expect(cd.consume("b", 1000, actor, 1000)).toEqual({ allowed: true });
  });

  it("keys separately per scope", () => {
    const cd = new CooldownManager();
    const other: CooldownActor = { ...actor, userId: "u2" };
    cd.consume("b", { duration: 1000, scope: "guild" }, actor, 0);
    // same guild, different user -> still blocked under guild scope
    expect(cd.consume("b", { duration: 1000, scope: "guild" }, other, 100).allowed).toBe(false);
    // user scope keys on the user, so u2 is free
    expect(cd.consume("b", { duration: 1000, scope: "user" }, other, 100).allowed).toBe(true);
  });

  it("peek does not record", () => {
    const cd = new CooldownManager();
    expect(cd.peek("b", 1000, actor, 0).allowed).toBe(true);
    expect(cd.consume("b", 1000, actor, 0).allowed).toBe(true);
    expect(cd.peek("b", 1000, actor, 100).allowed).toBe(false);
  });

  it("reset clears a bucket", () => {
    const cd = new CooldownManager();
    cd.consume("b", 1000, actor, 0);
    expect(cd.consume("b", 1000, actor, 100).allowed).toBe(false);
    expect(cd.reset("b", actor, "user")).toBe(true);
    expect(cd.consume("b", 1000, actor, 100).allowed).toBe(true);
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
