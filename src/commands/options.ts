import {
  ApplicationCommandOptionType,
  type APIApplicationCommandBasicOption,
  type APIApplicationCommandChannelOption,
  type APIApplicationCommandOptionChoice,
  type Attachment,
  type Awaitable,
  type ChatInputCommandInteraction,
  type CommandInteractionOption,
  type LocalizationMap,
} from "discord.js";
import type { AutocompleteContext } from "./context.js";

/**
 * Resolved runtime value types, derived directly from discord.js' option
 * resolver so spearkit stays exactly in lockstep with the underlying getters.
 */
type Opt = CommandInteractionOption;
type UserValue = NonNullable<Opt["user"]>;
type ChannelValue = NonNullable<Opt["channel"]>;
type RoleValue = NonNullable<Opt["role"]>;
type MentionableValue = NonNullable<Opt["user" | "role" | "member"]>;
type AttachmentValue = Attachment;

/** The discord-allowed channel types for a channel option. */
export type AllowedChannelType = NonNullable<APIApplicationCommandChannelOption["channel_types"]>[number];

/** The reader surface spearkit needs off a chat-input interaction. */
type OptionReader = ChatInputCommandInteraction["options"];

/** The closed set of values a slash option can resolve to. */
export type OptionValue =
  | string
  | number
  | boolean
  | UserValue
  | ChannelValue
  | RoleValue
  | MentionableValue
  | AttachmentValue;

/** A single choice for string/integer/number options. */
export interface OptionChoice<V extends string | number = string | number> {
  readonly name: string;
  readonly value: V;
  readonly nameLocalizations?: LocalizationMap;
}

/** Provides autocomplete suggestions for an option as the user types. */
export type AutocompleteHandler<V extends string | number = string | number> = (
  ctx: AutocompleteContext,
) => Awaitable<OptionChoice<V>[]>;

/**
 * A fully-described slash command option. The two type parameters are phantom
 * markers used purely for compile-time inference of the resolved value:
 * - `TValue` is the type produced for the command handler.
 * - `TRequired` controls nullability (`true` => value, `false` => `| undefined`).
 */
export interface OptionDef<TValue extends OptionValue, TRequired extends boolean> {
  readonly type: ApplicationCommandOptionType;
  readonly description: string;
  readonly required: TRequired;
  readonly choices?: readonly OptionChoice[];
  readonly minValue?: number;
  readonly maxValue?: number;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly channelTypes?: readonly AllowedChannelType[];
  readonly autocomplete?: AutocompleteHandler;
  readonly nameLocalizations?: LocalizationMap;
  readonly descriptionLocalizations?: LocalizationMap;
  /** Phantom-only marker. Never populated at runtime. */
  readonly __value?: TValue;
}

/** Any option definition, regardless of value/required type. */
export type AnyOptionDef = OptionDef<OptionValue, boolean>;

/** A map of option name => definition. */
export type OptionMap = Record<string, AnyOptionDef>;

/** Maps an {@link OptionDef} to the value passed into the command handler. */
export type ResolvedOption<O extends AnyOptionDef> = O extends OptionDef<infer V, infer Req>
  ? Req extends true
    ? V
    : V | undefined
  : never;

/** Resolves a whole {@link OptionMap} into the handler's `options` object. */
export type ResolvedOptions<O extends OptionMap> = {
  [K in keyof O]: ResolvedOption<O[K]>;
};

// --- builder config shapes -------------------------------------------------

interface BaseConfig {
  readonly description: string;
  readonly required?: boolean;
  readonly nameLocalizations?: LocalizationMap;
  readonly descriptionLocalizations?: LocalizationMap;
}

type IsRequired<C extends BaseConfig> = C["required"] extends true ? true : false;

interface StringConfig extends BaseConfig {
  readonly choices?: readonly OptionChoice<string>[];
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly autocomplete?: AutocompleteHandler<string>;
}

interface NumericConfig extends BaseConfig {
  readonly choices?: readonly OptionChoice<number>[];
  readonly minValue?: number;
  readonly maxValue?: number;
  readonly autocomplete?: AutocompleteHandler<number>;
}

interface ChannelConfig extends BaseConfig {
  readonly channelTypes?: readonly AllowedChannelType[];
}

type ChoiceValue<C, Fallback extends string | number> = C extends {
  readonly choices: readonly { value: infer V }[];
}
  ? [V] extends [string | number]
    ? V
    : Fallback
  : Fallback;

/**
 * The single boundary assertion in the option system: the runtime `required`
 * value is a wide `boolean`, but the public type narrows it to the literal the
 * caller supplied. Centralised so every builder stays otherwise cast-free.
 */
function makeOption<TValue extends OptionValue, C extends BaseConfig>(
  type: ApplicationCommandOptionType,
  config: C,
): OptionDef<TValue, IsRequired<C>> {
  return { type, ...config, required: (config.required ?? false) as IsRequired<C> };
}

/**
 * Type-safe slash command option builders.
 *
 * @example
 * ```ts
 * options: {
 *   target: option.user({ description: "Who to greet", required: true }),
 *   loud: option.boolean({ description: "Shout it" }),
 * }
 * ```
 */
export const option = {
  string<const C extends StringConfig>(config: C): OptionDef<ChoiceValue<C, string>, IsRequired<C>> {
    return makeOption(ApplicationCommandOptionType.String, config);
  },
  integer<const C extends NumericConfig>(config: C): OptionDef<ChoiceValue<C, number>, IsRequired<C>> {
    return makeOption(ApplicationCommandOptionType.Integer, config);
  },
  number<const C extends NumericConfig>(config: C): OptionDef<ChoiceValue<C, number>, IsRequired<C>> {
    return makeOption(ApplicationCommandOptionType.Number, config);
  },
  boolean<const C extends BaseConfig>(config: C): OptionDef<boolean, IsRequired<C>> {
    return makeOption(ApplicationCommandOptionType.Boolean, config);
  },
  user<const C extends BaseConfig>(config: C): OptionDef<UserValue, IsRequired<C>> {
    return makeOption(ApplicationCommandOptionType.User, config);
  },
  channel<const C extends ChannelConfig>(config: C): OptionDef<ChannelValue, IsRequired<C>> {
    return makeOption(ApplicationCommandOptionType.Channel, config);
  },
  role<const C extends BaseConfig>(config: C): OptionDef<RoleValue, IsRequired<C>> {
    return makeOption(ApplicationCommandOptionType.Role, config);
  },
  mentionable<const C extends BaseConfig>(config: C): OptionDef<MentionableValue, IsRequired<C>> {
    return makeOption(ApplicationCommandOptionType.Mentionable, config);
  },
  attachment<const C extends BaseConfig>(config: C): OptionDef<AttachmentValue, IsRequired<C>> {
    return makeOption(ApplicationCommandOptionType.Attachment, config);
  },
} as const;

function mapChoices<V extends string | number>(
  choices: readonly OptionChoice[] | undefined,
): APIApplicationCommandOptionChoice<V>[] | undefined {
  return choices?.map((c) => ({
    name: c.name,
    value: c.value as V,
    name_localizations: c.nameLocalizations,
  }));
}

/** Converts a spearkit option definition into the discord REST option payload. */
export function toAPIOption(name: string, def: AnyOptionDef): APIApplicationCommandBasicOption {
  const shared = {
    name,
    description: def.description,
    required: def.required,
    name_localizations: def.nameLocalizations,
    description_localizations: def.descriptionLocalizations,
  };

  switch (def.type) {
    case ApplicationCommandOptionType.String: {
      const base = { ...shared, min_length: def.minLength, max_length: def.maxLength };
      return def.autocomplete !== undefined
        ? { ...base, type: ApplicationCommandOptionType.String, autocomplete: true }
        : { ...base, type: ApplicationCommandOptionType.String, choices: mapChoices<string>(def.choices) };
    }
    case ApplicationCommandOptionType.Integer: {
      const base = { ...shared, min_value: def.minValue, max_value: def.maxValue };
      return def.autocomplete !== undefined
        ? { ...base, type: ApplicationCommandOptionType.Integer, autocomplete: true }
        : { ...base, type: ApplicationCommandOptionType.Integer, choices: mapChoices<number>(def.choices) };
    }
    case ApplicationCommandOptionType.Number: {
      const base = { ...shared, min_value: def.minValue, max_value: def.maxValue };
      return def.autocomplete !== undefined
        ? { ...base, type: ApplicationCommandOptionType.Number, autocomplete: true }
        : { ...base, type: ApplicationCommandOptionType.Number, choices: mapChoices<number>(def.choices) };
    }
    case ApplicationCommandOptionType.Channel:
      return {
        ...shared,
        type: ApplicationCommandOptionType.Channel,
        channel_types: def.channelTypes ? [...def.channelTypes] : undefined,
      };
    case ApplicationCommandOptionType.User:
      return { ...shared, type: ApplicationCommandOptionType.User };
    case ApplicationCommandOptionType.Boolean:
      return { ...shared, type: ApplicationCommandOptionType.Boolean };
    case ApplicationCommandOptionType.Role:
      return { ...shared, type: ApplicationCommandOptionType.Role };
    case ApplicationCommandOptionType.Mentionable:
      return { ...shared, type: ApplicationCommandOptionType.Mentionable };
    case ApplicationCommandOptionType.Attachment:
      return { ...shared, type: ApplicationCommandOptionType.Attachment };
    default:
      return { ...shared, type: ApplicationCommandOptionType.String };
  }
}

/** Reads a resolved option value off a discord.js option resolver. */
export function readOption(
  resolver: OptionReader,
  name: string,
  def: AnyOptionDef,
): OptionValue | undefined {
  switch (def.type) {
    case ApplicationCommandOptionType.String:
      return resolver.getString(name) ?? undefined;
    case ApplicationCommandOptionType.Integer:
      return resolver.getInteger(name) ?? undefined;
    case ApplicationCommandOptionType.Number:
      return resolver.getNumber(name) ?? undefined;
    case ApplicationCommandOptionType.Boolean:
      return resolver.getBoolean(name) ?? undefined;
    case ApplicationCommandOptionType.User:
      return resolver.getUser(name) ?? undefined;
    case ApplicationCommandOptionType.Channel:
      return resolver.getChannel(name) ?? undefined;
    case ApplicationCommandOptionType.Role:
      return resolver.getRole(name) ?? undefined;
    case ApplicationCommandOptionType.Mentionable:
      return resolver.getMentionable(name) ?? undefined;
    case ApplicationCommandOptionType.Attachment:
      return resolver.getAttachment(name) ?? undefined;
    default:
      return undefined;
  }
}

/** True if any option in the map declares an autocomplete handler. */
export function optionsHaveAutocomplete(options: OptionMap): boolean {
  for (const def of Object.values(options)) {
    if (def.autocomplete !== undefined) return true;
  }
  return false;
}
