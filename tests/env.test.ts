import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { env, loadEnv, parseEnv } from "../src/env.js";

describe("parseEnv", () => {
  it("parses keys, comments, blanks and the export prefix", () => {
    const out = parseEnv(["# comment", "", "FOO=bar", "export BAZ=qux", "  SPACED = 1 "].join("\n"));
    expect(out).toEqual({ FOO: "bar", BAZ: "qux", SPACED: "1" });
  });

  it("keeps quoted values verbatim and expands escapes only in double quotes", () => {
    const out = parseEnv(['A="line1\\nline2"', "B='raw\\nkept'", 'C="a # b"'].join("\n"));
    expect(out.A).toBe("line1\nline2");
    expect(out.B).toBe("raw\\nkept");
    expect(out.C).toBe("a # b");
  });

  it("strips inline comments from unquoted values but keeps literal #", () => {
    const out = parseEnv(["A=value # note", "B=pass#1"].join("\n"));
    expect(out.A).toBe("value");
    expect(out.B).toBe("pass#1");
  });

  it("splits on the first = and ignores malformed lines", () => {
    const out = parseEnv(["URL=postgres://a:b@h/db?x=1", "=novalue", "noequals"].join("\n"));
    expect(out.URL).toBe("postgres://a:b@h/db?x=1");
    expect(Object.keys(out)).toEqual(["URL"]);
  });
});

describe("loadEnv", () => {
  const keys = ["SPEARKIT_T_A", "SPEARKIT_T_B"];
  afterEach(() => {
    for (const k of keys) delete process.env[k];
  });

  it("merges a file into process.env without overriding existing vars", () => {
    const dir = mkdtempSync(join(tmpdir(), "spearkit-env-"));
    writeFileSync(join(dir, ".env"), "SPEARKIT_T_A=fromfile\nSPEARKIT_T_B=two\n");
    process.env.SPEARKIT_T_A = "preset";
    try {
      const parsed = loadEnv({ path: join(dir, ".env") });
      expect(parsed).toEqual({ SPEARKIT_T_A: "fromfile", SPEARKIT_T_B: "two" });
      expect(process.env.SPEARKIT_T_A).toBe("preset"); // existing wins
      expect(process.env.SPEARKIT_T_B).toBe("two"); // new applied
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("overrides when asked", () => {
    const dir = mkdtempSync(join(tmpdir(), "spearkit-env-"));
    writeFileSync(join(dir, ".env"), "SPEARKIT_T_A=fromfile\n");
    process.env.SPEARKIT_T_A = "preset";
    try {
      loadEnv({ path: join(dir, ".env"), override: true });
      expect(process.env.SPEARKIT_T_A).toBe("fromfile");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("returns {} for a missing file", () => {
    expect(loadEnv({ path: join(tmpdir(), "definitely-missing-spearkit.env") })).toEqual({});
  });
});

describe("env reader", () => {
  const keys = ["SPEARKIT_S", "SPEARKIT_N", "SPEARKIT_BAD_N", "SPEARKIT_BOOL", "SPEARKIT_EMPTY"];
  afterEach(() => {
    for (const k of keys) delete process.env[k];
  });

  it("reads strings with empty-as-missing and fallbacks", () => {
    process.env.SPEARKIT_S = "hi";
    process.env.SPEARKIT_EMPTY = "";
    expect(env.string("SPEARKIT_S")).toBe("hi");
    expect(env.string("SPEARKIT_EMPTY", "fb")).toBe("fb");
    expect(env.string("SPEARKIT_MISSING")).toBeUndefined();
  });

  it("reads numbers with fallback on missing or non-numeric", () => {
    process.env.SPEARKIT_N = "42";
    process.env.SPEARKIT_BAD_N = "nope";
    expect(env.number("SPEARKIT_N")).toBe(42);
    expect(env.number("SPEARKIT_BAD_N", 7)).toBe(7);
    expect(env.number("SPEARKIT_MISSING", 3)).toBe(3);
  });

  it("reads booleans from common truthy/falsy spellings", () => {
    process.env.SPEARKIT_BOOL = "YES";
    expect(env.boolean("SPEARKIT_BOOL")).toBe(true);
    process.env.SPEARKIT_BOOL = "off";
    expect(env.boolean("SPEARKIT_BOOL")).toBe(false);
    expect(env.boolean("SPEARKIT_MISSING", true)).toBe(true);
  });

  it("require() throws when missing", () => {
    expect(() => env.require("SPEARKIT_MISSING")).toThrow(/required environment variable/);
    process.env.SPEARKIT_S = "ok";
    expect(env.require("SPEARKIT_S")).toBe("ok");
  });
});
