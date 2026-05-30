import {
  MessageFlags,
  REST,
  Routes,
  type AutocompleteInteraction,
  type Awaitable,
  type ChatInputCommandInteraction,
  type RESTPostAPIApplicationCommandsJSONBody,
  type RESTPutAPIApplicationCommandsResult,
  type RESTPutAPIApplicationGuildCommandsResult,
} from "discord.js";
import type { SlashCommand } from "./command.js";

/** Error hook invoked when a command handler throws. */
export type CommandErrorHandler = (
  error: Error,
  interaction: ChatInputCommandInteraction,
) => Awaitable<void>;

/** Options for pushing commands to discord. */
export interface DeployOptions {
  /** Bot token. Falls back to the client token when omitted. */
  token?: string;
  /** Application (client) id. */
  applicationId: string;
  /** Deploy to a single guild (updates instantly) instead of globally. */
  guildId?: string;
  /** Reuse an existing REST instance instead of creating one. */
  rest?: REST;
}

/** Result of a {@link CommandRegistry.deploy} call. */
export type DeployResult =
  | RESTPutAPIApplicationCommandsResult
  | RESTPutAPIApplicationGuildCommandsResult;

/** Holds every slash command and routes interactions to them. */
export class CommandRegistry {
  private readonly commands = new Map<string, SlashCommand>();
  private errorHandler?: CommandErrorHandler;

  /** Register one or more commands. Later registrations override by name. */
  add(...commands: SlashCommand[]): this {
    for (const command of commands) this.commands.set(command.name, command);
    return this;
  }

  /** Remove a command by name. */
  remove(name: string): boolean {
    return this.commands.delete(name);
  }

  /** Look up a command by name. */
  get(name: string): SlashCommand | undefined {
    return this.commands.get(name);
  }

  /** All registered commands. */
  all(): SlashCommand[] {
    return [...this.commands.values()];
  }

  /** All registered command names. */
  get names(): string[] {
    return [...this.commands.keys()];
  }

  /** Number of registered commands. */
  get size(): number {
    return this.commands.size;
  }

  /** Set the handler used when a command throws. */
  onError(handler: CommandErrorHandler): this {
    this.errorHandler = handler;
    return this;
  }

  /** Serialise every command to discord REST payloads. */
  toJSON(): RESTPostAPIApplicationCommandsJSONBody[] {
    return this.all().map((c) => c.toJSON());
  }

  /** Dispatch an incoming chat-input interaction to its command. */
  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = this.commands.get(interaction.commandName);
    if (command === undefined) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (this.errorHandler !== undefined) {
        await this.errorHandler(err, interaction);
      } else {
        await this.defaultErrorReply(err, interaction);
      }
    }
  }

  /** Dispatch an autocomplete interaction to its command. */
  async handleAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const command = this.commands.get(interaction.commandName);
    if (command === undefined) return;
    try {
      await command.autocomplete(interaction);
    } catch {
      if (!interaction.responded) await interaction.respond([]).catch(() => undefined);
    }
  }

  /**
   * Push the registered commands to discord. Returns the API response.
   *
   * Guild deploys apply instantly and are ideal during development; global
   * deploys can take up to an hour to propagate.
   */
  async deploy(options: DeployOptions): Promise<DeployResult> {
    let rest = options.rest;
    if (rest === undefined) {
      if (options.token === undefined) {
        throw new Error("spear: deploy() requires a token or a pre-configured REST instance");
      }
      rest = new REST().setToken(options.token);
    }
    const body = this.toJSON();
    const route =
      options.guildId !== undefined
        ? Routes.applicationGuildCommands(options.applicationId, options.guildId)
        : Routes.applicationCommands(options.applicationId);
    return (await rest.put(route, { body })) as DeployResult;
  }

  private async defaultErrorReply(
    error: Error,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    interaction.client.emit("error", error);
    const content = "Something went wrong while running that command.";
    try {
      if (interaction.deferred) {
        await interaction.editReply({ content });
      } else if (interaction.replied) {
        await interaction.followUp({ content, flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ content, flags: MessageFlags.Ephemeral });
      }
    } catch {
      // Interaction likely expired; nothing actionable left to do.
    }
  }
}
