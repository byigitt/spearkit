import { describe, expect, it } from "vitest";
import { MemoryCache, createCache } from "../src/cache.js";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("MemoryCache.get/set/delete/has", () => {
  it("round-trips JSON values", async () => {
    const c = new MemoryCache();
    await c.set("k", { a: 1, b: "x" });
    expect(await c.get<{ a: number; b: string }>("k")).toEqual({ a: 1, b: "x" });
    expect(await c.has("k")).toBe(true);
    expect(await c.delete("k")).toBe(true);
    expect(await c.delete("k")).toBe(false);
    expect(await c.has("k")).toBe(false);
  });

  it("expires entries after TTL", async () => {
    const c = new MemoryCache();
    await c.set("k", "v", { ttl: 20 });
    expect(await c.get("k")).toBe("v");
    await sleep(30);
    expect(await c.get("k")).toBeUndefined();
    expect(await c.has("k")).toBe(false);
  });

  it("ttl=0 or undefined keeps the entry indefinitely", async () => {
    const c = new MemoryCache();
    await c.set("k", "v");
    await sleep(20);
    expect(await c.get("k")).toBe("v");
  });

  it("clear drops everything", async () => {
    const c = new MemoryCache();
    await c.set("a", 1);
    await c.set("b", 2);
    await c.clear();
    expect(c.size).toBe(0);
  });
});

describe("MemoryCache.increment", () => {
  it("starts from 0 and adds delta", async () => {
    const c = new MemoryCache();
    expect(await c.increment("k")).toBe(1);
    expect(await c.increment("k", 4)).toBe(5);
    expect(await c.get<number>("k")).toBe(5);
  });

  it("preserves an existing TTL across plain increments", async () => {
    const c = new MemoryCache();
    await c.set("k", 0, { ttl: 50 });
    await c.increment("k");
    await sleep(70);
    expect(await c.get("k")).toBeUndefined();
  });
});

describe("MemoryCache.rateLimit", () => {
  it("allows up to limit hits then blocks until the window resets", async () => {
    const c = new MemoryCache();
    const first = await c.rateLimit("k", { limit: 2, windowMs: 50 });
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(1);
    const second = await c.rateLimit("k", { limit: 2, windowMs: 50 });
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(0);
    const third = await c.rateLimit("k", { limit: 2, windowMs: 50 });
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
    await sleep(70);
    const next = await c.rateLimit("k", { limit: 2, windowMs: 50 });
    expect(next.allowed).toBe(true);
  });

  it("keys independently", async () => {
    const c = new MemoryCache();
    expect((await c.rateLimit("a", { limit: 1, windowMs: 100 })).allowed).toBe(true);
    expect((await c.rateLimit("a", { limit: 1, windowMs: 100 })).allowed).toBe(false);
    expect((await c.rateLimit("b", { limit: 1, windowMs: 100 })).allowed).toBe(true);
  });
});

describe("createCache", () => {
  it("returns a CacheStore-shaped object", async () => {
    const c = createCache();
    await c.set("k", "v");
    expect(await c.get("k")).toBe("v");
  });
});
