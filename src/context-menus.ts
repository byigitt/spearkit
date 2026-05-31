/**
 * User- and message-context-menu commands ("Apps") as first-class spearkit
 * citizens. The bot studied for spearkit hand-rolls these with raw
 * `ContextMenuCommandBuilder` + manual modal hand-offs and lives them under
 * the slash loader — context menus need their own type, target accessor, and
 * dispatch path, and the deploy payload needs to be merged with slash
 * commands.
 *
 * Use {@link userCommand} / {@link messageCommand} to define one, then
 * register with `client.register(...)`. Cooldowns, guards and usage tracking
 * compose exactly like slash commands.
 */
import {
  ApplicationCommandType,
  InteractionContextType,
  MessageFlags,
  PermissionsBitField,
  type Awaitable,
  type LocalizationMap,
  type MessageContextMenuCommandInteraction,
  type PermissionResolvable,
  type RESTPostAPIContextMenuApplicationCommandsJSONBody,
  type UserContextMenuCommandInteraction,
} from "discord.js";
import { BaseContext } from "./context.js";
import {
  normalizeCooldown,
  formatCooldownMessage,
  type CooldownActor,
  type CooldownConfig,
  type CooldownInput,
  type CooldownManager,
} from "./cooldown.js";
import { runGuards, type Guard } from "./guards.js";
import { defaultEmbeds, type Embeds } from "./embeds.js";
import type { Logger } from "./logger.js";
import type { UsageEvent } from "./usage.js";
import {
  armAutoDefer,
  normalizeAutoDefer,
  type AutoDeferConfig,
  type AutoDeferInput,
} from "./auto-defer.js";
import { explainDiscordError } from "./discord-errors.js";

/** Metadata accepted by both context-menu kinds. */
interface ContextMenuMeta {
  defaultMemberPermissions?: PermissionResolvable | null;
  nsfw?: boolean;
  guildOnly?: boolean;
  nameLocalizations?: LocalizationMap;
  cooldown?: CooldownInput;
  guards?: readonly Guard[];
  /** Auto-`deferReply()` if the handler is slow, preventing `Unknown interaction`. */
  autoDefer?: AutoDeferInput;
}

/** Configuration for {@link userCommand}. */
export interface UserCommandConfig<R = void> extends ContextMenuMeta {
  name: string;
  run: (ctx: UserContextMenuContext) => Awaitable<R>;
}

/** Configuration for {@link messageCommand}. */
export interface MessageCommandConfig<R = void> extends ContextMenuMeta {
  name: string;
  run: (ctx: MessageContextMenuContext) => Awaitable<R>;
}
/** Common shape for any context-menu command (user or message). */
export interface BaseContextMenuCommand {
  readonly name: string;
  readonly cooldown?: CooldownConfig;
  readonly guards?: readonly Guard[];
  readonly autoDefer?: AutoDeferConfig;
  toJSON(): RESTPostAPIContextMenuApplicationCommandsJSONBody;
}

/** A user-target context-menu command. */
export interface UserContextMenu extends BaseContextMenuCommand {
  readonly kind: "userMenu";
  execute(interaction: UserContextMenuCommandInteraction): Promise<void>;
}

/** A message-target context-menu command. */
export interface MessageContextMenu extends BaseContextMenuCommand {
  readonly kind: "messageMenu";
  execute(interaction: MessageContextMenuCommandInteraction): Promise<void>;
}

/** A registered context-menu command — discriminated by `kind`. */
export type ContextMenuCommand = UserContextMenu | MessageContextMenu;


/** Handler context for a user-target context menu. */
export class UserContextMenuContext extends BaseContext<UserContextMenuCommandInteraction> {
  /** The user the menu was invoked on. */
  get targetUser() {
    return this.interaction.targetUser;
  }
  /** The member version of the target, if available. */
  get targetMember() {
    return this.interaction.targetMember;
  }
}

/** Handler context for a message-target context menu. */
export class MessageContextMenuContext extends BaseContext<MessageContextMenuCommandInteraction> {
  /** The message the menu was invoked on. */
  get targetMessage() {
    return this.interaction.targetMessage;
  }
}

function baseJSON(
  meta: ContextMenuMeta & { name: string },
  type: ApplicationCommandType.User | ApplicationCommandType.Message,
): RESTPostAPIContextMenuApplicationCommandsJSONBody {
  return {
    type,
    name: meta.name,
    name_localizations: meta.nameLocalizations,
    nsfw: meta.nsfw,
    default_member_permissions:
      meta.defaultMemberPermissions == null
        ? meta.defaultMemberPermissions
        : new PermissionsBitField(meta.defaultMemberPermissions).bitfield.toString(),
    contexts: meta.guildOnly ? [InteractionContextType.Guild] : undefined,
  };
}

/** Define a user-target ("Apps → user") context-menu command. */
export function userCommand<R = void>(config: UserCommandConfig<R>): UserContextMenu {
  const cooldown = config.cooldown !== undefined ? normalizeCooldown(config.cooldown) : undefined;
  return {
    kind: "userMenu",
    name: config.name,
    cooldown,
    guards: config.guards,
    autoDefer: normalizeAutoDefer(config.autoDefer),
    toJSON: () => baseJSON(config, ApplicationCommandType.User),
    execute: async (interaction) => {
      await config.run(new UserContextMenuContext(interaction));
    },
  };
}

/** Define a message-target ("Apps → message") context-menu command. */
export function messageCommand<R = void>(config: MessageCommandConfig<R>): MessageContextMenu {
  const cooldown = config.cooldown !== undefined ? normalizeCooldown(config.cooldown) : undefined;
  return {
    kind: "messageMenu",
    name: config.name,
    cooldown,
    guards: config.guards,
    autoDefer: normalizeAutoDefer(config.autoDefer),
    toJSON: () => baseJSON(config, ApplicationCommandType.Message),
    execute: async (interaction) => {
      await config.run(new MessageContextMenuContext(interaction));
    },
  };
}

/** Holds context-menu commands and routes incoming interactions to them. */
export class ContextMenuRegistry {
  private readonly users = new Map<string, UserContextMenu>();
  private readonly messages = new Map<string, MessageContextMenu>();
  private logger?: Logger;
  private cooldowns?: CooldownManager;
  private defaultCooldown?: CooldownConfig;
  private defaultGuards: readonly Guard[] = [];
  private onUsage?: (event: UsageEvent) => void;
  private defaultAutoDefer?: AutoDeferConfig;

  /** Register one or more context-menu commands. */
  add(...commands: readonly ContextMenuCommand[]): this {
    for (const command of commands) {
      if (command.kind === "userMenu") this.users.set(command.name, command as UserContextMenu);
      else this.messages.set(command.name, command as MessageContextMenu);
    }
    return this;
  }

  /** Total number of registered context-menu commands. */
  get size(): number {
    return this.users.size + this.messages.size;
  }

  /** Every registered command, both kinds. */
  all(): ContextMenuCommand[] {
    return [...this.users.values(), ...this.messages.values()];
  }

  /** Serialise every command for the REST `applicationCommands` PUT body. */
  toJSON(): RESTPostAPIContextMenuApplicationCommandsJSONBody[] {
    return this.all().map((c) => c.toJSON());
  }

  setLogger(logger: Logger): this {
    this.logger = logger;
    return this;
  }

  setCooldowns(manager: CooldownManager, defaultCooldown?: CooldownConfig): this {
    this.cooldowns = manager;
    this.defaultCooldown = defaultCooldown;
    return this;
  }

  setDefaultGuards(guards: readonly Guard[]): this {
    this.defaultGuards = guards;
    return this;
  }

  /** Default auto-defer applied to menus that don't set their own. */
  setAutoDefer(config?: AutoDeferConfig): this {
    this.defaultAutoDefer = config;
    return this;
  }

  setUsageHook(hook: (event: UsageEvent) => void): this {
    this.onUsage = hook;
    return this;
  }

  /** Dispatch a user-target interaction. */
  async handleUser(interaction: UserContextMenuCommandInteraction): Promise<void> {
    const command = this.users.get(interaction.commandName);
    if (command === undefined) return;
    await this.dispatch(command, interaction);
  }

  /** Dispatch a message-target interaction. */
  async handleMessage(interaction: MessageContextMenuCommandInteraction): Promise<void> {
    const command = this.messages.get(interaction.commandName);
    if (command === undefined) return;
    await this.dispatch(command, interaction);
  }

  private async dispatch(
    command: UserContextMenu | MessageContextMenu,
    interaction: UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction,
  ): Promise<void> {
    this.logger?.debug("contextMenu", {
      data: { kind: command.kind, name: command.name, user: interaction.user.id },
    });
    const cooldown = command.cooldown ?? this.defaultCooldown;
    if (cooldown !== undefined && this.cooldowns !== undefined) {
      const result = this.cooldowns.consume(
        `${command.kind}:${command.name}`,
        cooldown,
        actorOf(interaction),
      );
      if (!result.allowed) {
        await replyCooldown(interaction, cooldown, result.remaining);
        return;
      }
    }
    const guards = combineGuards(this.defaultGuards, command.guards);
    if (guards.length > 0) {
      const guardResult = await runGuards(interaction, guards);
      if (!guardResult.allowed) {
        this.logger?.debug("contextMenu denied", {
          data: { name: command.name, user: interaction.user.id, reason: guardResult.reason ?? "" },
        });
        await replyDenied(interaction, guardResult.reason);
        return;
      }
    }
    const autoDefer = command.autoDefer ?? this.defaultAutoDefer;
    const cancelAutoDefer = autoDefer !== undefined ? armAutoDefer(interaction, autoDefer) : undefined;
    const start = Date.now();
    try {
      if (command.kind === "userMenu") {
        await command.execute(interaction as UserContextMenuCommandInteraction);
      } else {
        await command.execute(interaction as MessageContextMenuCommandInteraction);
      }
      this.onUsage?.({
        type: "command",
        name: command.name,
        detail: command.kind,
        outcome: "success",
        durationMs: Date.now() - start,
        userId: interaction.user.id,
        userTag: interaction.user.tag,
        guildId: interaction.guildId,
        channelId: interaction.channelId,
        timestamp: new Date(),
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.onUsage?.({
        type: "command",
        name: command.name,
        detail: command.kind,
        outcome: "error",
        errorMessage: err.message,
        durationMs: Date.now() - start,
        userId: interaction.user.id,
        userTag: interaction.user.tag,
        guildId: interaction.guildId,
        channelId: interaction.channelId,
        timestamp: new Date(),
      });
      interaction.client.emit("error", err);
      const content = explainDiscordError(err) ?? "Something went wrong.";
      try {
        if (interaction.deferred) {
          await interaction.editReply({ content });
        } else if (interaction.replied) {
          await interaction.followUp({ content, flags: MessageFlags.Ephemeral });
        } else {
          await interaction.reply({ content, flags: MessageFlags.Ephemeral });
        }
      } catch {
        // Interaction likely expired.
      }
    } finally {
      cancelAutoDefer?.();
    }
  }
}

function combineGuards(defaults: readonly Guard[], own: readonly Guard[] | undefined): readonly Guard[] {
  if (own === undefined || own.length === 0) return defaults;
  if (defaults.length === 0) return own;
  return [...defaults, ...own];
}

function actorOf(
  interaction: UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction,
): CooldownActor {
  const member = interaction.member;
  let roleIds: readonly string[] = [];
  if (member !== null) {
    const roles = member.roles;
    roleIds = Array.isArray(roles) ? roles : [...roles.cache.keys()];
  }
  return {
    userId: interaction.user.id,
    roleIds,
    guildId: interaction.guildId,
    channelId: interaction.channelId,
  };
}

function clientEmbeds(client: { embeds?: Embeds } | unknown): Embeds {
  return ((client as { embeds?: Embeds }).embeds) ?? defaultEmbeds;
}

async function replyCooldown(
  interaction: UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction,
  config: CooldownConfig,
  remaining: number,
): Promise<void> {
  const content = formatCooldownMessage(config, remaining);
  try {
    if (interaction.deferred) await interaction.editReply({ content });
    else if (interaction.replied) await interaction.followUp({ content, flags: MessageFlags.Ephemeral });
    else await interaction.reply({ content, flags: MessageFlags.Ephemeral });
  } catch {
    // Interaction likely expired.
  }
}

async function replyDenied(
  interaction: UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction,
  reason: string | undefined,
): Promise<void> {
  const embeds = clientEmbeds(interaction.client);
  const text = reason ?? "You don't have permission to use this.";
  try {
    const payload = { embeds: [embeds.error(text)], flags: MessageFlags.Ephemeral } as const;
    if (interaction.deferred) await interaction.editReply({ embeds: payload.embeds });
    else if (interaction.replied) await interaction.followUp(payload);
    else await interaction.reply(payload);
  } catch {
    // Interaction likely expired.
  }
}
