/**
 * Client-wide handler error policy shared by commands, components, context
 * menus, and prefix commands.
 */
import {
  MessageFlags,
  type Awaitable,
  type Message,
  type RepliableInteraction,
} from "discord.js";
import type { Embeds } from "./embeds.js";
import { explainDiscordError } from "./discord-errors.js";
import type { Logger } from "./logger.js";

export type InteractionHandlerSource = "command" | "component" | "contextMenu";

/** Error details passed to `SpearClient({ onHandlerError })`. */
export type HandlerErrorEvent =
  | {
      source: InteractionHandlerSource;
      name: string;
      error: Error;
      interaction: RepliableInteraction;
    }
  | {
      source: "prefix";
      name: string;
      error: Error;
      message: Message;
    };

/**
 * Return a string to override the user-facing message, `false` to suppress a
 * response, or nothing to use spearkit's safe default.
 */
export type HandlerErrorHandler = (
  event: HandlerErrorEvent,
) => Awaitable<string | false | void>;

export interface DispatchHandlerErrorOptions {
  event: HandlerErrorEvent;
  handler?: HandlerErrorHandler;
  logger: Logger;
  embeds: Embeds;
}

/** @internal Dispatch the configured policy and send its safe response. */
export async function dispatchHandlerError(
  options: DispatchHandlerErrorOptions,
): Promise<void> {
  const { event, handler, logger, embeds } = options;
  logger.error(`${event.source} handler "${event.name}" failed`, {
    error: event.error,
  });

  let result: string | false | void = undefined;
  if (handler !== undefined) {
    try {
      result = await handler(event);
    } catch (handlerError) {
      logger.error("onHandlerError failed", {
        error:
          handlerError instanceof Error
            ? handlerError
            : new Error(String(handlerError)),
      });
    }
  }
  if (result === false) return;

  const content =
    typeof result === "string"
      ? result
      : explainDiscordError(event.error) ?? "Something went wrong.";

  if (event.source === "prefix") {
    await event.message
      .reply({ embeds: [embeds.error(content)] })
      .catch(() => undefined);
    return;
  }

  const interaction = event.interaction;
  try {
    if (interaction.deferred) {
      await interaction.editReply({ content });
    } else if (interaction.replied) {
      await interaction.followUp({
        content,
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content,
        flags: MessageFlags.Ephemeral,
      });
    }
  } catch {
    // Interaction likely expired.
  }
}
