import { describe, expect, it } from "vitest";
import { MemoryStore } from "../src/store.js";
import { createPayloadStore } from "../src/payload.js";

describe("createPayloadStore", () => {
  it("round-trips JSON-serialisable payloads", async () => {
    const tickets = createPayloadStore<{ n: number }>({ store: new MemoryStore() });
    const token = await tickets.put({ n: 7 });
    expect(token.length).toBeGreaterThan(10);
    expect(await tickets.get(token)).toEqual({ n: 7 });
    expect(await tickets.delete(token)).toBe(true);
    expect(await tickets.get(token)).toBeUndefined();
  });

  it("expires entries after ttlMs", async () => {
    const tickets = createPayloadStore<string>({ store: new MemoryStore(), ttlMs: 1 });
    const token = await tickets.put("x");
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(await tickets.get(token)).toBeUndefined();
  });
});
