import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { collectModules } from "../src/loader.js";

let dir: string;

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), "spearkit-loader-"));
  await writeFile(
    join(dir, "vote.mjs"),
    'export const vote = { kind: "button", namespace: "vote", paramNames: [], handle: async () => {} };\n',
  );
  await writeFile(
    join(dir, "ready.mjs"),
    "export default { name: 'ready', once: false, attach() {}, detach() {} };\n",
  );
  await writeFile(join(dir, "noise.mjs"), "export const n = 42;\nexport const o = { a: 1 };\n");
  await writeFile(join(dir, "ignore.txt"), "not a module");
  await mkdir(join(dir, "nested"));
  await writeFile(
    join(dir, "nested", "menu.mjs"),
    'export const menu = { kind: "stringSelect", namespace: "menu", paramNames: [], handle: async () => {} };\n',
  );
  await writeFile(
    join(dir, "inspect.mjs"),
    'export const inspect = { kind: "userMenu", name: "Inspect", execute: async () => {} };\n',
  );
});

afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("collectModules", () => {
  it("discovers registerable exports recursively and ignores the rest", async () => {
    const found = await collectModules(dir, { extensions: [".mjs"] });
    const namespaces = found
      .map((item) => ("namespace" in item ? item.namespace : "name" in item ? item.name : "?"))
      .sort();
    expect(namespaces).toEqual(["Inspect", "menu", "ready", "vote"]);
  });

  it("honours recursive: false", async () => {
    const found = await collectModules(dir, { extensions: [".mjs"], recursive: false });
    expect(found).toHaveLength(3);
  });

  it("loads .ts when typescript: true, or explains why not", async () => {
    const extra = await mkdtemp(join(tmpdir(), "spearkit-loader-ts-"));
    await writeFile(
      join(extra, "p.ts"),
      'export const p = { kind: "prefixCommand", name: "loaded-ts", run() {} };\n',
    );
    try {
      const found = await collectModules(extra, { typescript: true });
      expect(found.some((item) => "name" in item && item.name === "loaded-ts")).toBe(true);
    } catch (error) {
      expect(String(error)).toMatch(/cannot import TypeScript/);
    }
    await rm(extra, { recursive: true, force: true });
  });
});
