/**
 * Locale-aware duration formatter, duration parser and Discord timestamp
 * helpers. Replaces the dozens of inline `Math.floor(s/86400)`/`X gün Y saat`
 * and `<t:${secs}:R>` snippets in production bots, including the duplicate
 * `formatTimeInTurkish`-style helpers duplicated across many bot command files.
 */

/** Discord timestamp style: `t/T/d/D/f/F/R`. */
export type DiscordTimestampStyle = "t" | "T" | "d" | "D" | "f" | "F" | "R";

type DurationUnit = "week" | "day" | "hour" | "minute" | "second";

interface UnitLabels {
  week: [string, string];
  day: [string, string];
  hour: [string, string];
  minute: [string, string];
  second: [string, string];
  separator: string;
  zero: string;
}

const EN: UnitLabels = {
  week: ["week", "weeks"],
  day: ["day", "days"],
  hour: ["hour", "hours"],
  minute: ["minute", "minutes"],
  second: ["second", "seconds"],
  separator: " ",
  zero: "0 seconds",
};

const TR: UnitLabels = {
  week: ["hafta", "hafta"],
  day: ["gün", "gün"],
  hour: ["saat", "saat"],
  minute: ["dakika", "dakika"],
  second: ["saniye", "saniye"],
  separator: " ",
  zero: "0 saniye",
};

const LABELS: Record<string, UnitLabels> = {
  en: EN,
  "en-US": EN,
  "en-GB": EN,
  tr: TR,
  "tr-TR": TR,
};

const UNIT_MS: Record<DurationUnit, number> = {
  week: 7 * 86_400_000,
  day: 86_400_000,
  hour: 3_600_000,
  minute: 60_000,
  second: 1000,
};

const UNIT_ORDER: DurationUnit[] = ["week", "day", "hour", "minute", "second"];

/** Options for {@link formatDuration}. */
export interface FormatDurationOptions {
  /** Locale label set: `"en"`, `"en-US"`, `"tr"`, `"tr-TR"`, or a custom set. */
  locale?: string | UnitLabels;
  /** How many non-zero units to keep. Default `2`. Pass `Infinity` to keep all. */
  largest?: number;
  /** Subset of units to consider (in order: week → second). */
  units?: readonly DurationUnit[];
}

function resolveLabels(locale: FormatDurationOptions["locale"]): UnitLabels {
  if (typeof locale === "object" && locale !== null) return locale;
  if (locale === undefined) return EN;
  return LABELS[locale] ?? LABELS[locale.split("-")[0] ?? ""] ?? EN;
}

/**
 * Format a millisecond duration into human-readable text.
 *
 * @example
 * ```ts
 * formatDuration(3_725_000);                         // "1 hour 2 minutes"
 * formatDuration(3_725_000, { locale: "tr" });       // "1 saat 2 dakika"
 * formatDuration(86_400_000 * 9, { largest: 3 });    // "1 week 2 days"
 * ```
 */
export function formatDuration(ms: number, options: FormatDurationOptions = {}): string {
  const labels = resolveLabels(options.locale);
  if (!Number.isFinite(ms) || ms <= 0) return labels.zero;
  const limit = options.largest ?? 2;
  const units = options.units ?? UNIT_ORDER;
  const parts: string[] = [];
  let remaining = Math.floor(ms);
  for (const unit of units) {
    if (parts.length >= limit) break;
    const size = UNIT_MS[unit];
    if (remaining < size) continue;
    const value = Math.floor(remaining / size);
    remaining -= value * size;
    const word = value === 1 ? labels[unit][0] : labels[unit][1];
    parts.push(`${value} ${word}`);
  }
  return parts.length > 0 ? parts.join(labels.separator) : labels.zero;
}

const DURATION_PATTERN = /(\d+(?:\.\d+)?)\s*(milliseconds|millisecond|seconds|minutes|saniye|dakika|minute|second|weeks|hours|hafta|saat|week|hour|days|day|gün|gun|min|sec|ms|wk|hr|dk|m|s|h|d|w)/gi;
const SHORT_TO_MS: Record<string, number> = {
  ms: 1,
  millisecond: 1,
  milliseconds: 1,
  s: 1000,
  sec: 1000,
  second: 1000,
  seconds: 1000,
  saniye: 1000,
  m: 60_000,
  min: 60_000,
  minute: 60_000,
  minutes: 60_000,
  dakika: 60_000,
  dk: 60_000,
  h: 3_600_000,
  hr: 3_600_000,
  hour: 3_600_000,
  hours: 3_600_000,
  saat: 3_600_000,
  d: 86_400_000,
  day: 86_400_000,
  days: 86_400_000,
  gün: 86_400_000,
  gun: 86_400_000,
  w: 604_800_000,
  wk: 604_800_000,
  week: 604_800_000,
  weeks: 604_800_000,
  hafta: 604_800_000,
};

/**
 * Parse a human duration like `"1h30m"`, `"2 days"`, `"1 saat 30 dakika"` or
 * `"5000ms"` into milliseconds. Returns `null` if nothing parseable was found.
 *
 * @example
 * ```ts
 * parseDuration("1h30m");      // 5_400_000
 * parseDuration("1 saat");     // 3_600_000
 * parseDuration("oops");       // null
 * ```
 */
export function parseDuration(input: string): number | null {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.length === 0) return null;
  DURATION_PATTERN.lastIndex = 0;
  let total = 0;
  let matched = false;
  for (;;) {
    const match = DURATION_PATTERN.exec(trimmed);
    if (match === null) break;
    matched = true;
    const value = Number(match[1]);
    const unit = match[2] ?? "";
    const ms = SHORT_TO_MS[unit];
    if (ms !== undefined && Number.isFinite(value)) total += value * ms;
  }
  return matched ? total : null;
}

function toEpochSeconds(date: Date | number): number {
  return Math.floor((date instanceof Date ? date.getTime() : date) / 1000);
}

/**
 * Render a Discord-flavoured timestamp tag (`<t:1234:R>`).
 *
 * Styles: `t` short time, `T` long time, `d` short date, `D` long date,
 * `f` short date/time (default), `F` long date/time, `R` relative.
 *
 * @example
 * ```ts
 * discordTimestamp(date);                  // <t:1234:f>
 * discordTimestamp(date, "R");              // <t:1234:R>
 * discordTimestamp(Date.now() + 60_000, "R"); // <t:..:R>
 * ```
 */
export function discordTimestamp(date: Date | number, style: DiscordTimestampStyle = "f"): string {
  return `<t:${toEpochSeconds(date)}:${style}>`;
}

/** Short-hand for the relative Discord timestamp (`R` style). */
export function relativeTimestamp(date: Date | number): string {
  return discordTimestamp(date, "R");
}

/** The hard cap Discord enforces on a single message's `content`. */
export const MESSAGE_CHARACTER_LIMIT = 2000;

/**
 * Truncate `text` to at most `max` characters, appending `suffix` (default `…`)
 * when it had to cut. The result — suffix included — never exceeds `max`.
 *
 * @example
 * ```ts
 * truncate("a very long reason", 10); // → "a very lo…"
 * ```
 */
export function truncate(text: string, max: number, suffix = "…"): string {
  if (max <= 0) return "";
  if (text.length <= max) return text;
  if (suffix.length >= max) return suffix.slice(0, max);
  return text.slice(0, max - suffix.length) + suffix;
}

/** Options for {@link chunkMessage}. */
export interface ChunkOptions {
  /** Maximum characters per chunk. Default {@link MESSAGE_CHARACTER_LIMIT} (2000). */
  max?: number;
}

function hardSplit(text: string, max: number): string[] {
  const out: string[] = [];
  let rest = text;
  while (rest.length > max) {
    const space = rest.lastIndexOf(" ", max);
    const cut = space > Math.floor(max / 2) ? space : max;
    out.push(rest.slice(0, cut));
    rest = rest.slice(cut).replace(/^ /, "");
  }
  if (rest.length > 0) out.push(rest);
  return out;
}

/**
 * Split `text` into chunks that each fit within Discord's per-message limit,
 * breaking on line boundaries (and word boundaries for over-long lines) so you
 * never silently lose the tail of a long reply.
 *
 * @example
 * ```ts
 * for (const part of chunkMessage(hugeLog)) await ctx.followUp(part);
 * ```
 */
export function chunkMessage(text: string, options: ChunkOptions = {}): string[] {
  const max = options.max ?? MESSAGE_CHARACTER_LIMIT;
  if (max <= 0) throw new RangeError("spearkit: chunkMessage max must be positive");
  if (text.length === 0) return [];
  if (text.length <= max) return [text];

  const chunks: string[] = [];
  let current = "";
  const flush = (): void => {
    if (current.length > 0) {
      chunks.push(current);
      current = "";
    }
  };
  for (const line of text.split("\n")) {
    if (line.length > max) {
      flush();
      const pieces = hardSplit(line, max);
      for (let i = 0; i < pieces.length - 1; i++) chunks.push(pieces[i] as string);
      current = pieces[pieces.length - 1] as string;
      continue;
    }
    const candidate = current.length > 0 ? `${current}\n${line}` : line;
    if (candidate.length > max) {
      flush();
      current = line;
    } else {
      current = candidate;
    }
  }
  flush();
  return chunks;
}
