import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Logger,
  consoleSink,
  jsonlSink,
  webhookSink,
  type LogEntry,
  type LogSink,
  type LogThreshold,
} from "../src/logger.js";
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

describe("transports", () => {
  it("calls every configured transport", () => {
    const a: LogEntry[] = [];
    const b: LogEntry[] = [];
    const log = new Logger({
      level: "debug",
      transports: [
        (entry) => a.push(entry),
        (entry) => b.push(entry),
      ],
    });
    log.info("hi");
    expect(a).toHaveLength(1);
    expect(b).toHaveLength(1);
  });

  it("isolates a thrown transport — others still receive the entry", () => {
    const out: LogEntry[] = [];
    const log = new Logger({
      level: "debug",
      transports: [
        () => {
          throw new Error("oops");
        },
        (entry) => out.push(entry),
      ],
    });
    log.info("hi");
    expect(out).toHaveLength(1);
  });

  it("addTransport appends; setTransports replaces", () => {
    const a: LogEntry[] = [];
    const b: LogEntry[] = [];
    const log = new Logger({ level: "debug", transports: [(e) => a.push(e)] });
    log.addTransport((e) => b.push(e));
    log.info("first");
    expect(a).toHaveLength(1);
    expect(b).toHaveLength(1);
    log.setTransports([(e) => a.push(e)]);
    log.info("second");
    expect(a).toHaveLength(2);
    expect(b).toHaveLength(1);
  });

  it("jsonlSink writes one JSON line per entry above minLevel", async () => {
    const dir = mkdtempSync(join(tmpdir(), "spearkit-logsink-"));
    const path = join(dir, "nested", "log.jsonl");
    try {
      const log = new Logger({ level: "debug", transports: [jsonlSink(path, { minLevel: "warn" })] });
      log.debug("skipped"); // below min
      log.info("skipped too"); // below min
      log.warn("captured");
      log.error("boom", { error: new Error("nope") });
      await new Promise((r) => setTimeout(r, 30));
      const lines = readFileSync(path, "utf8").trim().split("\n");
      expect(lines).toHaveLength(2);
      const parsed = lines.map((l) => JSON.parse(l) as { level: string; message: string; error?: { message: string } });
      expect(parsed.map((p) => p.level)).toEqual(["warn", "error"]);
      expect(parsed[1]?.error?.message).toBe("nope");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("webhookSink POSTs to the url for entries at/above minLevel", async () => {
    const calls: { url: string; body: unknown }[] = [];
    const realFetch = globalThis.fetch;
    globalThis.fetch = (async (url: string | URL, init?: { body?: string }) => {
      calls.push({ url: String(url), body: JSON.parse(init?.body ?? "{}") });
      return new Response("", { status: 204 });
    }) as never;
    try {
      const log = new Logger({
        level: "debug",
        transports: [webhookSink({ url: "https://example.invalid/webhook", minLevel: "error" })],
      });
      log.warn("not posted");
      log.error("posted", { error: new Error("boom") });
      await new Promise((r) => setTimeout(r, 20));
      expect(calls).toHaveLength(1);
      expect(calls[0]?.url).toBe("https://example.invalid/webhook");
      const body = calls[0]?.body as { embeds: { title: string }[] };
      expect(body.embeds[0]?.title).toContain("ERROR");
    } finally {
      globalThis.fetch = realFetch;
    }
  });
});