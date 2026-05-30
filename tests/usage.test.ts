import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { SpearClient } from "../src/client.js";
import {
  JsonFileUsageStore,
  MemoryUsageStore,
  UsageTracker,
  formatUsage,
  type UsageEvent,
} from "../src/usage.js";
import { CommandRegistry } from "../src/commands/registry.js";
import { command } from "../src/commands/command.js";
import { fakeChatInput } from "./helpers.js";

const tick = () => new Promise((resolve) => setTimeout(resolve, 5));

function ev(over: Partial<UsageEvent> = {}): UsageEvent {
  return {
    type: "command",
    name: "ping",
    userId: "u1",
    userTag: "user#0001",
    guildId: "g1",
    channelId: "c1",
    timestamp: new Date(),
    ...over,
  };
}

describe("MemoryUsageStore", () => {
  it("records, queries by user and clears", () => {
    const store = new MemoryUsageStore();
    store.record(ev());
    store.record(ev({ userId: "u2", name: "echo" }));
    expect(store.size).toBe(2);
    expect(store.byUser("u1").map((e) => e.name)).toEqual(["ping"]);
    store.clear();
    expect(store.size).toBe(0);
  });

  it("honours a capacity limit", () => {
    const store = new MemoryUsageStore(2);
    store.record(ev({ name: "a" }));
    store.record(ev({ name: "b" }));
    store.record(ev({ name: "c" }));
    expect(store.all().map((e) => e.name)).toEqual(["b", "c"]);
  });
});

describe("JsonFileUsageStore", () => {
  it("appends and reads back events with Date timestamps", async () => {
    const dir = mkdtempSync(join(tmpdir(), "spearkit-usage-"));
    const store = new JsonFileUsageStore(join(dir, "nested", "usage.jsonl"));
    try {
      await store.record(ev({ name: "one" }));
      await store.record(ev({ name: "two", userId: "u9" }));
      const all = await store.all();
      expect(all.map((e) => e.name)).toEqual(["one", "two"]);
      expect(all[0]?.timestamp).toBeInstanceOf(Date);
      expect(all[1]?.userId).toBe("u9");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("returns [] for a missing file", async () => {
    const store = new JsonFileUsageStore(join(tmpdir(), "missing-spearkit-usage.jsonl"));
    expect(await store.all()).toEqual([]);
  });
});

describe("formatUsage", () => {
  it("renders a readable line", () => {
    const line = formatUsage(ev({ type: "command", name: "ping", userTag: "user#0001" }));
    expect(line).toContain("command");
    expect(line).toContain("ping");
    expect(line).toContain("user#0001");
  });
});

describe("UsageTracker", () => {
  it("does nothing when no store or reporter is set", async () => {
    const tracker = new UsageTracker();
    expect(tracker.enabled).toBe(false);
    tracker.track(ev());
    await tick();
    // no throw, no store — nothing to assert beyond it being a no-op
    expect(tracker.enabled).toBe(false);
  });

  it("records to its store", async () => {
    const store = new MemoryUsageStore();
    const tracker = new UsageTracker().setStore(store);
    tracker.track(ev({ name: "recorded" }));
    await tick();
    expect(store.all().map((e) => e.name)).toEqual(["recorded"]);
  });

  it("reports to a Discord channel", async () => {
    const sent: string[] = [];
    const channel = {
      send(content: string) {
        sent.push(content);
        return Promise.resolve({});
      },
    };
    const client = {
      channels: {
        cache: { get: () => undefined },
        fetch: () => Promise.resolve(channel),
      },
    } as unknown as SpearClient;
    const tracker = new UsageTracker().setClient(client).reportTo("123");
    tracker.track(ev({ name: "reported" }));
    await tick();
    expect(sent).toHaveLength(1);
    expect(sent[0]).toContain("reported");
  });
});

describe("command dispatch emits usage", () => {
  it("calls the usage hook after a successful run", async () => {
    const events: UsageEvent[] = [];
    const reg = new CommandRegistry().add(
      command({ name: "ping", description: "d", run: (ctx) => ctx.reply("pong") }),
    );
    reg.setUsageHook((event) => events.push(event));
    await reg.handle(fakeChatInput({ commandName: "ping" }).interaction);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: "command", name: "ping", userId: "u1" });
  });

  it("emits usage with outcome 'error' and errorMessage when the command throws", async () => {
    const events: UsageEvent[] = [];
    const reg = new CommandRegistry().add(
      command({
        name: "boom",
        description: "d",
        run: () => {
          throw new Error("nope");
        },
      }),
    );
    reg.setUsageHook((event) => events.push(event));
    await reg.handle(fakeChatInput({ commandName: "boom" }).interaction);
    expect(events).toHaveLength(1);
    expect(events[0]?.outcome).toBe("error");
    expect(events[0]?.errorMessage).toBe("nope");
    expect(typeof events[0]?.durationMs).toBe("number");
  });

  it("emits usage with outcome 'success' and durationMs on a clean run", async () => {
    const events: UsageEvent[] = [];
    const reg = new CommandRegistry().add(
      command({ name: "ok", description: "d", run: (ctx) => ctx.reply("ok") }),
    );
    reg.setUsageHook((event) => events.push(event));
    await reg.handle(fakeChatInput({ commandName: "ok" }).interaction);
    expect(events[0]?.outcome).toBe("success");
    expect(typeof events[0]?.durationMs).toBe("number");
  });
});
