import { describe, expect, it } from "vitest";
import { CronExpression, cron, task } from "../src/scheduler.js";
import { SpearClient } from "../src/client.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("CronExpression.next", () => {
  it("steps to the next matching minute", () => {
    const at = new Date(2026, 0, 1, 0, 2, 30);
    expect(cron("*/5 * * * *").next(at)).toEqual(new Date(2026, 0, 1, 0, 5, 0));
  });

  it("rolls to the next day for a daily expression", () => {
    const at = new Date(2026, 0, 1, 12, 0, 0);
    expect(cron("0 0 * * *").next(at)).toEqual(new Date(2026, 0, 2, 0, 0, 0));
  });

  it("supports @daily and @hourly aliases", () => {
    const at = new Date(2026, 0, 1, 12, 30, 0);
    expect(cron("@daily").next(at)).toEqual(new Date(2026, 0, 2, 0, 0, 0));
    expect(cron("@hourly").next(at)).toEqual(new Date(2026, 0, 1, 13, 0, 0));
  });

  it("matches a specific weekday (Monday)", () => {
    // 2026-01-01 is a Thursday; the next Monday is 2026-01-05.
    const at = new Date(2026, 0, 1, 0, 0, 0);
    expect(cron("0 0 * * 1").next(at)).toEqual(new Date(2026, 0, 5, 0, 0, 0));
  });

  it("uses OR semantics when both day-of-month and day-of-week are set", () => {
    // "day 1 OR Monday" — from Jan 2 (Fri), next is Jan 5 (Mon).
    const at = new Date(2026, 0, 2, 0, 0, 0);
    expect(cron("0 0 1 * 1").next(at)).toEqual(new Date(2026, 0, 5, 0, 0, 0));
  });

  it("rejects malformed expressions", () => {
    expect(() => new CronExpression("* * *")).toThrow(/5 fields/);
    expect(() => new CronExpression("60 * * * *")).toThrow(/out of range/);
    expect(() => new CronExpression("*/0 * * * *")).toThrow(/invalid step/);
  });
});

describe("task", () => {
  it("requires a cron or interval", () => {
    expect(() => task({ name: "x", run: () => {} })).toThrow(/cron expression or an interval/);
  });

  it("compiles a cron and keeps an interval", () => {
    expect(task({ name: "c", cron: "@daily", run: () => {} }).cron).toBeInstanceOf(CronExpression);
    expect(task({ name: "i", interval: 1000, run: () => {} }).interval).toBe(1000);
  });
});

describe("TaskScheduler runtime", () => {
  it("runs runOnStart immediately and fires on interval until stopped", async () => {
    const client = new SpearClient({ intents: [], logger: { level: "silent" } });
    let count = 0;
    client.scheduler.add(task({ name: "tick", interval: 20, runOnStart: true, run: () => void count++ }));
    expect(client.scheduler.size).toBe(1);

    client.scheduler.start(client);
    expect(count).toBe(1); // runOnStart fired synchronously
    await sleep(75);
    const afterRun = count;
    expect(afterRun).toBeGreaterThanOrEqual(3); // ~ every 20ms

    client.scheduler.stop();
    await sleep(50);
    expect(count).toBe(afterRun); // no more ticks after stop
  });

  it("client.schedule registers a task", () => {
    const client = new SpearClient({ intents: [], logger: { level: "silent" } });
    const scheduled = client.schedule({ name: "later", interval: 1000, run: () => {} });
    expect(scheduled.kind).toBe("task");
    expect(client.scheduler.list().map((t) => t.name)).toContain("later");
});

describe("TaskScheduler.delay / followUp / reconcile", () => {
  it("delay() fires once after the given ms; cancel prevents fire", async () => {
    const client = new SpearClient({ intents: [], logger: { level: "silent" } });
    let fired = 0;
    client.scheduler.delay("once", 20, () => void fired++);
    await sleep(40);
    expect(fired).toBe(1);
    const handle = client.scheduler.delay("later", 50, () => void fired++);
    expect(handle.cancel()).toBe(true);
    await sleep(70);
    expect(fired).toBe(1);
  });

  it("followUp() fires each delay independently with an index", async () => {
    const client = new SpearClient({ intents: [], logger: { level: "silent" } });
    const calls: number[] = [];
    client.scheduler.followUp("ladder", [10, 30, 50], (i) => void calls.push(i));
    await sleep(80);
    expect(calls).toEqual([0, 1, 2]);
  });

  it("followUp().cancel() cancels every remaining fire", async () => {
    const client = new SpearClient({ intents: [], logger: { level: "silent" } });
    const calls: number[] = [];
    const handle = client.scheduler.followUp("late", [10, 30, 50], (i) => void calls.push(i));
    await sleep(15); // first fire happened
    handle.cancel();
    await sleep(60);
    expect(calls).toEqual([0]);
  });

  it("reconcile() runs immediately when scheduler is already running", async () => {
    const client = new SpearClient({ intents: [], logger: { level: "silent" } });
    client.scheduler.start(client);
    let ran = false;
    client.scheduler.reconcile("now", () => {
      ran = true;
    });
    await sleep(10);
    expect(ran).toBe(true);
  });

  it("reconcile() defers until start() when registered before", async () => {
    const client = new SpearClient({ intents: [], logger: { level: "silent" } });
    let ran = false;
    client.scheduler.reconcile("later", () => {
      ran = true;
    });
    expect(ran).toBe(false);
    client.scheduler.start(client);
    await sleep(10);
    expect(ran).toBe(true);
  });
});
});