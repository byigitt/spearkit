import { describe, expect, it } from "vitest";
import { MESSAGE_CHARACTER_LIMIT, chunkMessage, truncate } from "../src/format.js";

describe("truncate", () => {
  it("leaves short text untouched", () => {
    expect(truncate("hello", 10)).toBe("hello");
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("cuts and appends the suffix without exceeding max", () => {
    const out = truncate("a very long reason", 10);
    expect(out).toBe("a very lo…");
    expect(out.length).toBe(10);
  });

  it("supports a custom suffix", () => {
    expect(truncate("abcdefgh", 6, "...")).toBe("abc...");
  });

  it("degrades gracefully for tiny limits", () => {
    expect(truncate("abc", 0)).toBe("");
    expect(truncate("abcdef", 2, "...")).toBe("..");
  });
});

describe("chunkMessage", () => {
  it("returns the input as one chunk when within the limit", () => {
    expect(chunkMessage("short")).toEqual(["short"]);
    expect(chunkMessage("")).toEqual([]);
  });

  it("splits on line boundaries and keeps every chunk within max", () => {
    const lines = Array.from({ length: 10 }, (_v, i) => `line-${i}`).join("\n");
    const chunks = chunkMessage(lines, { max: 20 });
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(20);
    expect(chunks.join("\n")).toBe(lines);
  });

  it("hard-splits a single over-long line without losing characters", () => {
    const long = "x".repeat(45);
    const chunks = chunkMessage(long, { max: 20 });
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(20);
    expect(chunks.join("")).toBe(long);
  });

  it("prefers word boundaries when splitting long lines", () => {
    const text = `${"word ".repeat(8)}tail`.trim();
    const chunks = chunkMessage(text, { max: 20 });
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(20);
      expect(chunk.startsWith(" ")).toBe(false);
    }
  });

  it("defaults to Discord's 2000-character message limit", () => {
    expect(MESSAGE_CHARACTER_LIMIT).toBe(2000);
    const chunks = chunkMessage("a".repeat(4100));
    expect(chunks.length).toBe(3);
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(2000);
  });

  it("rejects a non-positive max", () => {
    expect(() => chunkMessage("abc", { max: 0 })).toThrow(RangeError);
  });
});
