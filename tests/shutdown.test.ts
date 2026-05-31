import { setTimeout as delay } from "node:timers/promises";
import { describe, expect, it, vi } from "vitest";
import { gracefulShutdown, type Destroyable } from "../src/shutdown.js";

/** Install gracefulShutdown and return the exact SIGINT handler it added. */
function install(client: Destroyable, options: Parameters<typeof gracefulShutdown>[1]) {
  const before = new Set(process.listeners("SIGINT"));
  const dispose = gracefulShutdown(client, options);
  const handler = process.listeners("SIGINT").find((l) => !before.has(l)) as
    | ((s: NodeJS.Signals) => void)
    | undefined;
  return { dispose, handler };
}

describe("gracefulShutdown", () => {
  it("registers and disposes signal handlers", () => {
    const before = process.listenerCount("SIGINT");
    const beforeTerm = process.listenerCount("SIGTERM");
    const dispose = gracefulShutdown({ destroy: () => undefined }, { exit: false });
    expect(process.listenerCount("SIGINT")).toBe(before + 1);
    expect(process.listenerCount("SIGTERM")).toBe(beforeTerm + 1);
    dispose();
    expect(process.listenerCount("SIGINT")).toBe(before);
    expect(process.listenerCount("SIGTERM")).toBe(beforeTerm);
  });

  it("runs the hook then destroys, passing the signal", async () => {
    const destroy = vi.fn<Destroyable["destroy"]>(() => undefined);
    const onShutdown = vi.fn(() => undefined);
    const { dispose, handler } = install({ destroy }, { exit: false, onShutdown });
    try {
      handler?.("SIGINT");
      await delay(0);
      expect(onShutdown).toHaveBeenCalledWith("SIGINT");
      expect(destroy).toHaveBeenCalledOnce();
    } finally {
      dispose();
    }
  });

  it("ignores repeated signals (shuts down once)", async () => {
    const destroy = vi.fn<Destroyable["destroy"]>(() => undefined);
    const { dispose, handler } = install({ destroy }, { exit: false });
    try {
      handler?.("SIGINT");
      handler?.("SIGINT");
      await delay(0);
      expect(destroy).toHaveBeenCalledOnce();
    } finally {
      dispose();
    }
  });

  it("reports progress through the logger", async () => {
    const info = vi.fn();
    const { dispose, handler } = install(
      { destroy: () => undefined },
      { exit: false, logger: { info } },
    );
    try {
      handler?.("SIGINT");
      await delay(0);
      expect(info).toHaveBeenCalledWith(expect.stringContaining("SIGINT"));
      expect(info).toHaveBeenCalledWith(expect.stringContaining("complete"));
    } finally {
      dispose();
    }
  });
});
