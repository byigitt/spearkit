import { describe, expect, it } from "vitest";
import { KeyedLock } from "../src/lock.js";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("KeyedLock.tryAcquire", () => {
  it("acquires on first call and refuses while held", () => {
    const lock = new KeyedLock({ sweep: 0 });
    const release = lock.tryAcquire("k");
    expect(release).not.toBeNull();
    expect(lock.tryAcquire("k")).toBeNull();
    expect(lock.isHeld("k")).toBe(true);
    expect(lock.size).toBe(1);
    release?.();
    expect(lock.isHeld("k")).toBe(false);
    expect(lock.tryAcquire("k")).not.toBeNull();
    lock.dispose();
  });

  it("expires by TTL", async () => {
    const lock = new KeyedLock({ ttl: 20, sweep: 0 });
    expect(lock.tryAcquire("k")).not.toBeNull();
    expect(lock.tryAcquire("k")).toBeNull();
    await sleep(30);
    expect(lock.tryAcquire("k")).not.toBeNull();
    lock.dispose();
  });

  it("release is idempotent", () => {
    const lock = new KeyedLock({ sweep: 0 });
    const release = lock.tryAcquire("k");
    release?.();
    release?.();
    expect(lock.size).toBe(0);
    lock.dispose();
  });
});

describe("KeyedLock.run", () => {
  it("runs fn under the lock and releases on return", async () => {
    const lock = new KeyedLock({ sweep: 0 });
    let observedHeld = false;
    const result = await lock.run("k", async () => {
      observedHeld = lock.isHeld("k");
      return 42;
    });
    expect(result).toBe(42);
    expect(observedHeld).toBe(true);
    expect(lock.isHeld("k")).toBe(false);
    lock.dispose();
  });

  it("releases even when fn throws", async () => {
    const lock = new KeyedLock({ sweep: 0 });
    await expect(
      lock.run("k", () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
    expect(lock.isHeld("k")).toBe(false);
    lock.dispose();
  });

  it("returns undefined when busy and no onBusy", async () => {
    const lock = new KeyedLock({ sweep: 0 });
    const release = lock.tryAcquire("k");
    expect(await lock.run("k", () => "ran")).toBeUndefined();
    release?.();
    lock.dispose();
  });

  it("calls onBusy when held instead of fn", async () => {
    const lock = new KeyedLock({ sweep: 0 });
    const release = lock.tryAcquire("k");
    let ran = false;
    const out = await lock.run<string>(
      "k",
      () => {
        ran = true;
        return "ran";
      },
      { onBusy: () => "busy" },
    );
    expect(out).toBe("busy");
    expect(ran).toBe(false);
    release?.();
    lock.dispose();
  });

  it("serialises concurrent run calls on the same key (one runs, other busies out)", async () => {
    const lock = new KeyedLock({ sweep: 0 });
    let inside = 0;
    let maxInside = 0;
    const work = async () => {
      inside += 1;
      maxInside = Math.max(maxInside, inside);
      await sleep(10);
      inside -= 1;
      return "done";
    };
    const results = await Promise.all([
      lock.run("k", work),
      lock.run("k", work),
      lock.run("k", work),
    ]);
    expect(maxInside).toBe(1);
    expect(results.filter((r) => r === "done")).toHaveLength(1);
    lock.dispose();
  });
});

describe("KeyedLock.dispose / forget", () => {
  it("forget removes a single key", () => {
    const lock = new KeyedLock({ sweep: 0 });
    lock.tryAcquire("a");
    lock.tryAcquire("b");
    expect(lock.forget("a")).toBe(true);
    expect(lock.isHeld("a")).toBe(false);
    expect(lock.isHeld("b")).toBe(true);
    lock.dispose();
  });

  it("dispose clears everything", () => {
    const lock = new KeyedLock({ sweep: 0 });
    lock.tryAcquire("a");
    lock.tryAcquire("b");
    lock.dispose();
    expect(lock.size).toBe(0);
  });
});
