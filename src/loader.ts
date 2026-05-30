import { readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { SlashCommand } from "./commands/command.js";
import type { Registerable, SpearClient } from "./client.js";

/** Options for the directory loader. */
export interface LoadOptions {
  /** File extensions to import. Default: `.js`, `.mjs`, `.cjs`. */
  extensions?: readonly string[];
  /** Recurse into subdirectories. Default: `true`. */
  recursive?: boolean;
}

const DEFAULT_EXTENSIONS = [".js", ".mjs", ".cjs"] as const;

/** Structural guard: is this exported value something spearkit can register? */
function isRegisterable(value: unknown): value is Registerable {
  if (value instanceof SlashCommand) return true;
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (typeof record["attach"] === "function" && typeof record["detach"] === "function") {
    return true;
  }
  if (typeof record["kind"] === "string" && typeof record["handle"] === "function") {
    return true;
  }
  if (
    (record["kind"] === "task" || record["kind"] === "prefixCommand") &&
    typeof record["run"] === "function"
  ) {
    return true;
  }
  return false;
}

/**
 * Recursively import a directory and collect every spearkit-registrable export
 * (commands, events, components) found in default or named exports.
 */
export async function collectModules(
  dir: string,
  options: LoadOptions = {},
): Promise<Registerable[]> {
  const extensions = options.extensions ?? DEFAULT_EXTENSIONS;
  const recursive = options.recursive ?? true;
  const found: Registerable[] = [];

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (recursive) found.push(...(await collectModules(fullPath, options)));
      continue;
    }
    if (!extensions.includes(extname(entry.name))) continue;

    const mod: Record<string, unknown> = await import(pathToFileURL(fullPath).href);
    for (const value of Object.values(mod)) {
      if (isRegisterable(value)) found.push(value);
    }
  }
  return found;
}

/**
 * Load a directory and register everything it exports into the client.
 * Returns the number of items registered.
 */
export async function loadInto(
  client: SpearClient,
  dir: string,
  options?: LoadOptions,
): Promise<number> {
  const items = await collectModules(dir, options);
  client.register(...items);
  return items.length;
}
