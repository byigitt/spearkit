/**
 * Preset embeds — `error`, `success`, `info`, `warn` — with consistent colors
 * and icons so every reply in your bot looks the same. The client owns one as
 * `client.embeds` and the context preset methods (`ctx.success(...)` etc.) use
 * it; you can also call `embeds.error(...)` directly to build an embed for
 * `channel.send({ embeds: [...] })`.
 */
import {
  EmbedBuilder,
  type APIEmbedAuthor,
  type APIEmbedField,
  type APIEmbedFooter,
} from "discord.js";

/** Color in `0xRRGGBB` form for each preset level. */
export interface EmbedColors {
  error: number;
  success: number;
  info: number;
  warn: number;
}

/** Icon glyph prepended to the description of each preset. Pass `""` to drop. */
export interface EmbedIcons {
  error: string;
  success: string;
  info: string;
  warn: string;
}

/** Construction options for {@link Embeds}. Missing fields fall back to defaults. */
export interface EmbedsOptions {
  /** Per-level color overrides. */
  colors?: Partial<EmbedColors>;
  /** Per-level icon overrides; pass `""` to drop the prefix for a level. */
  icons?: Partial<EmbedIcons>;
}

/** Shape accepted by every preset: a plain string or a structured body. */
export type EmbedPresetInput =
  | string
  | {
      title?: string;
      description?: string;
      fields?: readonly APIEmbedField[];
      footer?: APIEmbedFooter;
      author?: APIEmbedAuthor;
      url?: string;
      timestamp?: Date | number | string;
      thumbnail?: { url: string };
      image?: { url: string };
    };

/** One of the four built-in preset levels. */
export type EmbedLevel = "error" | "success" | "info" | "warn";

/** Discord-ish defaults: red / green / blue / yellow + ⛔ ✅ ℹ️ ⚠️. */
export const DEFAULT_EMBED_COLORS: EmbedColors = {
  error: 0xf04a47,
  success: 0x43b582,
  info: 0x3498db,
  warn: 0xf9a825,
};

/** Default icons: warning / check / info / triangle. */
export const DEFAULT_EMBED_ICONS: EmbedIcons = {
  error: "⛔",
  success: "✅",
  info: "ℹ️",
  warn: "⚠️",
};

/**
 * Builds preset embeds with consistent colors and icons.
 *
 * @example
 * ```ts
 * const embeds = new Embeds({ colors: { success: 0x00ff88 } });
 * await channel.send({ embeds: [embeds.success("Saved.")] });
 * ```
 */
export class Embeds {
  /** The resolved colors for every preset. */
  readonly colors: EmbedColors;
  /** The resolved icons for every preset. */
  readonly icons: EmbedIcons;

  constructor(options: EmbedsOptions = {}) {
    this.colors = { ...DEFAULT_EMBED_COLORS, ...options.colors };
    this.icons = { ...DEFAULT_EMBED_ICONS, ...options.icons };
  }

  /** Red preset — something went wrong. */
  error(input: EmbedPresetInput): EmbedBuilder {
    return this.build("error", input);
  }

  /** Green preset — something succeeded. */
  success(input: EmbedPresetInput): EmbedBuilder {
    return this.build("success", input);
  }

  /** Blue preset — neutral information. */
  info(input: EmbedPresetInput): EmbedBuilder {
    return this.build("info", input);
  }

  /** Yellow preset — caution. */
  warn(input: EmbedPresetInput): EmbedBuilder {
    return this.build("warn", input);
  }

  /** Build an embed at a chosen level. */
  build(level: EmbedLevel, input: EmbedPresetInput): EmbedBuilder {
    const builder = new EmbedBuilder().setColor(this.colors[level]);
    const icon = this.icons[level];
    const prefix = icon.length > 0 ? `${icon} ` : "";
    if (typeof input === "string") {
      builder.setDescription(`${prefix}${input}`);
      return builder;
    }
    if (input.title !== undefined) builder.setTitle(input.title);
    if (input.description !== undefined) {
      builder.setDescription(`${prefix}${input.description}`);
    }
    if (input.fields !== undefined) builder.addFields(...input.fields);
    if (input.footer !== undefined) builder.setFooter(input.footer);
    if (input.author !== undefined) builder.setAuthor(input.author);
    if (input.url !== undefined) builder.setURL(input.url);
    if (input.timestamp !== undefined) {
      builder.setTimestamp(
        input.timestamp instanceof Date ? input.timestamp : new Date(input.timestamp),
      );
    }
    if (input.thumbnail !== undefined) builder.setThumbnail(input.thumbnail.url);
    if (input.image !== undefined) builder.setImage(input.image.url);
    return builder;
  }
}

/** The shared default factory — used by contexts when the client has none. */
export const defaultEmbeds = new Embeds();
