/**
 * Collector ergonomics — wait for a reply, a click, or a modal without the
 * boilerplate (and footguns) of raw discord.js collectors.
 *
 * discord.js collectors are powerful but fiddly: you wire an event emitter, set
 * a `time`, write a `filter`, remember that modal submissions can be dismissed
 * (so they need their own timeout), and translate the "timed out" rejection into
 * something your code can branch on. These helpers collapse the common cases to
 * a single `await` that resolves to the result — or `null` on timeout.
 *
 * @example
 * ```ts
 * await ctx.reply("What's your favourite colour?");
 * const reply = await ctx.awaitMessageFrom();          // same user, same channel
 * if (reply === null) return ctx.followUp("Timed out.");
 * await ctx.followUp(`Nice — ${reply.content}!`);
 * ```
 */
import type {
  APIModalInteractionResponseCallbackData,
  ChatInputCommandInteraction,
  ComponentType,
  JSONEncodable,
  Message,
  MessageComponentInteraction,
  MessageContextMenuCommandInteraction,
  ModalBuilder,
  ModalComponentData,
  ModalSubmitInteraction,
  PartialGroupDMChannel,
  TextBasedChannel,
  UserContextMenuCommandInteraction,
} from "discord.js";

/** Options for {@link awaitMessage}. */
export interface AwaitMessageOptions {
  /** Only accept messages passing this predicate. */
  filter?: (message: Message) => boolean;
  /** How long to wait, in ms. Default `60000`. */
  time?: number;
}

/**
 * A text-based channel that can collect messages — every {@link TextBasedChannel}
 * except `PartialGroupDMChannel` (which has no message manager).
 */
export type CollectableChannel = Exclude<TextBasedChannel, PartialGroupDMChannel>;

/**
 * Wait for the next message in `channel` that matches `filter`, resolving to the
 * `Message` or `null` if none arrives before `time` elapses.
 */
export async function awaitMessage(
  channel: CollectableChannel,
  options: AwaitMessageOptions = {},
): Promise<Message | null> {
  const { filter, time = 60_000 } = options;
  try {
    const collected = await channel.awaitMessages({
      filter,
      max: 1,
      time,
      errors: ["time"],
    });
    return collected.first() ?? null;
  } catch {
    return null;
  }
}

/** Options for {@link awaitComponent}. */
export interface AwaitComponentOptions {
  /** Only accept interactions passing this predicate. */
  filter?: (interaction: MessageComponentInteraction) => boolean;
  /** How long to wait, in ms. Default `60000`. */
  time?: number;
  /** Restrict to one component kind (e.g. `ComponentType.Button`). */
  componentType?: ComponentType;
}

/**
 * Wait for the next component interaction (button/select click) on `message`,
 * resolving to it or `null` on timeout. Note: you must still acknowledge the
 * returned interaction (`update`/`deferUpdate`/`reply`).
 */
export async function awaitComponent(
  message: Message,
  options: AwaitComponentOptions = {},
): Promise<MessageComponentInteraction | null> {
  const { filter, time = 60_000, componentType } = options;
  try {
    return await message.awaitMessageComponent({
      time,
      filter: (interaction) =>
        (componentType === undefined || interaction.componentType === componentType) &&
        (filter?.(interaction) ?? true),
    });
  } catch {
    return null;
  }
}

/** A modal in any of the forms discord.js' `showModal` accepts. */
export type ModalLike =
  | JSONEncodable<APIModalInteractionResponseCallbackData>
  | ModalComponentData
  | ModalBuilder;

/** Interactions that can open a modal and await its submission. */
export type ModalShowingInteraction =
  | ChatInputCommandInteraction
  | MessageComponentInteraction
  | UserContextMenuCommandInteraction
  | MessageContextMenuCommandInteraction;

/** Options for {@link showAndAwaitModal}. */
export interface AwaitModalOptions {
  /** How long to wait for submission, in ms. Default `120000`. */
  time?: number;
  /** Extra predicate on the submitted modal (already scoped to this user + modal). */
  filter?: (interaction: ModalSubmitInteraction) => boolean;
}

function resolveModalCustomId(modal: ModalLike): string | undefined {
  const m = modal as {
    data?: { custom_id?: string };
    custom_id?: string;
    customId?: string;
  };
  return m.data?.custom_id ?? m.custom_id ?? m.customId;
}

/**
 * Show `modal` on `interaction`, then wait for its submission — scoped to the
 * same user and the modal's own custom-id — resolving to the
 * {@link ModalSubmitInteraction} or `null` if the user dismisses it / it times
 * out. Sidesteps the "Unknown interaction after cancelling a modal" trap by
 * always bounding the wait.
 */
export async function showAndAwaitModal(
  interaction: ModalShowingInteraction,
  modal: ModalLike,
  options: AwaitModalOptions = {},
): Promise<ModalSubmitInteraction | null> {
  const customId = resolveModalCustomId(modal);
  await interaction.showModal(modal);
  const { time = 120_000, filter } = options;
  try {
    return await interaction.awaitModalSubmit({
      time,
      filter: (submitted) =>
        submitted.user.id === interaction.user.id &&
        (customId === undefined || submitted.customId === customId) &&
        (filter?.(submitted) ?? true),
    });
  } catch {
    return null;
  }
}
