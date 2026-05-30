import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { collectModules } from "../src/loader.js";

let dir: string;

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), "spear-loader-"));
  // A registerable: structurally a component def (kind + handle).
  await writeFile(
    join(dir, "vote.mjs"),
    'export const vote = { kind: "button", namespace: "vote", paramNames: [], handle: async () => {} };\n',
  );
  // A registerable: structurally an event def (attach + detach).
  await writeFile(
    join(dir, "ready.mjs"),
    "export default { name: 'ready', once: false, attach() {}, detach() {} };\n",
  );
  // Not registerable: a plain value and an unrelated object.
  await writeFile(join(dir, "noise.mjs"), "export const n = 42;\nexport const o = { a: 1 };\n");
  // Wrong extension: ignored.
  await writeFile(join(dir, "ignore.txt"), "not a module");
  // Nested directory with one more registerable.
  await mkdir(join(dir, "nested"));
  await writeFile(
    join(dir, "nested", "menu.mjs"),
    'export const menu = { kind: "stringSelect", namespace: "menu", paramNames: [], handle: async () => {} };\n',
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
    expect(namespaces).toEqual(["menu", "ready", "vote"]);
  });

  it("honours recursive: false", async () => {
    const found = await collectModules(dir, { extensions: [".mjs"], recursive: false });
    expect(found).toHaveLength(2);
  });
});
