import type {
  APIModalInteractionResponseCallbackData,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  InteractionUpdateOptions,
  JSONEncodable,
  MentionableSelectMenuInteraction,
  ModalBuilder,
  ModalComponentData,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
} from "discord.js";
import { BaseContext } from "../context.js";
import {
  showAndAwaitModal,
  type AwaitModalOptions,
  type ModalLike,
} from "../collectors.js";

type UpdateInput = string | InteractionUpdateOptions;
/** The concrete message-component interaction types (button + every select). */
export type AnyComponentInteraction =
  | ButtonInteraction
  | StringSelectMenuInteraction
  | UserSelectMenuInteraction
  | RoleSelectMenuInteraction
  | ChannelSelectMenuInteraction
  | MentionableSelectMenuInteraction;

/**
 * Base context for message-component interactions (buttons and selects).
 * Adds the component-only `update`/`deferUpdate`/`showModal` helpers and the
 * routed, typed {@link params}.
 */
export class MessageComponentContext<
  P,
  I extends AnyComponentInteraction = AnyComponentInteraction,
> extends BaseContext<I> {
  constructor(
    interaction: I,
    /** Params extracted from the custom-id pattern. */
    readonly params: P,
  ) {
    super(interaction);
  }

  /** The raw custom-id that triggered this interaction. */
  get customId(): string {
    return this.interaction.customId;
  }

  /** The message the component lives on. */
  get message() {
    return this.interaction.message;
  }

  /** Edit the message this component belongs to. */
  async update(input: UpdateInput): Promise<void> {
    await this.interaction.update(input);
  }

  /** Acknowledge the interaction without editing the message yet. */
  async deferUpdate(): Promise<void> {
    await this.interaction.deferUpdate();
  }

  /** Open a modal in response to this component. */
  async showModal(
    modal: JSONEncodable<APIModalInteractionResponseCallbackData> | ModalComponentData | ModalBuilder,
  ): Promise<void> {
    await this.interaction.showModal(modal);
  }

  /**
   * Show a modal and wait for the user to submit it, resolving to the submission
   * or `null` if they dismiss it / it times out. Scoped to this user and modal.
   */
  awaitModal(modal: ModalLike, options?: AwaitModalOptions): Promise<ModalSubmitInteraction | null> {
    return showAndAwaitModal(this.interaction, modal, options);
  }
}

/** Context for a button click. */
export class ButtonContext<P = Record<string, never>> extends MessageComponentContext<
  P,
  ButtonInteraction
> {}

/** Context for a string select; exposes the chosen {@link values}. */
export class StringSelectContext<P = Record<string, never>> extends MessageComponentContext<
  P,
  StringSelectMenuInteraction
> {
  /** All selected values. */
  get values(): string[] {
    return this.interaction.values;
  }
  /** The first selected value, or `undefined` if none. */
  get value(): string | undefined {
    return this.interaction.values[0];
  }
}

/** Context for a user select; exposes selected ids, users and members. */
export class UserSelectContext<P = Record<string, never>> extends MessageComponentContext<
  P,
  UserSelectMenuInteraction
> {
  get values(): string[] {
    return this.interaction.values;
  }
  get users() {
    return this.interaction.users;
  }
  get members() {
    return this.interaction.members;
  }
}

/** Context for a role select. */
export class RoleSelectContext<P = Record<string, never>> extends MessageComponentContext<
  P,
  RoleSelectMenuInteraction
> {
  get values(): string[] {
    return this.interaction.values;
  }
  get roles() {
    return this.interaction.roles;
  }
}

/** Context for a channel select. */
export class ChannelSelectContext<P = Record<string, never>> extends MessageComponentContext<
  P,
  ChannelSelectMenuInteraction
> {
  get values(): string[] {
    return this.interaction.values;
  }
  get channels() {
    return this.interaction.channels;
  }
}

/** Context for a mentionable (user + role) select. */
export class MentionableSelectContext<P = Record<string, never>> extends MessageComponentContext<
  P,
  MentionableSelectMenuInteraction
> {
  get values(): string[] {
    return this.interaction.values;
  }
  get users() {
    return this.interaction.users;
  }
  get roles() {
    return this.interaction.roles;
  }
  get members() {
    return this.interaction.members;
  }
}

/**
 * Context for a submitted modal. Exposes the routed {@link params} plus the
 * resolved text-input {@link fields}, keyed by the field names you declared.
 */
export class ModalContext<P, F extends string = string> extends BaseContext<ModalSubmitInteraction> {
  constructor(
    interaction: ModalSubmitInteraction,
    readonly params: P,
    /** Submitted values, keyed by the field names from your modal definition. */
    readonly fields: Record<F, string>,
  ) {
    super(interaction);
  }

  /** The raw custom-id that triggered this modal submission. */
  get customId(): string {
    return this.interaction.customId;
  }
}
