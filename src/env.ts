/**
 * A tiny, dependency-free `.env` loader plus a typed reader for
 * `process.env`. Pulls your existing environment in directly — no `dotenv`
 * package required — and parses values the way `dotenv` does (quotes, `export`
 * prefixes, `#` comments, `\n` escapes in double quotes).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** The flat key/value map parsed from a `.env` file. */
export type ParsedEnv = Record<string, string>;

/** Options for {@link loadEnv}. */
export interface LoadEnvOptions {
  /** File to read. Default `.env` in the current working directory. */
  path?: string;
  /** Overwrite variables already present in `process.env`. Default `false`. */
  override?: boolean;
}

function stripInlineComment(value: string): string {
  // A `#` that starts a comment must be preceded by whitespace (or be the
  // whole value); `pass#1` is a literal, `value # note` is not.
  const match = /\s#/.exec(value);
  return match !== null ? value.slice(0, match.index).trimEnd() : value;
}

function unquote(raw: string): string {
  if (raw.length >= 2) {
    const quote = raw[0];
    if ((quote === '"' || quote === "'") && raw.endsWith(quote)) {
      const inner = raw.slice(1, -1);
      return quote === '"'
        ? inner.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t")
        : inner;
    }
  }
  return stripInlineComment(raw);
}

/** Parse `.env`-formatted text into a flat object. Does not touch `process.env`. */
export function parseEnv(content: string): ParsedEnv {
  const out: ParsedEnv = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith("#")) continue;
    const body = line.startsWith("export ") ? line.slice(7).trimStart() : line;
    const eq = body.indexOf("=");
    if (eq <= 0) continue;
    const key = body.slice(0, eq).trim();
    if (key.length === 0) continue;
    out[key] = unquote(body.slice(eq + 1).trim());
  }
  return out;
}

/**
 * Read a `.env` file and merge it into `process.env`. Existing variables win
 * unless `override` is set. Missing files are ignored (returns `{}`), so it is
 * safe to call unconditionally.
 *
 * @returns the parsed key/value pairs from the file.
 */
export function loadEnv(options: LoadEnvOptions = {}): ParsedEnv {
  const path = options.path ?? join(process.cwd(), ".env");
  let content: string;
  try {
    content = readFileSync(path, "utf8");
  } catch {
    return {};
  }
  const parsed = parseEnv(content);
  for (const [key, value] of Object.entries(parsed)) {
    if (options.override === true || process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
  return parsed;
}

const TRUTHY = new Set(["true", "1", "yes", "on"]);
const FALSY = new Set(["false", "0", "no", "off"]);

function read(key: string): string | undefined {
  const value = process.env[key];
  return value !== undefined && value !== "" ? value : undefined;
}

function envString(key: string): string | undefined;
function envString(key: string, fallback: string): string;
function envString(key: string, fallback?: string): string | undefined {
  return read(key) ?? fallback;
}

function envNumber(key: string): number | undefined;
function envNumber(key: string, fallback: number): number;
function envNumber(key: string, fallback?: number): number | undefined {
  const value = read(key);
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function envBoolean(key: string): boolean | undefined;
function envBoolean(key: string, fallback: boolean): boolean;
function envBoolean(key: string, fallback?: boolean): boolean | undefined {
  const value = read(key)?.toLowerCase();
  if (value === undefined) return fallback;
  if (TRUTHY.has(value)) return true;
  if (FALSY.has(value)) return false;
  return fallback;
}

function envRequire(key: string): string {
  const value = read(key);
  if (value === undefined) {
    throw new Error(`spearkit: required environment variable "${key}" is missing or empty`);
  }
  return value;
}

/** Typed, ergonomic reader over `process.env`. */
export interface EnvReader {
  /** A string value (empty strings count as missing), or `undefined`/`fallback`. */
  string(key: string): string | undefined;
  string(key: string, fallback: string): string;
  /** A numeric value, or `undefined`/`fallback` when missing or non-numeric. */
  number(key: string): number | undefined;
  number(key: string, fallback: number): number;
  /** A boolean (`true/1/yes/on` vs `false/0/no/off`), or `undefined`/`fallback`. */
  boolean(key: string): boolean | undefined;
  boolean(key: string, fallback: boolean): boolean;
  /** A string value, throwing if the variable is missing or empty. */
  require(key: string): string;
}

/**
 * Typed accessor over `process.env`.
 *
 * @example
 * ```ts
 * loadEnv();
 * const token = env.require("DISCORD_TOKEN");
 * const port = env.number("PORT", 3000);
 * const debug = env.boolean("DEBUG", false);
 * ```
 */
export const env: EnvReader = {
  string: envString,
  number: envNumber,
  boolean: envBoolean,
  require: envRequire,
};
