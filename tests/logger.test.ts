import { describe, expect, it } from "vitest";
import { Logger, type LogEntry, type LogThreshold } from "../src/logger.js";
import { CommandRegistry } from "../src/commands/registry.js";
import { command } from "../src/commands/command.js";
import { fakeChatInput } from "./helpers.js";

function capturing(level: LogThreshold = "debug") {
  const entries: LogEntry[] = [];
  const logger = new Logger({ level, sink: (entry) => entries.push(entry) });
  return { logger, entries };
}

describe("Logger levels", () => {
  it("suppresses entries below the threshold", () => {
    const { logger, entries } = capturing("warn");
    logger.debug("d");
    logger.info("i");
    logger.warn("w");
    logger.error("e");
    expect(entries.map((entry) => entry.level)).toEqual(["warn", "error"]);
  });

  it("reports enabled() per level", () => {
    const { logger } = capturing("info");
    expect(logger.enabled("debug")).toBe(false);
    expect(logger.enabled("info")).toBe(true);
    expect(logger.enabled("error")).toBe(true);
  });

  it("silent suppresses everything", () => {
    const { logger, entries } = capturing("silent");
    logger.error("nope");
    expect(entries).toHaveLength(0);
  });
});

describe("Logger scope", () => {
  it("applies a scope and nests child scopes", () => {
    const { logger, entries } = capturing();
    logger.info("root");
    logger.child("commands").info("one");
    logger.child("a").child("b").info("two");
    expect(entries.map((entry) => entry.scope)).toEqual([undefined, "commands", "a:b"]);
  });

  it("propagates setLevel to children sharing state", () => {
    const { logger, entries } = capturing("debug");
    const child = logger.child("x");
    logger.setLevel("error");
    child.debug("hidden");
    child.error("shown");
    expect(entries.map((entry) => entry.message)).toEqual(["shown"]);
  });
});

describe("Logger payload", () => {
  it("attaches error and data", () => {
    const { logger, entries } = capturing();
    const boom = new Error("boom");
    logger.error("failed", { error: boom, data: { command: "ping", attempt: 2 } });
    expect(entries).toHaveLength(1);
    expect(entries[0]?.error).toBe(boom);
    expect(entries[0]?.data).toEqual({ command: "ping", attempt: 2 });
  });
});

describe("registry tracing", () => {
  it("emits a debug trace when a command is dispatched", async () => {
    const { logger, entries } = capturing("debug");
    const reg = new CommandRegistry().add(
      command({ name: "ping", description: "d", run: (ctx) => ctx.reply("pong") }),
    );
    reg.setLogger(logger);
    const { interaction } = fakeChatInput({ commandName: "ping" });
    await reg.handle(interaction);
    const trace = entries.find((entry) => entry.message === "command");
    expect(trace?.level).toBe("debug");
    expect(trace?.data).toEqual({ command: "ping", user: "u1" });
  });
});
