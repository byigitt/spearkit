import { readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { SlashCommand } from "./commands/command.js";
import type { Registerable, SpearClient } from "./client.js";

/** Options for the directory loader. */
export interface LoadOptions {
  /**
   * File extensions to import. Default: `.js`, `.mjs`, `.cjs`.
   * Ignored when {@link typescript} is true unless you also pass this (then
   * your list wins).
   */
  extensions?: readonly string[];
  /**
   * Also import `.ts` / `.mts` source. Requires a runtime that can load
   * TypeScript (`tsx`, `bun`, or Node with type stripping). Default: `false`.
   */
  typescript?: boolean;
  /** Recurse into subdirectories. Default: `true`. */
  recursive?: boolean;
}

const JS_EXTENSIONS = [".js", ".mjs", ".cjs"] as const;
const TS_EXTENSIONS = [".ts", ".mts"] as const;

function resolveExtensions(options: LoadOptions): readonly string[] {
  if (options.extensions !== undefined) return options.extensions;
  if (options.typescript === true) return [...TS_EXTENSIONS, ...JS_EXTENSIONS];
  return JS_EXTENSIONS;
}

function isTsPath(file: string): boolean {
  const ext = extname(file);
  return ext === ".ts" || ext === ".mts";
}

function isUnknownTsExtension(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as NodeJS.ErrnoException).code;
  return (
    code === "ERR_UNKNOWN_FILE_EXTENSION" ||
    error.message.includes("Unknown file extension") ||
    error.message.includes("Unknown file extension \".ts\"")
  );
}

async function importModule(fullPath: string): Promise<Record<string, unknown>> {
  try {
    return (await import(pathToFileURL(fullPath).href)) as Record<string, unknown>;
  } catch (error) {
    if (isTsPath(fullPath) && isUnknownTsExtension(error)) {
      throw new Error(
        `spearkit: cannot import TypeScript file "${fullPath}". Run under tsx, bun, or Node with type stripping (node --experimental-strip-types on Node 22), or compile first and load .js.`,
        { cause: error },
      );
    }
    throw error;
  }
}

/** Structural guard: is this exported value something spearkit can register? */
function isRegisterable(value: unknown): value is Registerable {
  if (value instanceof SlashCommand) return true;
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (record["slash"] instanceof SlashCommand) {
    const prefix = record["prefix"];
    if (
      typeof prefix === "object" &&
      prefix !== null &&
      (prefix as Record<string, unknown>)["kind"] === "prefixCommand"
    ) {
      return true;
    }
  }
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
  if (
    (record["kind"] === "userMenu" || record["kind"] === "messageMenu") &&
    typeof record["execute"] === "function"
  ) {
    return true;
  }
  return false;
}

/**
 * Recursively import a directory and collect every spearkit-registrable export
 * (commands, events, components, hybrid commands, context menus) found in
 * default or named exports.
 */
export async function collectModules(
  dir: string,
  options: LoadOptions = {},
): Promise<Registerable[]> {
  const extensions = resolveExtensions(options);
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

    const mod = await importModule(fullPath);
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
