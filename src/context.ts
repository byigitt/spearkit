import {
  MessageFlags,
  type InteractionEditReplyOptions,
  type InteractionReplyOptions,
  type InteractionResponse,
  type Message,
  type RepliableInteraction,
} from "discord.js";

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

/** Normalises spear reply input into a discord.js reply payload. */
export function normalizeReply(input: ReplyInput): InteractionReplyOptions {
  if (typeof input === "string") return { content: input };
  const { ephemeral, ...rest } = input;
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

  /** State-aware ephemeral error message. */
  error(message: string): Promise<void> {
    return this.send(asEphemeral(message));
  }
}
