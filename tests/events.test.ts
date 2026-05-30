import { EventEmitter } from "node:events";
import type { Client } from "discord.js";
import { describe, expect, it } from "vitest";
import { EventRegistry, event } from "../src/events.js";

/**
 * discord.js' Client is an async event emitter; a plain Node EventEmitter is
 * API-compatible for on/once/off/emit, so it's a faithful (non-mocked) stand-in
 * for exercising the listener wiring.
 */
function emitter(): Client {
  return new EventEmitter() as unknown as Client;
}

describe("event()", () => {
  it("attaches a listener that fires on emit", () => {
    const client = emitter();
    const received: string[] = [];
    event("warn", (message) => {
      received.push(message);
    }).attach(client);
    client.emit("warn", "hello");
    expect(received).toEqual(["hello"]);
  });

  it("once: true fires at most once", () => {
    const client = emitter();
    let count = 0;
    event({
      name: "warn",
      once: true,
      run: () => {
        count++;
      },
    }).attach(client);
    client.emit("warn", "a");
    client.emit("warn", "b");
    expect(count).toBe(1);
  });

  it("detach removes the listener", () => {
    const client = emitter();
    let count = 0;
    const def = event("warn", () => {
      count++;
    });
    def.attach(client);
    def.detach(client);
    client.emit("warn", "x");
    expect(count).toBe(0);
  });

  it("routes a thrown error to the client error event", () => {
    const client = emitter();
    const errors: Error[] = [];
    client.on("error", (err) => {
      errors.push(err);
    });
    event("warn", () => {
      throw new Error("boom");
    }).attach(client);
    client.emit("warn", "x");
    expect(errors).toHaveLength(1);
    expect(errors[0]?.message).toBe("boom");
  });

  it("routes a rejected promise to the client error event", async () => {
    const client = emitter();
    const errors: Error[] = [];
    client.on("error", (err) => {
      errors.push(err);
    });
    event("warn", async () => {
      throw new Error("async-boom");
    }).attach(client);
    client.emit("warn", "x");
    await new Promise((resolve) => setImmediate(resolve));
    expect(errors.map((e) => e.message)).toEqual(["async-boom"]);
  });
});

describe("EventRegistry", () => {
  it("attaches all registered listeners and attaches late additions", () => {
    const client = emitter();
    const reg = new EventRegistry();
    let count = 0;
    reg.attachAll(client);
    reg.add(
      event("warn", () => {
        count++;
      }),
    );
    client.emit("warn", "x");
    expect(count).toBe(1);
    expect(reg.size).toBe(1);
  });
});
