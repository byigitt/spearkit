/**
 * Components V2 layout sugar — thin wrappers over discord.js' display-component
 * builders (`TextDisplay`, `Separator`, `Container`, `Section`, `MediaGallery`,
 * `File`, `Thumbnail`). spearkit adds no routing here: V2 layouts are static,
 * and interactive children stay ordinary `button(...).build()` rows.
 *
 * Pass the result via `ctx.reply({ flags: MessageFlags.IsComponentsV2, components })`
 * — or just include a non-action-row component and spearkit ORs the flag for you.
 * A V2 message cannot also set `content`, `embeds`, `poll` or `stickers`.
 */
import {
  ActionRowBuilder,
  ContainerBuilder,
  FileBuilder,
  MediaGalleryBuilder,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  ThumbnailBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";

/** Anything that can sit inside a container or at the top level of a V2 message. */
export type V2Child =
  | TextDisplayBuilder
  | SeparatorBuilder
  | SectionBuilder
  | MediaGalleryBuilder
  | FileBuilder
  | ActionRowBuilder<MessageActionRowComponentBuilder>;

/** Config for {@link separator}. */
export interface SeparatorConfig {
  spacing?: SeparatorSpacingSize;
  divider?: boolean;
}

/** Config for {@link thumbnail}. */
export interface ThumbnailConfig {
  url: string;
  description?: string;
  spoiler?: boolean;
}

/** Accessory accepted by {@link section}: an API button or a ButtonBuilder. */
export type SectionButton =
  | Parameters<SectionBuilder["setButtonAccessory"]>[0];

/** Config for {@link section}: side text plus exactly one accessory. */
export interface SectionConfig {
  children: readonly (TextDisplayBuilder | string)[];
  button?: SectionButton;
  thumbnail?: ThumbnailConfig;
}

/** One media gallery entry. */
export interface GalleryItem {
  url: string;
  description?: string;
  spoiler?: boolean;
}

/** Config for {@link container}. */
export interface ContainerConfig {
  accentColor?: number;
  spoiler?: boolean;
  children: readonly V2Child[];
}

/** A text display block (Discord-flavoured markdown allowed). */
export function textDisplay(content: string): TextDisplayBuilder {
  return new TextDisplayBuilder().setContent(content);
}

/** A spacing/divider block. */
export function separator(config: SeparatorConfig = {}): SeparatorBuilder {
  const builder = new SeparatorBuilder();
  if (config.spacing !== undefined) builder.setSpacing(config.spacing);
  if (config.divider !== undefined) builder.setDivider(config.divider);
  return builder;
}

/** An inline thumbnail (used as a section accessory). */
export function thumbnail(config: ThumbnailConfig): ThumbnailBuilder {
  const builder = new ThumbnailBuilder().setURL(config.url);
  if (config.description !== undefined) builder.setDescription(config.description);
  if (config.spoiler) builder.setSpoiler(true);
  return builder;
}

/** Side-by-side layout: text displays next to one button or thumbnail. */
export function section(config: SectionConfig): SectionBuilder {
  const builder = new SectionBuilder();
  builder.addTextDisplayComponents(
    ...config.children.map((child) => (typeof child === "string" ? textDisplay(child) : child)),
  );
  if (config.button !== undefined) {
    builder.setButtonAccessory(config.button);
  } else if (config.thumbnail !== undefined) {
    builder.setThumbnailAccessory(thumbnail(config.thumbnail));
  }
  return builder;
}

/** A grid of remote images/videos. */
export function mediaGallery(items: readonly GalleryItem[]): MediaGalleryBuilder {
  return new MediaGalleryBuilder().addItems(
    items.map((item) => ({
      media: { url: item.url },
      description: item.description,
      spoiler: item.spoiler,
    })),
  );
}

/** An attached-file block referencing `attachment://…` or a URL. */
export function file(url: string, config: { spoiler?: boolean } = {}): FileBuilder {
  const builder = new FileBuilder({ file: { url } });
  if (config.spoiler) builder.setSpoiler(true);
  return builder;
}

/**
 * A card: accent-coloured box holding text displays, separators, sections,
 * galleries, files and action rows. Containers cannot be nested.
 */
export function container(config: ContainerConfig): ContainerBuilder {
  const builder = new ContainerBuilder();
  if (config.accentColor !== undefined) builder.setAccentColor(config.accentColor);
  if (config.spoiler) builder.setSpoiler(true);
  for (const child of config.children) {
    if (child instanceof TextDisplayBuilder) builder.addTextDisplayComponents(child);
    else if (child instanceof SeparatorBuilder) builder.addSeparatorComponents(child);
    else if (child instanceof SectionBuilder) builder.addSectionComponents(child);
    else if (child instanceof MediaGalleryBuilder) builder.addMediaGalleryComponents(child);
    else if (child instanceof FileBuilder) builder.addFileComponents(child);
    else builder.addActionRowComponents(child as ActionRowBuilder<MessageActionRowComponentBuilder>);
  }
  return builder;
}
