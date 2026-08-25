import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const HERE = dirname(fileURLToPath(import.meta.url));
export const PKG_ROOT = join(HERE, "..");

export async function readPackage() {
  return JSON.parse(await readFile(join(PKG_ROOT, "package.json"), "utf8"));
}
