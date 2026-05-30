import { describe, expect, it } from "vitest";
import {
  MAX_CUSTOM_ID_LENGTH,
  buildCustomId,
  compilePattern,
  paramsFromValues,
  parseCustomId,
} from "../src/components/customId.js";

describe("compilePattern", () => {
  it("extracts namespace and ordered param names", () => {
    const c = compilePattern("page:{id}:{dir}");
    expect(c.namespace).toBe("page");
    expect(c.paramNames).toEqual(["id", "dir"]);
  });

  it("handles a bare namespace with no params", () => {
    const c = compilePattern("vote");
    expect(c.namespace).toBe("vote");
    expect(c.paramNames).toEqual([]);
  });

  it("rejects malformed segments", () => {
    expect(() => compilePattern("bad:{x}:nope")).toThrow(/must be/);
    expect(() => compilePattern(":{x}")).toThrow(/invalid/);
    expect(() => compilePattern("has{brace}")).toThrow(/invalid/);
  });
});

describe("buildCustomId / parseCustomId roundtrip", () => {
  it("preserves values containing delimiter and escape chars", () => {
    const c = compilePattern("k:{a}:{b}");
    const id = buildCustomId(c, { a: "x:y", b: "100%" });
    expect(id).toBe("k:x%3Ay:100%25");
    const parsed = parseCustomId(id);
    expect(parsed.namespace).toBe("k");
    expect(paramsFromValues(c.paramNames, parsed.values)).toEqual({ a: "x:y", b: "100%" });
  });

  it("builds a bare namespace id", () => {
    const c = compilePattern("ok");
    expect(buildCustomId(c, {})).toBe("ok");
  });

  it("throws when a required param is missing", () => {
    const c = compilePattern("k:{a}");
    expect(() => buildCustomId(c, {} as Record<string, string>)).toThrow(/missing param/);
  });

  it("throws when the id exceeds the discord length limit", () => {
    const c = compilePattern("k:{a}");
    expect(() => buildCustomId(c, { a: "z".repeat(MAX_CUSTOM_ID_LENGTH) })).toThrow(/exceeds/);
  });
});

describe("paramsFromValues", () => {
  it("fills missing trailing values with empty strings", () => {
    expect(paramsFromValues(["a", "b"], ["only"])).toEqual({ a: "only", b: "" });
  });
});
