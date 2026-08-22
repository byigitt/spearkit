/**
 * Faithful interaction fixtures for exercising spearkit's dispatch and routing.
 *
 * These are not result-faking mocks: every method does the real thing a
 * discord.js interaction would do for the purposes of routing (records the
 * payload, flips state flags, returns control). The code under test — option
 * resolution, custom-id decoding, handler invocation — runs for real.
 */
import { EventEmitter } from "node:events";
import type {
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";

export interface Capture {
  replies: unknown[];
  edits: unknown[];
  followUps: unknown[];
  updates: unknown[];
  modals: unknown[];
  autocomplete: unknown[][];
  errors: Error[];
}

function newCapture(client: EventEmitter): Capture {
  const capture: Capture = {
    replies: [],
    edits: [],
    followUps: [],
    updates: [],
    modals: [],
    autocomplete: [],
    errors: [],
  };
  client.on("error", (err: Error) => capture.errors.push(err));
  return capture;
}

type OptionValues = Record<string, string | number | boolean>;

function makeResolver(values: OptionValues, focused?: { name: string; value: string }, sub?: {
  group: string | null;
  name: string | null;
}) {
  const read = (name: string) => (name in values ? values[name] : null);
  return {
    getString: (name: string) => (typeof read(name) === "string" ? (read(name) as string) : null),
    getInteger: (name: string) => (typeof read(name) === "number" ? (read(name) as number) : null),
    getNumber: (name: string) => (typeof read(name) === "number" ? (read(name) as number) : null),
    getBoolean: (name: string) => (typeof read(name) === "boolean" ? (read(name) as boolean) : null),
    getUser: () => null,
    getChannel: () => null,
    getRole: () => null,
    getMentionable: () => null,
    getAttachment: () => null,
    getSubcommand: () => sub?.name ?? null,
    getSubcommandGroup: () => sub?.group ?? null,
    getFocused: (withName?: boolean) =>
      withName ? (focused ?? { name: "", value: "" }) : (focused?.value ?? ""),
  };
}

/** A fake chat-input command interaction plus a capture of its responses. */
export function fakeChatInput(opts: {
  commandName: string;
  options?: OptionValues;
  subcommand?: string;
  group?: string;
}): { interaction: ChatInputCommandInteraction; capture: Capture; client: Client } {
  const client = new EventEmitter();
  const capture = newCapture(client);
  const interaction = {
    client,
    commandName: opts.commandName,
    user: { id: "u1", tag: "user#0001" },
    member: null,
    guild: null,
    guildId: null,
    channel: null,
    channelId: null,
    locale: "en-US",
    replied: false,
    deferred: false,
    options: makeResolver(opts.options ?? {}, undefined, {
      group: opts.group ?? null,
      name: opts.subcommand ?? null,
    }),
    isChatInputCommand: () => true,
    isAutocomplete: () => false,
    reply(payload: unknown) {
      capture.replies.push(payload);
      this.replied = true;
      return Promise.resolve({});
    },
    editReply(payload: unknown) {
      capture.edits.push(payload);
      return Promise.resolve({});
    },
    followUp(payload: unknown) {
      capture.followUps.push(payload);
      return Promise.resolve({});
    },
    deferReply() {
      this.deferred = true;
      return Promise.resolve({});
    },
    showModal(modal: unknown) {
      capture.modals.push(modal);
      return Promise.resolve(undefined);
    },
  };
  return { interaction: interaction as unknown as ChatInputCommandInteraction, capture, client: client as unknown as Client };
}

/** A fake autocomplete interaction. */
export function fakeAutocomplete(opts: {
  commandName: string;
  focused: { name: string; value: string };
  subcommand?: string;
  group?: string;
}): { interaction: AutocompleteInteraction; capture: Capture } {
  const client = new EventEmitter();
  const capture = newCapture(client);
  const interaction = {
    client,
    commandName: opts.commandName,
    user: { id: "u1" },
    guild: null,
    guildId: null,
    responded: false,
    options: makeResolver({}, opts.focused, {
      group: opts.group ?? null,
      name: opts.subcommand ?? null,
    }),
    respond(choices: unknown[]) {
      capture.autocomplete.push(choices);
      this.responded = true;
      return Promise.resolve();
    },
  };
  return { interaction: interaction as unknown as AutocompleteInteraction, capture };
}

interface ComponentGuards {
  isButton: boolean;
  isStringSelectMenu: boolean;
  isModalSubmit: boolean;
}

function componentBase(customId: string, guards: ComponentGuards, capture: Capture, client: EventEmitter) {
  return {
    client,
    customId,
    user: { id: "u1" },
    member: null,
    guild: null,
    guildId: null,
    channel: null,
    channelId: null,
    locale: "en-US",
    message: { id: "m1" },
    replied: false,
    deferred: false,
    isButton: () => guards.isButton,
    isStringSelectMenu: () => guards.isStringSelectMenu,
    isUserSelectMenu: () => false,
    isRoleSelectMenu: () => false,
    isChannelSelectMenu: () => false,
    isMentionableSelectMenu: () => false,
    isModalSubmit: () => guards.isModalSubmit,
    reply(payload: unknown) {
      capture.replies.push(payload);
      this.replied = true;
      return Promise.resolve({});
    },
    update(payload: unknown) {
      capture.updates.push(payload);
      this.replied = true;
      return Promise.resolve({});
    },
    deferUpdate() {
      this.deferred = true;
      return Promise.resolve({});
    },
    editReply(payload: unknown) {
      capture.edits.push(payload);
      return Promise.resolve({});
    },
    followUp(payload: unknown) {
      capture.followUps.push(payload);
      return Promise.resolve({});
    },
    deferReply() {
      this.deferred = true;
      return Promise.resolve({});
    },
    showModal(modal: unknown) {
      capture.modals.push(modal);
      return Promise.resolve(undefined);
    },
  };
}

/** A fake button interaction. */
export function fakeButton(customId: string): { interaction: ButtonInteraction; capture: Capture } {
  const client = new EventEmitter();
  const capture = newCapture(client);
  const base = componentBase(customId, { isButton: true, isStringSelectMenu: false, isModalSubmit: false }, capture, client);
  return { interaction: base as unknown as ButtonInteraction, capture };
}

/** A fake string-select interaction carrying chosen values. */
export function fakeStringSelect(
  customId: string,
  values: string[],
): { interaction: StringSelectMenuInteraction; capture: Capture } {
  const client = new EventEmitter();
  const capture = newCapture(client);
  const base = {
    ...componentBase(customId, { isButton: false, isStringSelectMenu: true, isModalSubmit: false }, capture, client),
    values,
  };
  return { interaction: base as unknown as StringSelectMenuInteraction, capture };
}

/** Typed modal-field values beyond plain text inputs. */
export interface FakeModalData {
  selects?: Record<string, string[]>;
  users?: Record<string, string[]>;
  roles?: Record<string, string[]>;
  channels?: Record<string, string[]>;
  radio?: Record<string, string | null>;
  checkboxGroups?: Record<string, string[]>;
  checkboxes?: Record<string, boolean>;
  files?: Record<string, Record<string, unknown>[]>;
}

function idCollection(ids: string[]): { keys(): IterableIterator<string>; values(): IterableIterator<string> } {
  const set = new Set(ids);
  return set;
}

/** A fake modal-submit interaction carrying field values. */
export function fakeModalSubmit(
  customId: string,
  fields: Record<string, string>,
  data: FakeModalData = {},
): { interaction: ModalSubmitInteraction; capture: Capture } {
  const client = new EventEmitter();
  const capture = newCapture(client);
  const present = (record: Record<string, unknown> | undefined, key: string): boolean =>
    record !== undefined && Object.prototype.hasOwnProperty.call(record, key);
  const base = {
    ...componentBase(customId, { isButton: false, isStringSelectMenu: false, isModalSubmit: true }, capture, client),
    fields: {
      getTextInputValue: (key: string) => {
        if (key in fields) return fields[key];
        throw new Error(`no field ${key}`);
      },
      getStringSelectValues: (key: string) => {
        if (!present(data.selects, key)) throw new Error(`no field ${key}`);
        return data.selects![key]!;
      },
      getSelectedUsers: (key: string, required?: boolean) => {
        if (!present(data.users, key)) {
          if (required) throw new Error(`no field ${key}`);
          return null;
        }
        return idCollection(data.users![key]!);
      },
      getSelectedRoles: (key: string, required?: boolean) => {
        if (!present(data.roles, key)) {
          if (required) throw new Error(`no field ${key}`);
          return null;
        }
        return idCollection(data.roles![key]!);
      },
      getSelectedChannels: (key: string, required?: boolean) => {
        if (!present(data.channels, key)) {
          if (required) throw new Error(`no field ${key}`);
          return null;
        }
        return idCollection(data.channels![key]!);
      },
      getSelectedMentionables: (key: string, required?: boolean) => {
        const users = data.users?.[key];
        const roles = data.roles?.[key];
        if (users === undefined && roles === undefined) {
          if (required) throw new Error(`no field ${key}`);
          return null;
        }
        return {
          users: idCollection(users ?? []),
          roles: idCollection(roles ?? []),
          members: idCollection([]),
        };
      },
      getRadioGroup: (key: string, required?: boolean) => {
        const value = data.radio?.[key];
        if (value === undefined || value === null) {
          if (required) throw new Error(`no field ${key}`);
          return null;
        }
        return value;
      },
      getCheckboxGroup: (key: string) => {
        if (!present(data.checkboxGroups, key)) throw new Error(`no field ${key}`);
        return data.checkboxGroups![key]!;
      },
      getCheckbox: (key: string) => {
        if (!present(data.checkboxes, key)) throw new Error(`no field ${key}`);
        return data.checkboxes![key]!;
      },
      getUploadedFiles: (key: string, required?: boolean) => {
        const files = data.files?.[key];
        if (files === undefined) {
          if (required) throw new Error(`no field ${key}`);
          return null;
        }
        const collection = new Map<string, Record<string, unknown>>(files.map((f, i) => [`f${i}`, f]));
        return collection;
      },
    },
  };
  return { interaction: base as unknown as ModalSubmitInteraction, capture };
}
