import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  JSONEncodable,
  ModalComponentData,
  ModalBuilder,
  APIModalInteractionResponseCallbackData,
} from "discord.js";
import { BaseContext } from "../context.js";
import type { OptionChoice, OptionMap, ResolvedOptions } from "./options.js";

/**
 * The handler argument for a slash command. Wraps the discord.js interaction
 * and exposes the resolved, fully-typed {@link options}.
 */
export class CommandContext<O extends OptionMap = OptionMap> extends BaseContext<ChatInputCommandInteraction> {
  constructor(
    interaction: ChatInputCommandInteraction,
    /** Resolved option values, typed from the command's `options` map. */
    readonly options: ResolvedOptions<O>,
  ) {
    super(interaction);
  }

  get commandName(): string {
    return this.interaction.commandName;
  }

  /** The invoked subcommand name, if any. */
  get subcommand(): string | null {
    return this.interaction.options.getSubcommand(false);
  }

  /** Present a modal to the user in response to this command. */
  async showModal(
    modal: JSONEncodable<APIModalInteractionResponseCallbackData> | ModalComponentData | ModalBuilder,
  ): Promise<void> {
    await this.interaction.showModal(modal);
  }
}

/**
 * The handler argument for autocomplete requests. Provides the focused value
 * and a typed {@link respond} helper.
 */
export class AutocompleteContext {
  constructor(readonly interaction: AutocompleteInteraction) {}

  get client() {
    return this.interaction.client;
  }
  get user() {
    return this.interaction.user;
  }
  get guild() {
    return this.interaction.guild;
  }
  get guildId() {
    return this.interaction.guildId;
  }
  get commandName(): string {
    return this.interaction.commandName;
  }

  /** Name of the option currently being completed. */
  get focusedName(): string {
    return this.interaction.options.getFocused(true).name;
  }

  /** Current partial value typed by the user. */
  get value(): string {
    return this.interaction.options.getFocused();
  }

  /** Send autocomplete suggestions (capped at the discord limit of 25). */
  respond(choices: OptionChoice<string | number>[]): Promise<void> {
    return this.interaction.respond(
      choices.slice(0, 25).map((c) => ({
        name: c.name,
        value: c.value,
        name_localizations: c.nameLocalizations,
      })),
    );
  }
}
