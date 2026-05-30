import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  ModalBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuBuilder,
  type Awaitable,
  type ChannelType,
  type ComponentEmojiResolvable,
  type SelectMenuComponentOptionData,
} from "discord.js";
import {
  ButtonContext,
  ChannelSelectContext,
  MentionableSelectContext,
  ModalContext,
  RoleSelectContext,
  StringSelectContext,
  UserSelectContext,
} from "./context.js";
import {
  buildCustomId,
  compilePattern,
  type BuildArgs,
  type Params,
} from "./customId.js";
import type {
  ButtonRoute,
  ChannelSelectRoute,
  MentionableSelectRoute,
  ModalRoute,
  RoleSelectRoute,
  StringSelectRoute,
  UserSelectRoute,
} from "./registry.js";

// --- buttons ---------------------------------------------------------------

/** Accepted button styles for an interactive (custom-id) button. */
export type ButtonStyleInput =
  | "Primary"
  | "Secondary"
  | "Success"
  | "Danger"
  | ButtonStyle.Primary
  | ButtonStyle.Secondary
  | ButtonStyle.Success
  | ButtonStyle.Danger;

function resolveButtonStyle(input: ButtonStyleInput | undefined): ButtonStyle {
  if (input === undefined) return ButtonStyle.Secondary;
  return typeof input === "number" ? input : ButtonStyle[input];
}

/** Config for an interactive button created with {@link button}. */
export interface ButtonConfig<P extends string, R> {
  /** Custom-id pattern, e.g. `"vote"` or `"vote:{choice}"`. */
  id: P;
  label?: string;
  style?: ButtonStyleInput;
  emoji?: ComponentEmojiResolvable;
  disabled?: boolean;
  run: (ctx: ButtonContext<Params<P>>) => Awaitable<R>;
}

/** A registrable button with a typed {@link build}. */
export interface Button<P extends string> extends ButtonRoute {
  build(...args: BuildArgs<P>): ButtonBuilder;
}

/**
 * Define an interactive button: its appearance, its custom-id pattern and its
 * click handler, all in one place. Register it with `client.components.add`.
 *
 * @example
 * ```ts
 * const vote = button({
 *   id: "vote:{choice}",
 *   label: "Yes",
 *   style: "Success",
 *   run: (ctx) => ctx.reply(`You chose ${ctx.params.choice}`),
 * });
 * row(vote.build({ choice: "yes" }));
 * ```
 */
export function button<const P extends string, R = void>(config: ButtonConfig<P, R>): Button<P> {
  const compiled = compilePattern(config.id);
  const style = resolveButtonStyle(config.style);
  return {
    kind: "button",
    namespace: compiled.namespace,
    paramNames: compiled.paramNames,
    async handle(interaction, params) {
      await config.run(new ButtonContext(interaction, params as Params<P>));
    },
    build(...args: BuildArgs<P>): ButtonBuilder {
      const params = (args[0] ?? {}) as Record<string, string>;
      const builder = new ButtonBuilder()
        .setCustomId(buildCustomId(compiled, params))
        .setStyle(style);
      if (config.label !== undefined) builder.setLabel(config.label);
      if (config.emoji !== undefined) builder.setEmoji(config.emoji);
      if (config.disabled !== undefined) builder.setDisabled(config.disabled);
      return builder;
    },
  };
}

/** Config for a link button (no handler — just opens a URL). */
export interface LinkButtonConfig {
  url: string;
  label?: string;
  emoji?: ComponentEmojiResolvable;
  disabled?: boolean;
}

/** Build a link button. Link buttons have no custom-id and run no handler. */
export function linkButton(config: LinkButtonConfig): ButtonBuilder {
  const builder = new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(config.url);
  if (config.label !== undefined) builder.setLabel(config.label);
  if (config.emoji !== undefined) builder.setEmoji(config.emoji);
  if (config.disabled !== undefined) builder.setDisabled(config.disabled);
  return builder;
}

// --- selects ---------------------------------------------------------------

interface SelectConfigBase {
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  disabled?: boolean;
}

/** Any of the select-menu builders that share the base configuration setters. */
type AnySelectBuilder =
  | StringSelectMenuBuilder
  | UserSelectMenuBuilder
  | RoleSelectMenuBuilder
  | ChannelSelectMenuBuilder
  | MentionableSelectMenuBuilder;
function applySelectBase(builder: AnySelectBuilder, config: SelectConfigBase): void {
  if (config.placeholder !== undefined) builder.setPlaceholder(config.placeholder);
  if (config.minValues !== undefined) builder.setMinValues(config.minValues);
  if (config.maxValues !== undefined) builder.setMaxValues(config.maxValues);
  if (config.disabled !== undefined) builder.setDisabled(config.disabled);
}

/** Config for a string select created with {@link stringSelect}. */
export interface StringSelectConfig<P extends string, R> extends SelectConfigBase {
  id: P;
  options: readonly SelectMenuComponentOptionData[];
  run: (ctx: StringSelectContext<Params<P>>) => Awaitable<R>;
}

/** A registrable string select with a typed {@link build}. */
export interface StringSelect<P extends string> extends StringSelectRoute {
  build(...args: BuildArgs<P>): StringSelectMenuBuilder;
}

/** Define a string select menu, its custom-id pattern and its handler. */
export function stringSelect<const P extends string, R = void>(
  config: StringSelectConfig<P, R>,
): StringSelect<P> {
  const compiled = compilePattern(config.id);
  return {
    kind: "stringSelect",
    namespace: compiled.namespace,
    paramNames: compiled.paramNames,
    async handle(interaction, params) {
      await config.run(new StringSelectContext(interaction, params as Params<P>));
    },
    build(...args: BuildArgs<P>): StringSelectMenuBuilder {
      const params = (args[0] ?? {}) as Record<string, string>;
      const builder = new StringSelectMenuBuilder()
        .setCustomId(buildCustomId(compiled, params))
        .addOptions(...config.options);
      applySelectBase(builder, config);
      return builder;
    },
  };
}

/** Config shared by the entity-select builders (user/role/channel/mentionable). */
export interface EntitySelectConfig<P extends string> extends SelectConfigBase {
  id: P;
}

/** A registrable user select. */
export interface UserSelect<P extends string> extends UserSelectRoute {
  build(...args: BuildArgs<P>): UserSelectMenuBuilder;
}

/** Define a user select menu. */
export function userSelect<const P extends string, R = void>(
  config: EntitySelectConfig<P> & { run: (ctx: UserSelectContext<Params<P>>) => Awaitable<R> },
): UserSelect<P> {
  const compiled = compilePattern(config.id);
  return {
    kind: "userSelect",
    namespace: compiled.namespace,
    paramNames: compiled.paramNames,
    async handle(interaction, params) {
      await config.run(new UserSelectContext(interaction, params as Params<P>));
    },
    build(...args: BuildArgs<P>): UserSelectMenuBuilder {
      const params = (args[0] ?? {}) as Record<string, string>;
      const builder = new UserSelectMenuBuilder().setCustomId(buildCustomId(compiled, params));
      applySelectBase(builder, config);
      return builder;
    },
  };
}

/** A registrable role select. */
export interface RoleSelect<P extends string> extends RoleSelectRoute {
  build(...args: BuildArgs<P>): RoleSelectMenuBuilder;
}

/** Define a role select menu. */
export function roleSelect<const P extends string, R = void>(
  config: EntitySelectConfig<P> & { run: (ctx: RoleSelectContext<Params<P>>) => Awaitable<R> },
): RoleSelect<P> {
  const compiled = compilePattern(config.id);
  return {
    kind: "roleSelect",
    namespace: compiled.namespace,
    paramNames: compiled.paramNames,
    async handle(interaction, params) {
      await config.run(new RoleSelectContext(interaction, params as Params<P>));
    },
    build(...args: BuildArgs<P>): RoleSelectMenuBuilder {
      const params = (args[0] ?? {}) as Record<string, string>;
      const builder = new RoleSelectMenuBuilder().setCustomId(buildCustomId(compiled, params));
      applySelectBase(builder, config);
      return builder;
    },
  };
}

/** A registrable channel select. */
export interface ChannelSelect<P extends string> extends ChannelSelectRoute {
  build(...args: BuildArgs<P>): ChannelSelectMenuBuilder;
}

/** Define a channel select menu, optionally restricted to channel types. */
export function channelSelect<const P extends string, R = void>(
  config: EntitySelectConfig<P> & {
    channelTypes?: readonly ChannelType[];
    run: (ctx: ChannelSelectContext<Params<P>>) => Awaitable<R>;
  },
): ChannelSelect<P> {
  const compiled = compilePattern(config.id);
  return {
    kind: "channelSelect",
    namespace: compiled.namespace,
    paramNames: compiled.paramNames,
    async handle(interaction, params) {
      await config.run(new ChannelSelectContext(interaction, params as Params<P>));
    },
    build(...args: BuildArgs<P>): ChannelSelectMenuBuilder {
      const params = (args[0] ?? {}) as Record<string, string>;
      const builder = new ChannelSelectMenuBuilder().setCustomId(buildCustomId(compiled, params));
      if (config.channelTypes !== undefined) builder.setChannelTypes(...config.channelTypes);
      applySelectBase(builder, config);
      return builder;
    },
  };
}

/** A registrable mentionable select. */
export interface MentionableSelect<P extends string> extends MentionableSelectRoute {
  build(...args: BuildArgs<P>): MentionableSelectMenuBuilder;
}

/** Define a mentionable (user + role) select menu. */
export function mentionableSelect<const P extends string, R = void>(
  config: EntitySelectConfig<P> & {
    run: (ctx: MentionableSelectContext<Params<P>>) => Awaitable<R>;
  },
): MentionableSelect<P> {
  const compiled = compilePattern(config.id);
  return {
    kind: "mentionableSelect",
    namespace: compiled.namespace,
    paramNames: compiled.paramNames,
    async handle(interaction, params) {
      await config.run(new MentionableSelectContext(interaction, params as Params<P>));
    },
    build(...args: BuildArgs<P>): MentionableSelectMenuBuilder {
      const params = (args[0] ?? {}) as Record<string, string>;
      const builder = new MentionableSelectMenuBuilder().setCustomId(buildCustomId(compiled, params));
      applySelectBase(builder, config);
      return builder;
    },
  };
}

// --- modals ----------------------------------------------------------------

/** Accepted text-input styles. */
export type TextInputStyleInput = "Short" | "Paragraph" | TextInputStyle;

function resolveTextInputStyle(input: TextInputStyleInput | undefined): TextInputStyle {
  if (input === undefined) return TextInputStyle.Short;
  return typeof input === "number" ? input : TextInputStyle[input];
}

/** A resolved text-input field definition. */
export interface TextInputDef {
  readonly label: string;
  readonly style: TextInputStyle;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly value?: string;
}

/** Define a single modal text-input field. */
export function textInput(config: {
  label: string;
  style?: TextInputStyleInput;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  value?: string;
}): TextInputDef {
  return {
    label: config.label,
    style: resolveTextInputStyle(config.style),
    placeholder: config.placeholder,
    required: config.required,
    minLength: config.minLength,
    maxLength: config.maxLength,
    value: config.value,
  };
}

/** Config for a modal created with {@link modal}. */
export interface ModalConfig<P extends string, F extends Record<string, TextInputDef>, R> {
  id: P;
  title: string;
  fields: F;
  run: (ctx: ModalContext<Params<P>, keyof F & string>) => Awaitable<R>;
}

/** A registrable modal with a typed {@link build}. */
export interface Modal<P extends string> extends ModalRoute {
  build(...args: BuildArgs<P>): ModalBuilder;
}

function buildTextInput(customId: string, def: TextInputDef): TextInputBuilder {
  const input = new TextInputBuilder()
    .setCustomId(customId)
    .setLabel(def.label)
    .setStyle(def.style);
  if (def.placeholder !== undefined) input.setPlaceholder(def.placeholder);
  if (def.required !== undefined) input.setRequired(def.required);
  if (def.minLength !== undefined) input.setMinLength(def.minLength);
  if (def.maxLength !== undefined) input.setMaxLength(def.maxLength);
  if (def.value !== undefined) input.setValue(def.value);
  return input;
}

/**
 * Define a modal: its title, its custom-id pattern, its text-input fields and
 * a submit handler. The handler receives the submitted values keyed by field
 * name in `ctx.fields`.
 *
 * @example
 * ```ts
 * const feedback = modal({
 *   id: "feedback:{ticket}",
 *   title: "Feedback",
 *   fields: { comment: textInput({ label: "Comment", style: "Paragraph" }) },
 *   run: (ctx) => ctx.reply(`Thanks! (${ctx.params.ticket}): ${ctx.fields.comment}`),
 * });
 * ```
 */
export function modal<const P extends string, F extends Record<string, TextInputDef>, R = void>(
  config: ModalConfig<P, F, R>,
): Modal<P> {
  const compiled = compilePattern(config.id);
  const fieldKeys = Object.keys(config.fields);
  return {
    kind: "modal",
    namespace: compiled.namespace,
    paramNames: compiled.paramNames,
    async handle(interaction, params) {
      const fields: Record<string, string> = {};
      for (const key of fieldKeys) {
        try {
          fields[key] = interaction.fields.getTextInputValue(key);
        } catch {
          fields[key] = "";
        }
      }
      await config.run(
        new ModalContext(interaction, params as Params<P>, fields as Record<keyof F & string, string>),
      );
    },
    build(...args: BuildArgs<P>): ModalBuilder {
      const params = (args[0] ?? {}) as Record<string, string>;
      const builder = new ModalBuilder()
        .setCustomId(buildCustomId(compiled, params))
        .setTitle(config.title);
      for (const [key, def] of Object.entries(config.fields)) {
        builder.addComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(buildTextInput(key, def)),
        );
      }
      return builder;
    },
  };
}
