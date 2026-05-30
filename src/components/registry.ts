import type {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  Interaction,
  MentionableSelectMenuInteraction,
  ModalSubmitInteraction,
  RepliableInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
  Awaitable,
} from "discord.js";
import { MessageFlags } from "discord.js";
import { parseCustomId, paramsFromValues } from "./customId.js";

/** Shared shape of every routed component. */
interface RouteBase {
  readonly namespace: string;
  readonly paramNames: readonly string[];
}

/** Routing entry for a button. */
export interface ButtonRoute extends RouteBase {
  readonly kind: "button";
  handle(interaction: ButtonInteraction, params: Record<string, string>): Promise<void>;
}
/** Routing entry for a string select. */
export interface StringSelectRoute extends RouteBase {
  readonly kind: "stringSelect";
  handle(interaction: StringSelectMenuInteraction, params: Record<string, string>): Promise<void>;
}
/** Routing entry for a user select. */
export interface UserSelectRoute extends RouteBase {
  readonly kind: "userSelect";
  handle(interaction: UserSelectMenuInteraction, params: Record<string, string>): Promise<void>;
}
/** Routing entry for a role select. */
export interface RoleSelectRoute extends RouteBase {
  readonly kind: "roleSelect";
  handle(interaction: RoleSelectMenuInteraction, params: Record<string, string>): Promise<void>;
}
/** Routing entry for a channel select. */
export interface ChannelSelectRoute extends RouteBase {
  readonly kind: "channelSelect";
  handle(interaction: ChannelSelectMenuInteraction, params: Record<string, string>): Promise<void>;
}
/** Routing entry for a mentionable select. */
export interface MentionableSelectRoute extends RouteBase {
  readonly kind: "mentionableSelect";
  handle(
    interaction: MentionableSelectMenuInteraction,
    params: Record<string, string>,
  ): Promise<void>;
}
/** Routing entry for a modal submission. */
export interface ModalRoute extends RouteBase {
  readonly kind: "modal";
  handle(interaction: ModalSubmitInteraction, params: Record<string, string>): Promise<void>;
}

/** Any registrable component routing entry. */
export type ComponentDef =
  | ButtonRoute
  | StringSelectRoute
  | UserSelectRoute
  | RoleSelectRoute
  | ChannelSelectRoute
  | MentionableSelectRoute
  | ModalRoute;

/** Error hook invoked when a component handler throws. */
export type ComponentErrorHandler = (
  error: Error,
  interaction: RepliableInteraction,
) => Awaitable<void>;

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

/**
 * Routes button, select and modal interactions to the handlers registered for
 * their custom-id namespace. Decodes the custom-id, extracts typed params, and
 * invokes the matching handler.
 */
export class ComponentRegistry {
  private readonly buttons = new Map<string, ButtonRoute>();
  private readonly stringSelects = new Map<string, StringSelectRoute>();
  private readonly userSelects = new Map<string, UserSelectRoute>();
  private readonly roleSelects = new Map<string, RoleSelectRoute>();
  private readonly channelSelects = new Map<string, ChannelSelectRoute>();
  private readonly mentionableSelects = new Map<string, MentionableSelectRoute>();
  private readonly modals = new Map<string, ModalRoute>();
  private errorHandler?: ComponentErrorHandler;

  /** Register one or more components. Later registrations override by namespace. */
  add(...defs: ComponentDef[]): this {
    for (const def of defs) {
      switch (def.kind) {
        case "button":
          this.buttons.set(def.namespace, def);
          break;
        case "stringSelect":
          this.stringSelects.set(def.namespace, def);
          break;
        case "userSelect":
          this.userSelects.set(def.namespace, def);
          break;
        case "roleSelect":
          this.roleSelects.set(def.namespace, def);
          break;
        case "channelSelect":
          this.channelSelects.set(def.namespace, def);
          break;
        case "mentionableSelect":
          this.mentionableSelects.set(def.namespace, def);
          break;
        case "modal":
          this.modals.set(def.namespace, def);
          break;
      }
    }
    return this;
  }

  /** Set the handler used when a component throws. */
  onError(handler: ComponentErrorHandler): this {
    this.errorHandler = handler;
    return this;
  }

  /** Total number of registered components. */
  get size(): number {
    return (
      this.buttons.size +
      this.stringSelects.size +
      this.userSelects.size +
      this.roleSelects.size +
      this.channelSelects.size +
      this.mentionableSelects.size +
      this.modals.size
    );
  }

  /**
   * Dispatch an interaction to its component handler. Returns `true` if a
   * handler matched and ran, `false` otherwise.
   */
  async handle(interaction: Interaction): Promise<boolean> {
    if (interaction.isButton()) {
      return this.exec(this.buttons.get(namespaceOf(interaction.customId)), interaction);
    }
    if (interaction.isStringSelectMenu()) {
      return this.exec(this.stringSelects.get(namespaceOf(interaction.customId)), interaction);
    }
    if (interaction.isUserSelectMenu()) {
      return this.exec(this.userSelects.get(namespaceOf(interaction.customId)), interaction);
    }
    if (interaction.isRoleSelectMenu()) {
      return this.exec(this.roleSelects.get(namespaceOf(interaction.customId)), interaction);
    }
    if (interaction.isChannelSelectMenu()) {
      return this.exec(this.channelSelects.get(namespaceOf(interaction.customId)), interaction);
    }
    if (interaction.isMentionableSelectMenu()) {
      return this.exec(this.mentionableSelects.get(namespaceOf(interaction.customId)), interaction);
    }
    if (interaction.isModalSubmit()) {
      return this.exec(this.modals.get(namespaceOf(interaction.customId)), interaction);
    }
    return false;
  }

  private async exec<I extends RepliableInteraction & { customId: string }>(
    route: (RouteBase & { handle(interaction: I, params: Record<string, string>): Promise<void> }) | undefined,
    interaction: I,
  ): Promise<boolean> {
    if (route === undefined) return false;
    const { values } = parseCustomId(interaction.customId);
    const params = paramsFromValues(route.paramNames, values);
    try {
      await route.handle(interaction, params);
    } catch (error) {
      const err = toError(error);
      if (this.errorHandler !== undefined) {
        await this.errorHandler(err, interaction);
      } else {
        interaction.client.emit("error", err);
        if (!interaction.replied && !interaction.deferred) {
          await interaction
            .reply({ content: "Something went wrong.", flags: MessageFlags.Ephemeral })
            .catch(() => undefined);
        }
      }
    }
    return true;
  }
}

function namespaceOf(customId: string): string {
  return parseCustomId(customId).namespace;
}
