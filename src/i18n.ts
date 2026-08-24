/**
 * Dependency-free runtime translations with Discord-aware locale fallback.
 *
 * Catalogs use flat keys (`"commands.ping.reply"`). Exact locales fall back to
 * their language (`"tr-TR"` → `"tr"`), then `fallbackLocale`, then
 * `defaultLocale`. A custom async resolver can load per-guild/user preferences.
 */
import type { Awaitable } from "discord.js";

export type TranslationParam =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;
export type TranslationParams = Readonly<Record<string, TranslationParam>>;
export type TranslationValue =
  | string
  | ((params: TranslationParams) => string);
export type TranslationCatalog = Readonly<Record<string, TranslationValue>>;
export type TranslationMessages = Readonly<
  Record<string, TranslationCatalog>
>;

type KeysOfUnion<T> = T extends unknown ? keyof T : never;
export type MessageKey<M extends TranslationMessages> = Extract<
  KeysOfUnion<M[keyof M]>,
  string
>;

/** Actor/location data supplied to an async locale resolver. */
export interface LocaleTarget {
  /** Discord's interaction locale, when available. */
  locale?: string | null;
  /** The guild's preferred locale, when available. */
  guildLocale?: string | null;
  guildId?: string | null;
  userId: string;
}

export type LocaleResolver = (
  target: LocaleTarget,
) => Awaitable<string | null | undefined>;

export interface I18nOptions<M extends TranslationMessages = TranslationMessages> {
  messages: M;
  defaultLocale: string;
  /** Extra fallback tried before `defaultLocale`. */
  fallbackLocale?: string;
  /** Override locale per user/guild; may read an async settings store. */
  resolveLocale?: LocaleResolver;
  /** Customize missing keys. Default: return the key itself. */
  missing?: (key: string, locale: string) => string;
}

function normalizeLocale(locale: string): string {
  return locale.trim().replace(/_/g, "-").toLowerCase();
}

function baseLocale(locale: string): string | undefined {
  const separator = locale.indexOf("-");
  return separator === -1 ? undefined : locale.slice(0, separator);
}

function interpolate(template: string, params: TranslationParams): string {
  return template.replace(/\{([A-Za-z0-9_.-]+)\}/g, (placeholder, key: string) => {
    const value = params[key];
    if (value === undefined) return placeholder;
    if (value === null) return "";
    return value instanceof Date ? value.toISOString() : String(value);
  });
}

/** Runtime translator. Prefer {@link createI18n} to infer message keys. */
export class I18n<K extends string = string> {
  readonly defaultLocale: string;
  readonly fallbackLocale?: string;
  private readonly catalogs = new Map<string, TranslationCatalog>();
  private readonly resolveCustom?: LocaleResolver;
  private readonly missing: (key: string, locale: string) => string;

  constructor(options: I18nOptions) {
    if (options.defaultLocale.trim().length === 0) {
      throw new Error("spearkit: i18n defaultLocale cannot be empty");
    }
    this.defaultLocale = normalizeLocale(options.defaultLocale);
    this.fallbackLocale =
      options.fallbackLocale === undefined
        ? undefined
        : normalizeLocale(options.fallbackLocale);
    this.resolveCustom = options.resolveLocale;
    this.missing = options.missing ?? ((key) => key);

    for (const [locale, catalog] of Object.entries(options.messages)) {
      this.catalogs.set(normalizeLocale(locale), catalog);
    }
    const defaultBase = baseLocale(this.defaultLocale);
    if (
      !this.catalogs.has(this.defaultLocale) &&
      (defaultBase === undefined || !this.catalogs.has(defaultBase))
    ) {
      throw new Error(
        `spearkit: i18n messages must include defaultLocale "${options.defaultLocale}" or its base language`,
      );
    }
  }

  /** Resolve a key synchronously for an explicit locale. */
  t(locale: string, key: K, params: TranslationParams = {}): string {
    const normalized = normalizeLocale(locale);
    const candidates = [
      normalized,
      baseLocale(normalized),
      this.fallbackLocale,
      this.fallbackLocale === undefined
        ? undefined
        : baseLocale(this.fallbackLocale),
      this.defaultLocale,
      baseLocale(this.defaultLocale),
    ].filter((candidate, index, all): candidate is string =>
      candidate !== undefined && all.indexOf(candidate) === index,
    );

    for (const candidate of candidates) {
      const value = this.catalogs.get(candidate)?.[key];
      if (value === undefined) continue;
      return typeof value === "function"
        ? value(params)
        : interpolate(value, params);
    }
    return this.missing(key, normalized);
  }

  /** Resolve the target locale (including an optional async override). */
  async localeFor(target: LocaleTarget): Promise<string> {
    const custom = await this.resolveCustom?.(target);
    return normalizeLocale(
      custom ?? target.locale ?? target.guildLocale ?? this.defaultLocale,
    );
  }

  /** Resolve locale + translate for a Discord handler target. */
  async translateFor(
    target: LocaleTarget,
    key: K,
    params: TranslationParams = {},
  ): Promise<string> {
    return this.t(await this.localeFor(target), key, params);
  }
}

/** Create an {@link I18n} while inferring the union of catalog keys. */
export function createI18n<const M extends TranslationMessages>(
  options: I18nOptions<M>,
): I18n<MessageKey<M>> {
  return new I18n(options) as I18n<MessageKey<M>>;
}
