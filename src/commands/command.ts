import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionContextType,
  PermissionsBitField,
  type APIApplicationCommandSubcommandGroupOption,
  type APIApplicationCommandSubcommandOption,
  type AutocompleteInteraction,
  type Awaitable,
  type ChatInputCommandInteraction,
  type LocalizationMap,
  type PermissionResolvable,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import { AutocompleteContext, CommandContext } from "./context.js";
import {
  optionsHaveAutocomplete,
  readOption,
  toAPIOption,
  type OptionMap,
  type OptionValue,
  type ResolvedOptions,
} from "./options.js";
import { normalizeCooldown, type CooldownConfig, type CooldownInput } from "../cooldown.js";

/** Metadata shared by every kind of command. */
interface CommonMeta {
  /** Permissions a member must have by default to see/use the command. */
  defaultMemberPermissions?: PermissionResolvable | null;
  /** Mark the command NSFW (age-restricted). */
  nsfw?: boolean;
  /** Restrict invocation to guilds only. */
  guildOnly?: boolean;
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
  /** Rate-limit this command. A number is a duration in ms; see {@link CooldownConfig}. */
  cooldown?: CooldownInput;
}

/** Configuration for a leaf (non-subcommand) slash command. */
export interface CommandConfig<O extends OptionMap, R> extends CommonMeta {
  name: string;
  description: string;
  options?: O;
  run: (ctx: CommandContext<O>) => Awaitable<R>;
}

/** Configuration for one subcommand. */
export interface SubcommandConfig<O extends OptionMap, R> {
  description: string;
  options?: O;
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
  run: (ctx: CommandContext<O>) => Awaitable<R>;
}

/** A type-erased, ready-to-run subcommand created with {@link subcommand}. */
export interface Subcommand {
  readonly kind: "subcommand";
  readonly description: string;
  readonly options: OptionMap;
  readonly nameLocalizations?: LocalizationMap;
  readonly descriptionLocalizations?: LocalizationMap;
  readonly hasAutocomplete: boolean;
  readonly execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  readonly autocomplete: (interaction: AutocompleteInteraction) => Promise<void>;
}

/** Configuration for a subcommand group (a folder of subcommands). */
export interface SubcommandGroupConfig {
  description: string;
  subcommands: Record<string, Subcommand>;
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
}

/** A subcommand group created with {@link subcommandGroup}. */
export interface SubcommandGroup extends SubcommandGroupConfig {
  readonly kind: "group";
}

/** Configuration for a command that contains subcommands and/or groups. */
export interface CommandGroupConfig extends CommonMeta {
  name: string;
  description: string;
  subcommands?: Record<string, Subcommand>;
  groups?: Record<string, SubcommandGroup>;
}

/** Everything {@link SlashCommand} needs, pre-built by the factories. */
interface SlashCommandSpec {
  name: string;
  json: RESTPostAPIChatInputApplicationCommandsJSONBody;
  hasAutocomplete: boolean;
  executor: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocompleter: (interaction: AutocompleteInteraction) => Promise<void>;
  cooldown?: CooldownConfig;
}

/**
 * A registered slash command. Serialises itself for the discord REST API and
 * executes its matching interactions. Construct via {@link command} or
 * {@link commandGroup} rather than directly.
 */
export class SlashCommand {
  /** The top-level command name (used as the registry lookup key). */
  readonly name: string;
  /** Whether any option declares an autocomplete handler. */
  readonly hasAutocomplete: boolean;
  private readonly json: RESTPostAPIChatInputApplicationCommandsJSONBody;
  private readonly executor: (interaction: ChatInputCommandInteraction) => Promise<void>;
  private readonly autocompleter: (interaction: AutocompleteInteraction) => Promise<void>;
  /** Resolved cooldown configuration for this command, if any. */
  readonly cooldown?: CooldownConfig;

  /** @internal */
  constructor(spec: SlashCommandSpec) {
    this.name = spec.name;
    this.hasAutocomplete = spec.hasAutocomplete;
    this.json = spec.json;
    this.executor = spec.executor;
    this.autocompleter = spec.autocompleter;
    this.cooldown = spec.cooldown;
  }

  /** Serialise to the discord REST chat-input command payload. */
  toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
    return this.json;
  }

  /** Execute the command for an incoming chat-input interaction. */
  execute(interaction: ChatInputCommandInteraction): Promise<void> {
    return this.executor(interaction);
  }

  /** Execute autocomplete for the focused option. */
  autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    return this.autocompleter(interaction);
  }
}

function resolveOptions(
  interaction: ChatInputCommandInteraction,
  options: OptionMap,
): Record<string, OptionValue | undefined> {
  const resolved: Record<string, OptionValue | undefined> = {};
  for (const [name, def] of Object.entries(options)) {
    resolved[name] = readOption(interaction.options, name, def);
  }
  return resolved;
}

function makeAutocompleter(
  options: OptionMap,
): (interaction: AutocompleteInteraction) => Promise<void> {
  return async (interaction) => {
    const focused = interaction.options.getFocused(true);
    const def = options[focused.name];
    if (def?.autocomplete === undefined) {
      if (!interaction.responded) await interaction.respond([]);
      return;
    }
    const ctx = new AutocompleteContext(interaction);
    const choices = await def.autocomplete(ctx);
    if (!interaction.responded) await ctx.respond(choices);
  };
}

function baseJSON(
  meta: CommonMeta & { name: string; description: string },
  options: RESTPostAPIChatInputApplicationCommandsJSONBody["options"],
): RESTPostAPIChatInputApplicationCommandsJSONBody {
  return {
    type: ApplicationCommandType.ChatInput,
    name: meta.name,
    description: meta.description,
    name_localizations: meta.nameLocalizations,
    description_localizations: meta.descriptionLocalizations,
    nsfw: meta.nsfw,
    default_member_permissions:
      meta.defaultMemberPermissions == null
        ? meta.defaultMemberPermissions
        : new PermissionsBitField(meta.defaultMemberPermissions).bitfield.toString(),
    contexts: meta.guildOnly ? [InteractionContextType.Guild] : undefined,
    options,
  };
}

function leafOptionsJSON(options: OptionMap): RESTPostAPIChatInputApplicationCommandsJSONBody["options"] {
  return Object.entries(options).map(([name, def]) => toAPIOption(name, def));
}

function subcommandJSON(name: string, sub: Subcommand): APIApplicationCommandSubcommandOption {
  return {
    type: ApplicationCommandOptionType.Subcommand,
    name,
    description: sub.description,
    name_localizations: sub.nameLocalizations,
    description_localizations: sub.descriptionLocalizations,
    options: Object.entries(sub.options).map(([n, def]) => toAPIOption(n, def)),
  };
}

function routeSubcommand(
  groupName: string | null,
  subName: string | null,
  subcommands: Record<string, Subcommand> | undefined,
  groups: Record<string, SubcommandGroup> | undefined,
): Subcommand | undefined {
  if (groupName !== null) return groups?.[groupName]?.subcommands[subName ?? ""];
  if (subName !== null) return subcommands?.[subName];
  return undefined;
}

/**
 * Define a slash command with type-safe options and a co-located handler.
 *
 * @example
 * ```ts
 * export default command({
 *   name: "echo",
 *   description: "Repeat a message",
 *   options: { msg: option.string({ description: "Text", required: true }) },
 *   run: (ctx) => ctx.reply(ctx.options.msg),
 * });
 * ```
 */
export function command<O extends OptionMap = Record<string, never>, R = void>(
  config: CommandConfig<O, R>,
): SlashCommand {
  const options: OptionMap = config.options ?? {};
  const { run } = config;
  const executor = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const resolved = resolveOptions(interaction, options) as ResolvedOptions<O>;
    await run(new CommandContext<O>(interaction, resolved));
  };
  return new SlashCommand({
    name: config.name,
    json: baseJSON(config, leafOptionsJSON(options)),
    hasAutocomplete: optionsHaveAutocomplete(options),
    executor,
    autocompleter: makeAutocompleter(options),
    cooldown: config.cooldown !== undefined ? normalizeCooldown(config.cooldown) : undefined,
  });
}

/** Define a single subcommand with type-safe options and a handler. */
export function subcommand<O extends OptionMap = Record<string, never>, R = void>(
  config: SubcommandConfig<O, R>,
): Subcommand {
  const options: OptionMap = config.options ?? {};
  const { run } = config;
  const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const resolved = resolveOptions(interaction, options) as ResolvedOptions<O>;
    await run(new CommandContext<O>(interaction, resolved));
  };
  return {
    kind: "subcommand",
    description: config.description,
    options,
    nameLocalizations: config.nameLocalizations,
    descriptionLocalizations: config.descriptionLocalizations,
    hasAutocomplete: optionsHaveAutocomplete(options),
    execute,
    autocomplete: makeAutocompleter(options),
  };
}

/** Group several subcommands under a shared name. */
export function subcommandGroup(config: SubcommandGroupConfig): SubcommandGroup {
  return { kind: "group", ...config };
}

/** Define a command that routes to subcommands and/or subcommand groups. */
export function commandGroup(config: CommandGroupConfig): SlashCommand {
  const { subcommands, groups } = config;

  const options: (APIApplicationCommandSubcommandOption | APIApplicationCommandSubcommandGroupOption)[] =
    [];
  for (const [name, sub] of Object.entries(subcommands ?? {})) {
    options.push(subcommandJSON(name, sub));
  }
  for (const [name, group] of Object.entries(groups ?? {})) {
    options.push({
      type: ApplicationCommandOptionType.SubcommandGroup,
      name,
      description: group.description,
      name_localizations: group.nameLocalizations,
      description_localizations: group.descriptionLocalizations,
      options: Object.entries(group.subcommands).map(([n, s]) => subcommandJSON(n, s)),
    });
  }

  const hasAutocomplete =
    Object.values(subcommands ?? {}).some((s) => s.hasAutocomplete) ||
    Object.values(groups ?? {}).some((g) => Object.values(g.subcommands).some((s) => s.hasAutocomplete));

  const executor = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const target = routeSubcommand(
      interaction.options.getSubcommandGroup(false),
      interaction.options.getSubcommand(false),
      subcommands,
      groups,
    );
    if (target === undefined) {
      throw new Error(`spearkit: no subcommand handler for /${config.name}`);
    }
    await target.execute(interaction);
  };

  const autocompleter = async (interaction: AutocompleteInteraction): Promise<void> => {
    const target = routeSubcommand(
      interaction.options.getSubcommandGroup(false),
      interaction.options.getSubcommand(false),
      subcommands,
      groups,
    );
    if (target === undefined) {
      if (!interaction.responded) await interaction.respond([]);
      return;
    }
    await target.autocomplete(interaction);
  };

  return new SlashCommand({
    name: config.name,
    json: baseJSON(config, options),
    hasAutocomplete,
    executor,
    autocompleter,
    cooldown: config.cooldown !== undefined ? normalizeCooldown(config.cooldown) : undefined,
  });
}
