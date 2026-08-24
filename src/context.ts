import {
  MessageFlags,
  PermissionsBitField,
  type InteractionEditReplyOptions,
  type InteractionReplyOptions,
  type InteractionResponse,
  type Message,
  type PermissionResolvable,
  type PermissionsString,
  type RepliableInteraction,
} from "discord.js";
import type { Client } from "discord.js";
import { awaitMessage, type AwaitMessageOptions } from "./collectors.js";
import { Embeds, defaultEmbeds, type EmbedLevel, type EmbedPresetInput } from "./embeds.js";
import type { I18n, TranslationParams } from "./i18n.js";

/** A client (or anything client-shaped) that may expose a configured {@link Embeds}. */
type EmbedHost = Client & { embeds?: Embeds };
type I18nHost = Client & { i18n?: I18n };

/** Reply options with an ergonomic `ephemeral` shortcut (mapped to flags). */
export type ReplyData = InteractionReplyOptions & { ephemeral?: boolean };

/** Either a plain string or full reply options. */
export type ReplyInput = string | ReplyData;

type Flags = InteractionReplyOptions["flags"];

function withEphemeralFlag(flags: Flags): Flags {
  if (flags == null) return MessageFlags.Ephemeral;
  if (typeof flags === "number" || typeof flags === "bigint") {
    return Number(flags) | MessageFlags.Ephemeral;
  }
  if (Array.isArray(flags)) return [...flags, MessageFlags.Ephemeral] as Flags;
  return [flags, MessageFlags.Ephemeral] as Flags;
}

const IS_COMPONENTS_V2 = MessageFlags.IsComponentsV2 as number;

/** The only top-level component type allowed on legacy (non-V2) messages. */
const ACTION_ROW_TYPE = 1;

function isV2FlagValue(flag: unknown): boolean {
  return flag === IS_COMPONENTS_V2 || flag === "IsComponentsV2";
}

function flagsIncludeV2(flags: Flags): boolean {
  if (flags == null) return false;
  if (typeof flags === "number" || typeof flags === "bigint") {
    return (Number(flags) & IS_COMPONENTS_V2) !== 0;
  }
  if (Array.isArray(flags)) return flags.some(isV2FlagValue);
  return isV2FlagValue(flags);
}

function withV2Flag(flags: Flags): Flags {
  if (flags == null) return IS_COMPONENTS_V2;
  if (typeof flags === "number" || typeof flags === "bigint") {
    return Number(flags) | IS_COMPONENTS_V2;
  }
  if (Array.isArray(flags)) {
    if (flags.some(isV2FlagValue)) return flags;
    return [...flags, IS_COMPONENTS_V2] as Flags;
  }
  return [flags, IS_COMPONENTS_V2] as Flags;
}

/**
 * A components array is a V2 tree when it contains anything beyond plain
 * action rows (containers, text displays, sections, galleries, …).
 */
function isComponentsV2Tree(components: unknown): boolean {
  if (!Array.isArray(components)) return false;
  return components.some((component) => {
    const type = readComponentType(component);
    return type !== undefined && type !== ACTION_ROW_TYPE;
  });
}

function readComponentType(component: unknown): number | undefined {
  if (component == null || typeof component !== "object") return undefined;
  const direct = component as { type?: unknown };
  if (typeof direct.type === "number") return direct.type;
  const encodable = component as { toJSON?: () => { type?: unknown } };
  const json = encodable.toJSON?.();
  return typeof json?.type === "number" ? json.type : undefined;
}

/**
 * Discord forbids mixing V2 layout components with the classic payload
 * surface; enforce that instead of letting the API reject the reply.
 */
function assertV2Payload(input: ReplyData): void {
  const payload = input as Record<string, unknown>;
  const forbidden = (["content", "embeds", "poll", "stickers"] as const).filter(
    (key) => payload[key] !== undefined,
  );
  if (forbidden.length > 0) {
    throw new Error(
      `spearkit: replies flagged MessageFlags.IsComponentsV2 cannot set ${forbidden.join(", ")} — use components instead`,
    );
  }
}

/** Normalises spearkit reply input into a discord.js reply payload. */
export function normalizeReply(input: ReplyInput): InteractionReplyOptions {
  if (typeof input === "string") return { content: input };
  const { ephemeral, ...rest } = input;

  if (flagsIncludeV2(rest.flags)) {
    assertV2Payload(rest);
    return ephemeral ? { ...rest, flags: withEphemeralFlag(rest.flags) } : rest;
  }
  if (isComponentsV2Tree(rest.components)) {
    assertV2Payload(rest);
    return { ...rest, flags: withV2Flag(ephemeral ? withEphemeralFlag(rest.flags) : rest.flags) };
  }

  if (ephemeral) return { ...rest, flags: withEphemeralFlag(rest.flags) };
  return rest;
}

function normalizeEdit(input: ReplyInput): InteractionEditReplyOptions {
  if (typeof input === "string") return { content: input };
  const { ephemeral: _ephemeral, flags: _flags, ...rest } = input;
  return rest;
}

/** Marks an input as ephemeral, regardless of how it was passed. */
export function asEphemeral(input: ReplyInput): ReplyData {
  if (typeof input === "string") return { content: input, ephemeral: true };
  return { ...input, ephemeral: true };
}

/**
 * Ergonomic base wrapper shared by every interaction context (commands,
 * buttons, selects, modals). Exposes the common actor/location accessors plus
 * reply helpers that smooth over discord.js' state machine.
 */
export abstract class BaseContext<I extends RepliableInteraction = RepliableInteraction> {
  constructor(readonly interaction: I) {}

  get client(): I["client"] {
    return this.interaction.client;
  }
  get user() {
    return this.interaction.user;
  }
  get member() {
    return this.interaction.member;
  }
  get guild() {
    return this.interaction.guild;
  }
  get guildId() {
    return this.interaction.guildId;
  }
  get channel() {
    return this.interaction.channel;
  }
  get channelId() {
    return this.interaction.channelId;
  }
  get locale() {
    return this.interaction.locale;
  }

  /**
   * Translate with the configured `client.i18n`. The locale may be resolved
   * asynchronously (for example from per-guild settings).
   */
  t(key: string, params: TranslationParams = {}): Promise<string> {
    const i18n = (this.interaction.client as I18nHost).i18n;
    if (i18n === undefined) {
      return Promise.reject(
        new Error("spearkit: ctx.t() requires new SpearClient({ i18n })"),
      );
    }
    return i18n.translateFor(
      {
        locale: this.interaction.locale,
        guildLocale: this.interaction.guildLocale,
        guildId: this.interaction.guildId,
        userId: this.interaction.user.id,
      },
      key,
      params,
    );
  }
  /** Whether the interaction is already deferred. */
  get deferred() {
    return this.interaction.deferred;
  }
  /** Whether the interaction already received an initial response. */
  get replied() {
    return this.interaction.replied;
  }

  /** Send the initial response to the interaction. */
  reply(input: ReplyInput): Promise<InteractionResponse<boolean>> {
    return this.interaction.reply(normalizeReply(input));
  }

  /** Reply, but always hidden to everyone except the invoking user. */
  replyEphemeral(input: ReplyInput): Promise<InteractionResponse<boolean>> {
    return this.reply(asEphemeral(input));
  }

  /** Acknowledge now and respond later via {@link editReply}. */
  defer(options: { ephemeral?: boolean } = {}): Promise<InteractionResponse<boolean>> {
    return this.interaction.deferReply(
      options.ephemeral ? { flags: MessageFlags.Ephemeral } : {},
    );
  }

  /** Edit the original (or deferred) response. */
  editReply(input: ReplyInput): Promise<Message> {
    return this.interaction.editReply(normalizeEdit(input));
  }

  /** Add an additional message after the initial response. */
  followUp(input: ReplyInput): Promise<Message> {
    return this.interaction.followUp(normalizeReply(input));
  }

  /**
   * State-aware send: replies, edits a deferred response, or follows up —
   * whichever is valid given the current interaction state. The single method
   * most handlers ever need.
   */
  async send(input: ReplyInput): Promise<void> {
    if (this.interaction.deferred) {
      await this.editReply(input);
    } else if (this.interaction.replied) {
      await this.followUp(input);
    } else {
      await this.reply(input);
    }
  }

  /** The bot's resolved permissions in the current channel. */
  get botPermissions(): Readonly<PermissionsBitField> {
    return this.interaction.appPermissions;
  }

  /**
   * Permission flag names the BOT is missing in the current channel — empty when
   * it has them all. Zero-fetch: reads the permissions Discord attached to the
   * interaction. Use before an action that needs elevated permissions.
   */
  botMissing(required: PermissionResolvable): PermissionsString[] {
    return this.interaction.appPermissions.missing(required);
  }

  /** Permission flag names the invoking USER is missing in the current channel. */
  userMissing(required: PermissionResolvable): PermissionsString[] {
    const held = this.interaction.memberPermissions;
    if (held === null) return new PermissionsBitField(required).toArray();
    return held.missing(required);
  }

  /**
   * Wait for the next message in this channel from `userId` (defaults to the
   * invoking user), resolving to it or `null` on timeout. The "type your answer"
   * flow without hand-rolling a collector.
   */
  awaitMessageFrom(
    userId: string = this.user.id,
    options: AwaitMessageOptions = {},
  ): Promise<Message | null> {
    const channel = this.interaction.channel;
    if (channel === null || !("awaitMessages" in channel)) return Promise.resolve(null);
    const extra = options.filter;
    return awaitMessage(channel, {
      time: options.time,
      filter: (message) => message.author.id === userId && (extra?.(message) ?? true),
    });
  }

  /** Get the configured {@link Embeds} factory — `client.embeds` or the default. */
  protected getEmbeds(): Embeds {
    return (this.interaction.client as EmbedHost).embeds ?? defaultEmbeds;
  }

  /** State-aware send of a red error embed. Defaults to ephemeral. */
  error(input: EmbedPresetInput, options: { ephemeral?: boolean } = {}): Promise<void> {
    return this.sendPreset("error", input, { ephemeral: options.ephemeral ?? true });
  }

  /** State-aware send of a green success embed. */
  success(input: EmbedPresetInput, options: { ephemeral?: boolean } = {}): Promise<void> {
    return this.sendPreset("success", input, options);
  }

  /** State-aware send of a blue info embed. */
  info(input: EmbedPresetInput, options: { ephemeral?: boolean } = {}): Promise<void> {
    return this.sendPreset("info", input, options);
  }

  /** State-aware send of a yellow warn embed. */
  warn(input: EmbedPresetInput, options: { ephemeral?: boolean } = {}): Promise<void> {
    return this.sendPreset("warn", input, options);
  }

  /** Initial-reply variant of {@link error} (always `reply`, never `editReply`/`followUp`). */
  replyError(input: EmbedPresetInput, options: { ephemeral?: boolean } = {}): Promise<InteractionResponse<boolean>> {
    return this.replyPreset("error", input, { ephemeral: options.ephemeral ?? true });
  }

  /** Initial-reply variant of {@link success}. */
  replySuccess(input: EmbedPresetInput, options: { ephemeral?: boolean } = {}): Promise<InteractionResponse<boolean>> {
    return this.replyPreset("success", input, options);
  }

  /** Initial-reply variant of {@link info}. */
  replyInfo(input: EmbedPresetInput, options: { ephemeral?: boolean } = {}): Promise<InteractionResponse<boolean>> {
    return this.replyPreset("info", input, options);
  }

  /** Initial-reply variant of {@link warn}. */
  replyWarn(input: EmbedPresetInput, options: { ephemeral?: boolean } = {}): Promise<InteractionResponse<boolean>> {
    return this.replyPreset("warn", input, options);
  }

  private sendPreset(level: EmbedLevel, input: EmbedPresetInput, options: { ephemeral?: boolean }): Promise<void> {
    const embed = this.getEmbeds().build(level, input);
    return this.send({ embeds: [embed], ephemeral: options.ephemeral });
  }

  private replyPreset(level: EmbedLevel, input: EmbedPresetInput, options: { ephemeral?: boolean }): Promise<InteractionResponse<boolean>> {
    const embed = this.getEmbeds().build(level, input);
    return this.reply({ embeds: [embed], ephemeral: options.ephemeral });
  }
}
