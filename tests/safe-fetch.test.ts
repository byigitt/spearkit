import { describe, expect, it } from "vitest";
import { safeFetch, safeTry, withSafeTimeout } from "../src/safe-fetch.js";

function fakeGuild(opts: {
  cached?: Record<string, { id: string }>;
  fetched?: Record<string, { id: string }>;
  fetchFails?: boolean;
  fetchDelayMs?: number;
}): {
  members: { cache: Map<string, { id: string }>; fetch: (...args: unknown[]) => Promise<unknown> };
  roles: { cache: Map<string, { id: string }>; fetch: (id: string) => Promise<unknown> };
  fetchCalls: number;
} {
  let fetchCalls = 0;
  const members = {
    cache: new Map(Object.entries(opts.cached ?? {})),
    async fetch(args: { user: string; force: boolean }): Promise<unknown> {
      fetchCalls += 1;
      if (opts.fetchDelayMs !== undefined) await new Promise((r) => setTimeout(r, opts.fetchDelayMs));
      if (opts.fetchFails) throw new Error("403");
      const found = opts.fetched?.[args.user];
      if (found === undefined) throw new Error("unknown");
      return found;
    },
  };
  const roles = {
    cache: new Map(Object.entries(opts.cached ?? {})),
    async fetch(_id: string): Promise<unknown> {
      fetchCalls += 1;
      if (opts.fetchFails) throw new Error("404");
      return opts.fetched?.[_id] ?? null;
    },
  };
  return {
    members,
    roles,
    get fetchCalls() {
      return fetchCalls;
    },
  } as never;
}

describe("safeFetch.member", () => {
  it("returns null on missing inputs", async () => {
    expect(await safeFetch.member(null, "1")).toBeNull();
    expect(await safeFetch.member(undefined, null)).toBeNull();
    expect(await safeFetch.member({ members: { cache: new Map() } } as never, "")).toBeNull();
  });

  it("returns a cache hit without calling fetch", async () => {
    const guild = fakeGuild({ cached: { u1: { id: "u1" } } });
    const member = await safeFetch.member(guild as never, "u1");
    expect((member as { id: string }).id).toBe("u1");
    expect(guild.fetchCalls).toBe(0);
  });

  it("falls back to fetch on cache miss", async () => {
    const guild = fakeGuild({ fetched: { u1: { id: "u1" } } });
    const member = await safeFetch.member(guild as never, "u1");
    expect((member as { id: string }).id).toBe("u1");
    expect(guild.fetchCalls).toBe(1);
  });

  it("returns null when fetch throws", async () => {
    const guild = fakeGuild({ fetchFails: true });
    expect(await safeFetch.member(guild as never, "u1")).toBeNull();
  });

  it("times out to null when fetch exceeds budget", async () => {
    const guild = fakeGuild({ fetched: { u1: { id: "u1" } }, fetchDelayMs: 200 });
    expect(await safeFetch.member(guild as never, "u1", { timeoutMs: 30 })).toBeNull();
  });

  it("respects force: true to skip the cache", async () => {
    const guild = fakeGuild({ cached: { u1: { id: "cached" } }, fetched: { u1: { id: "fresh" } } });
    const member = await safeFetch.member(guild as never, "u1", { force: true });
    expect((member as { id: string }).id).toBe("fresh");
    expect(guild.fetchCalls).toBe(1);
  });
});

describe("safeFetch.channel/user/guild/role", () => {
  it("each helper short-circuits null/empty ids", async () => {
    expect(await safeFetch.channel(null, "1")).toBeNull();
    expect(await safeFetch.user(null, "")).toBeNull();
    expect(await safeFetch.guild(null, null)).toBeNull();
    expect(await safeFetch.role(null, "1")).toBeNull();
  });

  it("role uses the cache when available", async () => {
    const guild = fakeGuild({ cached: { r1: { id: "r1" } } });
    const role = await safeFetch.role(guild as never, "r1");
    expect((role as { id: string }).id).toBe("r1");
  });
});

describe("safeTry / withSafeTimeout", () => {
  it("safeTry catches throws and returns null", async () => {
    expect(
      await safeTry(() => {
        throw new Error("boom");
      }),
    ).toBeNull();
    expect(await safeTry(() => 1)).toBe(1);
  });

  it("withSafeTimeout returns the value when fast", async () => {
    expect(await withSafeTimeout(Promise.resolve("ok"), 100)).toBe("ok");
  });

  it("withSafeTimeout returns null when slow", async () => {
    const slow = new Promise<string>((r) => setTimeout(() => r("late"), 200));
    expect(await withSafeTimeout(slow, 30)).toBeNull();
  });

  it("withSafeTimeout returns null on rejection", async () => {
    expect(await withSafeTimeout(Promise.reject(new Error("x")), 100)).toBeNull();
  });
});
