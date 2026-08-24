/**
 * Choice-list helpers for slash options and autocomplete.
 *
 * Discord caps autocomplete at 25 suggestions. {@link filterChoices} keeps that
 * limit and matches on both the visible name and the stored value.
 */
import type { OptionChoice } from "./commands/options.js";

/** Build `{ name, value }` choices from a display→value map. */
export function choices<const T extends Record<string, string | number>>(
  map: T,
): { name: Extract<keyof T, string>; value: T[Extract<keyof T, string>] }[];
/** Build choices where the Discord name and value are the same string. */
export function choices<const T extends readonly string[]>(
  ...values: T
): { name: T[number]; value: T[number] }[];
export function choices(
  mapOrFirst: Record<string, string | number> | string,
  ...rest: string[]
): OptionChoice[] {
  if (typeof mapOrFirst === "string") {
    return [mapOrFirst, ...rest].map((value) => ({ name: value, value }));
  }
  return Object.entries(mapOrFirst).map(([name, value]) => ({ name, value }));
}

/** Options for {@link filterChoices}. */
export interface FilterChoicesOptions {
  /** Maximum suggestions returned. Default 25 (Discord's autocomplete cap). */
  limit?: number;
}

function asChoices<V extends string | number>(
  items: readonly OptionChoice<V>[] | readonly string[],
): OptionChoice<V>[] {
  return items.map((item) =>
    typeof item === "string" ? { name: item, value: item as V } : item,
  );
}

/**
 * Filter a choice list by the user's current autocomplete query.
 *
 * Empty query returns the first `limit` items. Matching is case-insensitive
 * and looks at both `name` and `value`.
 */
export function filterChoices<V extends string | number>(
  items: readonly OptionChoice<V>[] | readonly string[],
  query: string,
  options: FilterChoicesOptions = {},
): OptionChoice<V>[] {
  const limit = options.limit ?? 25;
  const all = asChoices(items);
  const needle = query.trim().toLowerCase();
  const matched =
    needle.length === 0
      ? all
      : all.filter(
          (choice) =>
            choice.name.toLowerCase().includes(needle) ||
            String(choice.value).toLowerCase().includes(needle),
        );
  return matched.slice(0, limit);
}
