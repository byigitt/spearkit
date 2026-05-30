import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadConfig, loadConfigAsync, lookup, lookupOptional } from "../src/config.js";

describe("loadConfig", () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "spearkit-config-"));
  });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("parses a JSON file synchronously", () => {
    const path = join(dir, "c.json");
    writeFileSync(path, JSON.stringify({ token: "abc", port: 3000 }));
    const cfg = loadConfig<{ token: string; port: number }>({ file: path });
    expect(cfg).toEqual({ token: "abc", port: 3000 });
  });

  it("uses a custom parser (simulating JSON5)", () => {
    const path = join(dir, "c.json5");
    writeFileSync(path, "// comment\n{ \"name\": \"spearkit\" }");
    const stripComments = (text: string) =>
      JSON.parse(text.replace(/^\s*\/\/.*$/gm, ""));
    const cfg = loadConfig<{ name: string }>({ file: path, parser: stripComments });
    expect(cfg.name).toBe("spearkit");
  });

  it("applies a schema function for validation/normalisation", () => {
    const path = join(dir, "c.json");
    writeFileSync(path, JSON.stringify({ port: "3000" }));
    const cfg = loadConfig({
      file: path,
      schema: (raw) => {
        const r = raw as { port: string };
        return { port: Number(r.port) };
      },
    });
    expect(cfg).toEqual({ port: 3000 });
  });

  it("schema can throw to surface validation errors at startup", () => {
    const path = join(dir, "bad.json");
    writeFileSync(path, JSON.stringify({}));
    expect(() =>
      loadConfig({
        file: path,
        schema: (raw) => {
          const r = raw as { token?: string };
          if (r.token === undefined) throw new Error("missing token");
          return r;
        },
      }),
    ).toThrow(/missing token/);
  });

  it("loadConfigAsync resolves with the typed config", async () => {
    const path = join(dir, "c.json");
    writeFileSync(path, JSON.stringify({ x: 1 }));
    expect(await loadConfigAsync<{ x: number }>({ file: path })).toEqual({ x: 1 });
  });
});

describe("lookup / lookupOptional", () => {
  it("returns the value when present", () => {
    const roles = lookup({ admin: "1", mod: "2" } as const, "role");
    expect(roles("admin")).toBe("1");
  });

  it("throws on a missing key with a descriptive message", () => {
    const roles = lookup({ admin: "1" } as const, "role");
    expect(() => roles("admin" === "admin" ? ("missing" as never) : "admin")).toThrow(/role "missing"/);
  });

  it("lookupOptional returns undefined for missing keys", () => {
    const roles = lookupOptional({ admin: "1" } as const);
    expect(roles("admin")).toBe("1");
    expect(roles("missing" as never)).toBeUndefined();
  });
});
