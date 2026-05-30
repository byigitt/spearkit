/**
 * Tiny, dependency-free typed config loader for JSON files.
 *
 * Pass a `parser` to support JSON5 / YAML / TOML without dragging those
 * packages into spearkit, and a `schema` to validate (zod, valibot, custom) so
 * a typo in your config blows up at startup instead of at the first user
 * interaction. Pairs naturally with `lookup()` for typed role/channel maps.
 */
import { readFile, readFileSync } from "node:fs";
import { promisify } from "node:util";

const readFileAsync = promisify(readFile);

/** Options accepted by {@link loadConfig} / {@link loadConfigAsync}. */
export interface LoadConfigOptions<T> {
  /** Absolute or cwd-relative path to the config file. */
  file: string;
  /** Custom parser. Default `JSON.parse`. Pass `JSON5.parse` (etc.) for other formats. */
  parser?: (text: string) => unknown;
  /** Validation function — receives the parsed value, returns the typed config. */
  schema?: (value: unknown) => T;
  /** File encoding. Default `"utf8"`. */
  encoding?: BufferEncoding;
}

/** Synchronously read + parse + (optionally) validate a config file. */
export function loadConfig<T = unknown>(options: LoadConfigOptions<T>): T {
  const text = readFileSync(options.file, options.encoding ?? "utf8");
  const parser = options.parser ?? JSON.parse;
  const parsed = parser(text);
  return options.schema !== undefined ? options.schema(parsed) : (parsed as T);
}

/** Asynchronous variant of {@link loadConfig}. */
export async function loadConfigAsync<T = unknown>(options: LoadConfigOptions<T>): Promise<T> {
  const text = await readFileAsync(options.file, options.encoding ?? "utf8");
  const parser = options.parser ?? JSON.parse;
  const parsed = parser(text);
  return options.schema !== undefined ? options.schema(parsed) : (parsed as T);
}

/**
 * Build a typed lookup over a `Record<key, value>` table. Throws on missing
 * keys so config typos surface at startup, not at use.
 *
 * @example
 * ```ts
 * const roles = lookup(config.roles, "role");
 * const modId = roles("moderator"); // string; throws if "moderator" is absent
 * ```
 */
export function lookup<K extends string, V>(
  table: Readonly<Record<K, V>>,
  resourceName: string = "key",
): (key: K) => V {
  return (key) => {
    const value = table[key];
    if (value === undefined) {
      throw new Error(`spearkit: ${resourceName} "${String(key)}" not found in config`);
    }
    return value;
  };
}

/** Build a non-throwing lookup that returns `undefined` for missing keys. */
export function lookupOptional<K extends string, V>(
  table: Readonly<Record<K, V>>,
): (key: K) => V | undefined {
  return (key) => table[key];
}
