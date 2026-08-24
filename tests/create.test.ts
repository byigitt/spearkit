import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const exec = promisify(execFile);
const cli = join(dirname(fileURLToPath(import.meta.url)), "..", "bin", "spearkit.mjs");

let dir: string;
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), "spearkit-create-"));
});
afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("spearkit create", () => {
  it("scaffolds a starter bot", async () => {
    const dest = join(dir, "demo-bot");
    await exec(process.execPath, [cli, "create", dest]);
    const pkg = JSON.parse(await readFile(join(dest, "package.json"), "utf8")) as { name: string };
    expect(pkg.name).toBe("demo-bot");
    const src = await readFile(join(dest, "src", "index.ts"), "utf8");
    expect(src).toContain("from \"spearkit\"");
    expect(src).toContain("SpearClient");
  });

  it("prints the package version", async () => {
    const { stdout } = await exec(process.execPath, [cli, "--version"]);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
