import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  JsonStore,
  MemoryStore,
  createSettings,
  namespaced,
  type KeyValueStore,
} from "../src/store.js";

let dir: string;
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), "spearkit-store-"));
});
afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

function contract(name: string, make: () => KeyValueStore): void {
  describe(`${name} — KeyValueStore contract`, () => {
    it("get returns undefined for absent keys", async () => {
      expect(await make().get("missing")).toBeUndefined();
    });

    it("set/get/has/delete/keys/clear round-trip", async () => {
      const store = make();
      await store.set("a", { n: 1 });
      await store.set("b", "two");
      expect(await store.get("a")).toEqual({ n: 1 });
      expect(await store.has("a")).toBe(true);
      expect((await store.keys()).sort()).toEqual(["a", "b"]);
      expect(await store.delete("a")).toBe(true);
      expect(await store.delete("a")).toBe(false);
      expect(await store.has("a")).toBe(false);
      await store.clear();
      expect(await store.keys()).toEqual([]);
    });

    it("does not alias stored objects (clone on read & write)", async () => {
      const store = make();
      const value = { items: [1] };
      await store.set("k", value);
      value.items.push(2); // mutate after storing
      const read = await store.get<{ items: number[] }>("k");
      expect(read).toEqual({ items: [1] });
      read!.items.push(99); // mutate the read copy
      expect(await store.get<{ items: number[] }>("k")).toEqual({ items: [1] });
    });
  });
}

contract("MemoryStore", () => new MemoryStore());
contract("JsonStore", () => new JsonStore(join(dir, `kv-${Math.random().toString(36).slice(2)}.json`)));

describe("JsonStore persistence", () => {
  it("survives a fresh instance pointed at the same file", async () => {
    const path = join(dir, "persist.json");
    const a = new JsonStore(path);
    await a.set("prefix", "?");
    await a.set("count", 3);
    const b = new JsonStore(path);
    expect(await b.get("prefix")).toBe("?");
    expect(await b.get("count")).toBe(3);
  });

  it("serialises concurrent writes without corruption", async () => {
    const path = join(dir, "concurrent.json");
    const store = new JsonStore(path);
    await Promise.all(Array.from({ length: 20 }, (_v, i) => store.set(`k${i}`, i)));
    const reload = new JsonStore(path);
    expect((await reload.keys()).length).toBe(20);
    expect(await reload.get("k19")).toBe(19);
  });
});

describe("namespaced", () => {
  it("isolates keys behind a prefix", async () => {
    const base = new MemoryStore();
    const a = namespaced(base, "guildA");
    const b = namespaced(base, "guildB");
    await a.set("prefix", "!");
    await b.set("prefix", "?");
    expect(await a.get("prefix")).toBe("!");
    expect(await b.get("prefix")).toBe("?");
    expect(await a.keys()).toEqual(["prefix"]);
    await a.clear();
    expect(await a.keys()).toEqual([]);
    expect(await b.get("prefix")).toBe("?"); // untouched
  });
});

describe("createSettings", () => {
  it("merges stored overrides on top of defaults", async () => {
    const settings = createSettings({
      store: new MemoryStore(),
      defaults: { prefix: "!", modLog: null as string | null, strikes: 3 },
    });
    expect(await settings.get("g1")).toEqual({ prefix: "!", modLog: null, strikes: 3 });
    const updated = await settings.set("g1", { prefix: "?" });
    expect(updated).toEqual({ prefix: "?", modLog: null, strikes: 3 });
    expect(await settings.get("g1")).toEqual({ prefix: "?", modLog: null, strikes: 3 });
  });

  it("only persists overrides, so widening defaults later is safe", async () => {
    const store = new MemoryStore();
    await createSettings({ store, defaults: { prefix: "!" } }).set("g1", { prefix: "?" });
    const widened = createSettings({
      store,
      defaults: { prefix: "!", welcome: "hi" },
    });
    expect(await widened.get("g1")).toEqual({ prefix: "?", welcome: "hi" });
  });

  it("reset restores defaults", async () => {
    const settings = createSettings({ store: new MemoryStore(), defaults: { prefix: "!" } });
    await settings.set("g1", { prefix: "?" });
    await settings.reset("g1");
    expect(await settings.get("g1")).toEqual({ prefix: "!" });
  });

  it("namespaces keys so two groups can share one store", async () => {
    const store = new MemoryStore();
    const guilds = createSettings({ store, defaults: { prefix: "!" }, namespace: "guild" });
    const users = createSettings({ store, defaults: { xp: 0 }, namespace: "user" });
    await guilds.set("1", { prefix: "?" });
    await users.set("1", { xp: 10 });
    expect(await guilds.get("1")).toEqual({ prefix: "?" });
    expect(await users.get("1")).toEqual({ xp: 10 });
  });
});
