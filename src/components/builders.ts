import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  CheckboxBuilder,
  CheckboxGroupBuilder,
  FileUploadBuilder,
  LabelBuilder,
  MentionableSelectMenuBuilder,
  ModalBuilder,
  RadioGroupBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuBuilder,
  type Attachment,
  type Awaitable,
  type ChannelType,
  type ComponentEmojiResolvable,
  type FileUploadType,
  type ModalSubmitFields,
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
import type { Guard } from "../guards.js";

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
  /** Preconditions evaluated before the handler runs. */
  guards?: readonly Guard[];
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
  return { kind: "button", namespace: compiled.namespace, paramNames: compiled.paramNames, guards: config.guards, async handle(interaction, params) {
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
  }, };
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
  /** Preconditions evaluated before the handler runs. */
  guards?: readonly Guard[];
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
  return { kind: "stringSelect", namespace: compiled.namespace, paramNames: compiled.paramNames, guards: config.guards, async handle(interaction, params) {
    await config.run(new StringSelectContext(interaction, params as Params<P>));
  },
  build(...args: BuildArgs<P>): StringSelectMenuBuilder {
    const params = (args[0] ?? {}) as Record<string, string>;
    const builder = new StringSelectMenuBuilder()
      .setCustomId(buildCustomId(compiled, params))
      .addOptions(...config.options);
    applySelectBase(builder, config);
    return builder;
  }, };
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
  return { kind: "userSelect", namespace: compiled.namespace, paramNames: compiled.paramNames, guards: config.guards, async handle(interaction, params) {
    await config.run(new UserSelectContext(interaction, params as Params<P>));
  },
  build(...args: BuildArgs<P>): UserSelectMenuBuilder {
    const params = (args[0] ?? {}) as Record<string, string>;
    const builder = new UserSelectMenuBuilder().setCustomId(buildCustomId(compiled, params));
    applySelectBase(builder, config);
    return builder;
  }, };
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
  return { kind: "roleSelect", namespace: compiled.namespace, paramNames: compiled.paramNames, guards: config.guards, async handle(interaction, params) {
    await config.run(new RoleSelectContext(interaction, params as Params<P>));
  },
  build(...args: BuildArgs<P>): RoleSelectMenuBuilder {
    const params = (args[0] ?? {}) as Record<string, string>;
    const builder = new RoleSelectMenuBuilder().setCustomId(buildCustomId(compiled, params));
    applySelectBase(builder, config);
    return builder;
  }, };
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
  return { kind: "channelSelect", namespace: compiled.namespace, paramNames: compiled.paramNames, guards: config.guards, async handle(interaction, params) {
    await config.run(new ChannelSelectContext(interaction, params as Params<P>));
  },
  build(...args: BuildArgs<P>): ChannelSelectMenuBuilder {
    const params = (args[0] ?? {}) as Record<string, string>;
    const builder = new ChannelSelectMenuBuilder().setCustomId(buildCustomId(compiled, params));
    if (config.channelTypes !== undefined) builder.setChannelTypes(...config.channelTypes);
    applySelectBase(builder, config);
    return builder;
  }, };
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
  return { kind: "mentionableSelect", namespace: compiled.namespace, paramNames: compiled.paramNames, guards: config.guards, async handle(interaction, params) {
    await config.run(new MentionableSelectContext(interaction, params as Params<P>));
  },
  build(...args: BuildArgs<P>): MentionableSelectMenuBuilder {
    const params = (args[0] ?? {}) as Record<string, string>;
    const builder = new MentionableSelectMenuBuilder().setCustomId(buildCustomId(compiled, params));
    applySelectBase(builder, config);
    return builder;
  }, };
}

// --- modals ----------------------------------------------------------------

/** Accepted text-input styles. */
export type TextInputStyleInput = "Short" | "Paragraph" | TextInputStyle;

function resolveTextInputStyle(input: TextInputStyleInput | undefined): TextInputStyle {
  if (input === undefined) return TextInputStyle.Short;
  return typeof input === "number" ? input : TextInputStyle[input];
}

/** Every modal field kind spearkit knows how to build and read back. */
export type ModalFieldKind =
  | "textInput"
  | "stringSelect"
  | "userSelect"
  | "roleSelect"
  | "channelSelect"
  | "mentionableSelect"
  | "radioGroup"
  | "checkboxGroup"
  | "checkbox"
  | "fileUpload";

/**
 * Base of every modal field definition. The two type parameters are phantom
 * markers used purely for compile-time inference of the submitted value:
 * - `TValue` is the type produced for the modal handler.
 * - `TRequired` controls nullability (`false` => value may be missing).
 *
 * Every field renders as a Discord **Label** component (the recommended modal
 * surface); legacy Action Row + Text Input modals are no longer emitted.
 */
export interface ModalFieldDef<TValue = unknown, TRequired extends boolean = boolean> {
  readonly kind: ModalFieldKind;
  readonly label: string;
  readonly description?: string;
  readonly required: TRequired;
  /** Phantom-only marker. Never populated at runtime. */
  readonly __value?: TValue;
}

/** A resolved text-input field definition. Submits a `string`. */
export interface TextInputDef extends ModalFieldDef<string, true> {
  readonly kind: "textInput";
  readonly style: TextInputStyle;
  readonly placeholder?: string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly value?: string;
}

/** One option inside a radio group / checkbox group. */
export interface GroupOption {
  readonly label: string;
  readonly value: string;
  readonly description?: string;
  readonly default?: boolean;
}

/** A radio group field definition. Submits one of its option values. */
export interface RadioGroupDef<V extends string = string, TRequired extends boolean = boolean>
  extends ModalFieldDef<V, TRequired> {
  readonly kind: "radioGroup";
  readonly options: readonly GroupOption[];
}

/** A checkbox group field definition. Submits an array of its option values. */
export interface CheckboxGroupDef<V extends string = string> extends ModalFieldDef<V[], true> {
  readonly kind: "checkboxGroup";
  readonly options: readonly GroupOption[];
  readonly minValues?: number;
  readonly maxValues?: number;
}

/** A single checkbox field definition. Submits a `boolean` (never `required`). */
export interface CheckboxDef extends ModalFieldDef<boolean, true> {
  readonly kind: "checkbox";
  readonly defaultChecked?: boolean;
}

/** A file upload field definition. Submits the uploaded {@link Attachment}s. */
export interface FileUploadDef extends ModalFieldDef<Attachment[], true> {
  readonly kind: "fileUpload";
  readonly minValues?: number;
  readonly maxValues?: number;
  /** Allowed MIME types / dot-prefixed extensions (Discord file-type filter). */
  readonly allowedFileTypes?: readonly FileUploadType[];
}

/** Shared select-menu field config (placeholder + value bounds). */
interface SelectFieldBase extends ModalFieldDef<string[], true> {
  readonly placeholder?: string;
  readonly minValues?: number;
  readonly maxValues?: number;
}

/** A string select field inside a modal. Submits the chosen values. */
export interface StringSelectFieldDef extends SelectFieldBase {
  readonly kind: "stringSelect";
  readonly options: readonly SelectMenuComponentOptionData[];
}

/** A user select field inside a modal. Submits user ids. */
export interface UserSelectFieldDef extends SelectFieldBase {
  readonly kind: "userSelect";
}

/** A role select field inside a modal. Submits role ids. */
export interface RoleSelectFieldDef extends SelectFieldBase {
  readonly kind: "roleSelect";
}

/** A channel select field inside a modal. Submits channel ids. */
export interface ChannelSelectFieldDef extends SelectFieldBase {
  readonly kind: "channelSelect";
  readonly channelTypes?: readonly ChannelType[];
}

/** A mentionable (user + role) select field inside a modal. Submits ids. */
export interface MentionableSelectFieldDef extends SelectFieldBase {
  readonly kind: "mentionableSelect";
}

/** Any modal field definition, regardless of value type. */
export type AnyModalFieldDef = ModalFieldDef<unknown, boolean>;

/** A map of field name => definition. */
export type ModalFieldMap = Record<string, AnyModalFieldDef>;

/**
 * Maps a single field definition to the value passed into the modal handler.
 * Optional fields only widen to include `undefined` when being empty is a
 * meaningful distinct state (radio groups); collection-valued fields resolve
 * to an empty array instead.
 */
export type ResolvedFieldValue<D extends AnyModalFieldDef> =
  D extends ModalFieldDef<infer V, infer Req> ? (Req extends true ? V : V | undefined) : never;

/** Resolves a whole {@link ModalFieldMap} into the handler's `fields` object. */
export type ResolvedModalFields<F extends ModalFieldMap> = {
  [K in keyof F]: ResolvedFieldValue<F[K]>;
};

type FieldConfigBase = {
  readonly label: string;
  readonly description?: string;
  readonly required?: boolean;
};

type IsRequired<C extends FieldConfigBase> = C["required"] extends false ? false : true;

/** The single boundary assertion: an omitted `required` defaults to Discord's `true`. */
function requiredTrue(config: FieldConfigBase): true {
  return (config.required ?? true) as true;
}

type OptionValues<C> = C extends { readonly options: readonly { readonly value: infer V }[] }
  ? [V] extends [string]
    ? V
    : string
  : string;

/**
 * Define a single modal text-input field.
 *
 * @example
 * ```ts
 * textInput({ label: "Why", style: "Paragraph", required: true })
 * ```
 */
export function textInput(config: {
  label: string;
  style?: TextInputStyleInput;
  description?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  value?: string;
}): TextInputDef {
  return {
    kind: "textInput",
    label: config.label,
    description: config.description,
    style: resolveTextInputStyle(config.style),
    placeholder: config.placeholder,
    required: requiredTrue(config),
    minLength: config.minLength,
    maxLength: config.maxLength,
    value: config.value,
  };
}

/**
 * Define a modal radio-group field (exactly one selectable option).
 *
 * @example
 * ```ts
 * radioGroup({
 *   label: "Type",
 *   options: [
 *     { label: "Spam", value: "spam" },
 *     { label: "Abuse", value: "abuse" },
 *   ],
 * })
 * ```
 */
export function radioGroup<const C extends FieldConfigBase & { readonly options: readonly GroupOption[] }>(
  config: C,
): RadioGroupDef<OptionValues<C>, IsRequired<C>> {
  return {
    kind: "radioGroup",
    label: config.label,
    description: config.description,
    options: config.options,
    required: (config.required ?? true) as IsRequired<C>,
  };
}

/**
 * Define a modal checkbox-group field (zero or more selectable options).
 * Checkbox groups cannot be `required`; an untouched submit resolves to `[]`.
 *
 * @example
 * ```ts
 * checkboxGroup({
 *   label: "Also",
 *   minValues: 0,
 *   maxValues: 3,
 *   options: [{ label: "Ban", value: "ban" }],
 * })
 * ```
 */
export function checkboxGroup<
  const C extends FieldConfigBase & {
    readonly options: readonly GroupOption[];
    readonly minValues?: number;
    readonly maxValues?: number;
  },
>(config: C): CheckboxGroupDef<OptionValues<C>> {
  return {
    kind: "checkboxGroup",
    label: config.label,
    description: config.description,
    options: config.options,
    minValues: config.minValues,
    maxValues: config.maxValues,
    // Checkbox groups cannot be required per the Discord spec; keep the flag
    // truthful so an untouched submit resolving to [] is always valid.
    required: true,
  };
}

/**
 * Define a modal checkbox field (a single yes/no tick). Checkboxes cannot be
 * required per the Discord spec; the handler always receives a `boolean`.
 *
 * @example
 * ```ts
 * checkbox({ label: "I understand", defaultChecked: false })
 * ```
 */
export function checkbox(config: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}): CheckboxDef {
  return {
    kind: "checkbox",
    label: config.label,
    description: config.description,
    defaultChecked: config.defaultChecked ?? false,
    required: true,
  };
}

/**
 * Define a modal file-upload field. The handler receives the uploaded
 * {@link Attachment}s (CDN links — file bodies are not part of the interaction).
 *
 * @example
 * ```ts
 * fileUpload({ label: "Screenshots", minValues: 0, maxValues: 5 })
 * ```
 */
export function fileUpload(
  config: FieldConfigBase & {
    minValues?: number;
    maxValues?: number;
    allowedFileTypes?: readonly FileUploadType[];
  },
): FileUploadDef {
  return {
    kind: "fileUpload",
    label: config.label,
    description: config.description,
    minValues: config.minValues,
    maxValues: config.maxValues,
    allowedFileTypes: config.allowedFileTypes,
    required: requiredTrue(config),
  };
}

/**
 * Define a string select menu field inside a modal. The handler receives the
 * chosen values.
 */
export function stringSelectField(config: FieldConfigBase & {
  options: readonly SelectMenuComponentOptionData[];
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
}): StringSelectFieldDef {
  return {
    kind: "stringSelect",
    label: config.label,
    description: config.description,
    options: config.options,
    placeholder: config.placeholder,
    minValues: config.minValues,
    maxValues: config.maxValues,
    required: requiredTrue(config),
  };
}

/** Define a user select field inside a modal. The handler receives user ids. */
export function userSelectField(
  config: FieldConfigBase & { placeholder?: string; minValues?: number; maxValues?: number },
): UserSelectFieldDef {
  return {
    kind: "userSelect",
    label: config.label,
    description: config.description,
    placeholder: config.placeholder,
    minValues: config.minValues,
    maxValues: config.maxValues,
    required: requiredTrue(config),
  };
}

/** Define a role select field inside a modal. The handler receives role ids. */
export function roleSelectField(
  config: FieldConfigBase & { placeholder?: string; minValues?: number; maxValues?: number },
): RoleSelectFieldDef {
  return {
    kind: "roleSelect",
    label: config.label,
    description: config.description,
    placeholder: config.placeholder,
    minValues: config.minValues,
    maxValues: config.maxValues,
    required: requiredTrue(config),
  };
}

/**
 * Define a channel select field inside a modal, optionally restricted to
 * channel types. The handler receives channel ids.
 */
export function channelSelectField(
  config: FieldConfigBase & {
    placeholder?: string;
    minValues?: number;
    maxValues?: number;
    channelTypes?: readonly ChannelType[];
  },
): ChannelSelectFieldDef {
  return {
    kind: "channelSelect",
    label: config.label,
    description: config.description,
    placeholder: config.placeholder,
    minValues: config.minValues,
    maxValues: config.maxValues,
    channelTypes: config.channelTypes,
    required: requiredTrue(config),
  };
}

/** Define a mentionable (user + role) select field inside a modal. */
export function mentionableSelectField(
  config: FieldConfigBase & { placeholder?: string; minValues?: number; maxValues?: number },
): MentionableSelectFieldDef {
  return {
    kind: "mentionableSelect",
    label: config.label,
    description: config.description,
    placeholder: config.placeholder,
    minValues: config.minValues,
    maxValues: config.maxValues,
    required: requiredTrue(config),
  };
}

/**
 * Every concrete field definition spearkit emits, as a discriminated union.
 * Internal detail used to build labels without losing per-kind properties.
 */
type AnyConcreteFieldDef =
  | TextInputDef
  | StringSelectFieldDef
  | UserSelectFieldDef
  | RoleSelectFieldDef
  | ChannelSelectFieldDef
  | MentionableSelectFieldDef
  | RadioGroupDef
  | CheckboxGroupDef
  | CheckboxDef
  | FileUploadDef;

/** Config for a modal created with {@link modal}. */
export interface ModalConfig<P extends string, F extends ModalFieldMap, R> {
  id: P;
  title: string;
  fields: F;
  /** Preconditions evaluated before the handler runs. */
  guards?: readonly Guard[];
  run: (ctx: ModalContext<Params<P>, ResolvedModalFields<F>>) => Awaitable<R>;
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
  input.setRequired(def.required);
  if (def.minLength !== undefined) input.setMinLength(def.minLength);
  if (def.maxLength !== undefined) input.setMaxLength(def.maxLength);
  if (def.value !== undefined) input.setValue(def.value);
  return input;
}

function applySelectFieldBase(
  builder: AnySelectBuilder,
  def: Pick<SelectFieldBase, "placeholder" | "minValues" | "maxValues">,
): void {
  if (def.placeholder !== undefined) builder.setPlaceholder(def.placeholder);
  if (def.minValues !== undefined) builder.setMinValues(def.minValues);
  if (def.maxValues !== undefined) builder.setMaxValues(def.maxValues);
}

function buildLabel(customId: string, def: AnyConcreteFieldDef): LabelBuilder {
  const label = new LabelBuilder().setLabel(def.label);
  if (def.description !== undefined) label.setDescription(def.description);
  switch (def.kind) {
    case "textInput":
      label.setTextInputComponent(buildTextInput(customId, def));
      break;
    case "stringSelect": {
      const select = new StringSelectMenuBuilder().setCustomId(customId).addOptions(...def.options);
      applySelectFieldBase(select, def);
      label.setStringSelectMenuComponent(select);
      break;
    }
    case "userSelect": {
      const select = new UserSelectMenuBuilder().setCustomId(customId);
      applySelectFieldBase(select, def);
      label.setUserSelectMenuComponent(select);
      break;
    }
    case "roleSelect": {
      const select = new RoleSelectMenuBuilder().setCustomId(customId);
      applySelectFieldBase(select, def);
      label.setRoleSelectMenuComponent(select);
      break;
    }
    case "channelSelect": {
      const select = new ChannelSelectMenuBuilder().setCustomId(customId);
      if (def.channelTypes !== undefined) select.setChannelTypes(...def.channelTypes);
      applySelectFieldBase(select, def);
      label.setChannelSelectMenuComponent(select);
      break;
    }
    case "mentionableSelect": {
      const select = new MentionableSelectMenuBuilder().setCustomId(customId);
      applySelectFieldBase(select, def);
      label.setMentionableSelectMenuComponent(select);
      break;
    }
    case "radioGroup":
      label.setRadioGroupComponent(
        new RadioGroupBuilder({
          custom_id: customId,
          options: def.options.map((option) => ({ ...option })),
          required: def.required,
        }),
      );
      break;
    case "checkboxGroup":
      label.setCheckboxGroupComponent(
        new CheckboxGroupBuilder({
          custom_id: customId,
          options: def.options.map((option) => ({ ...option })),
          min_values: def.minValues,
          max_values: def.maxValues,
          // minValues: 0 marks the group skippable; Discord forbids required+0.
          required: def.minValues !== 0,
        }),
      );
      break;
    case "checkbox":
      label.setCheckboxComponent(new CheckboxBuilder({ custom_id: customId, default: def.defaultChecked }));
      break;
    case "fileUpload":
      label.setFileUploadComponent(
        new FileUploadBuilder({
          custom_id: customId,
          min_values: def.minValues,
          max_values: def.maxValues,
          file_types: def.allowedFileTypes ? [...def.allowedFileTypes] : undefined,
          required: def.required && def.minValues !== 0,
        }),
      );
      break;
  }
  return label;
}

function extractFieldValue(fields: ModalSubmitFields, customId: string, kind: ModalFieldKind): unknown {
  try {
    switch (kind) {
      case "textInput":
        return fields.getTextInputValue(customId);
      case "stringSelect":
        return [...fields.getStringSelectValues(customId)];
      case "userSelect":
        return [...(fields.getSelectedUsers(customId, false)?.keys() ?? [])];
      case "roleSelect":
        return [...(fields.getSelectedRoles(customId, false)?.keys() ?? [])];
      case "channelSelect":
        return [...(fields.getSelectedChannels(customId, false)?.keys() ?? [])];
      case "mentionableSelect": {
        const selected = fields.getSelectedMentionables(customId, false);
        if (!selected) return [];
        return [...new Set<string>([...selected.users.keys(), ...selected.roles.keys()])];
      }
      case "radioGroup":
        return fields.getRadioGroup(customId, false) ?? undefined;
      case "checkboxGroup":
        return [...fields.getCheckboxGroup(customId)];
      case "checkbox":
        return fields.getCheckbox(customId);
      case "fileUpload":
        return [...(fields.getUploadedFiles(customId, false)?.values() ?? [])];
    }
  } catch {
    // Missing optional component: mirror Discord's empty state per field kind.
    return kind === "textInput" ? "" : kind === "checkbox" ? false : [];
  }
}

/**
 * Define a modal: its title, its custom-id pattern, its typed fields and a
 * submit handler. Every field renders as a Label component; submitted values
 * arrive keyed by field name in `ctx.fields`, inferred from the definitions.
 *
 * @example
 * ```ts
 * const report = modal({
 *   id: "report:{userId}",
 *   title: "Report",
 *   fields: {
 *     reason: textInput({ label: "Why", style: "Paragraph", required: true }),
 *     kind: radioGroup({
 *       label: "Type",
 *       options: [{ label: "Spam", value: "spam" }, { label: "Abuse", value: "abuse" }],
 *     }),
 *     agree: checkbox({ label: "I understand" }),
 *   },
 *   run: (ctx) => {
 *     ctx.params.userId; // string
 *     ctx.fields.reason; // string
 *     ctx.fields.kind;   // "spam" | "abuse"
 *     ctx.fields.agree;  // boolean
 *   },
 * });
 * ```
 */
export function modal<const P extends string, F extends ModalFieldMap, R = void>(
  config: ModalConfig<P, F, R>,
): Modal<P> {
  const compiled = compilePattern(config.id);
  const entries = Object.entries(config.fields) as [string, AnyConcreteFieldDef][];
  return { kind: "modal", namespace: compiled.namespace, paramNames: compiled.paramNames, guards: config.guards, async handle(interaction, params) {
    const fields: Record<string, unknown> = {};
    for (const [key, def] of entries) {
      fields[key] = extractFieldValue(interaction.fields, key, def.kind);
    }
    await config.run(
      new ModalContext(interaction, params as Params<P>, fields as ResolvedModalFields<F>),
    );
  },
  build(...args: BuildArgs<P>): ModalBuilder {
    const params = (args[0] ?? {}) as Record<string, string>;
    const builder = new ModalBuilder()
      .setCustomId(buildCustomId(compiled, params))
      .setTitle(config.title);
    builder.addLabelComponents(...entries.map(([key, def]) => buildLabel(key, def)));
    return builder;
  }, };
}
