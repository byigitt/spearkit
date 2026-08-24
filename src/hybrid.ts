/**
 * Hybrid commands — one definition, both surfaces.
 *
 * `hybridCommand({ options, args, run })` compiles to a slash command (typed
 * `options`) plus a prefix command (typed `args`) sharing one handler. The
 * handler receives a {@link HybridContext}: the common surface of both worlds
 * (`kind`, `options`, actor/location accessors, `reply`). Declare matching
 * names on both schemas and one `run` serves both — or branch on
 * `ctx.kind` for surface-specific behaviour.
 *
 * @example
 * ```ts
 * const ping = hybridCommand({
 *   name: "ping",
 *   description: "Check latency",
 *   options: { target: option.user({ description: "Who", required: true }) },
 *   args: (a) => a.snowflake("target"),
 *   run: (ctx) => ctx.reply(`pong ${ctx.options.target}`), // typed either way
 * });
 * client.register(ping); // registers slash + prefix
 * ```
 */
import type {
  ChatInputCommandInteraction,
  Client,
  Guild,
  GuildMember,
  InteractionReplyOptions,
  InteractionResponse,
  LocalizationMap,
  Message,
  MessageReplyOptions,
  PermissionResolvable,
  User,
  APIInteractionGuildMember,
} from "discord.js";
import type { Awaitable } from "discord.js";
import { command, SlashCommand } from "./commands/command.js";
import { CommandContext } from "./commands/context.js";
import type { OptionMap, ResolvedOptions } from "./commands/options.js";
import type { AutoDeferInput } from "./auto-defer.js";
import type { CooldownInput } from "./cooldown.js";
import type { Guard } from "./guards.js";
import { prefixCommand, PrefixCommand, PrefixContext } from "./prefix.js";
import type { PrefixArgsBuilder } from "./prefix-args.js";
import type { CommandScopeMeta } from "./scope.js";
import type { ReplyInput } from "./context.js";
import type { TranslationParams } from "./i18n.js";

/** Reply input accepted by {@link HybridContext.reply}. */
export type HybridReplyInput =
  | string
  | MessageReplyOptions
  | (InteractionReplyOptions & { ephemeral?: boolean });

function asSlashReply(input: Exclude<HybridReplyInput, string>): ReplyInput {
  return input as ReplyInput;
}

function asPrefixReply(input: Exclude<HybridReplyInput, string>): MessageReplyOptions {
  if ("ephemeral" in input) {
    const { ephemeral: _ephemeral, ...rest } = input;
    return rest as MessageReplyOptions;
  }
  return input as MessageReplyOptions;
}

/** The shared handler context for a hybrid command invocation. */
export interface HybridContext<TValues extends Record<string, unknown>> {
  /** Which surface triggered this run. */
  readonly kind: "slash" | "prefix";
  /** Resolved values: slash options on slash runs, parsed args on prefix runs. */
  readonly options: TValues;
  readonly client: Client;
  readonly user: User;
  readonly member: GuildMember | APIInteractionGuildMember | null;
  readonly guild: Guild | null;
  readonly guildId: string | null;
  readonly channel: HybridContextChannel;
  readonly channelId: string | null;
  /** The underlying interaction (slash) or message (prefix). */
  readonly raw: ChatInputCommandInteraction | Message;
  t(key: string, params?: TranslationParams): Promise<string>;
  reply(input: HybridReplyInput): Promise<InteractionResponse<boolean> | Message>;
}

/** Channel union across both surfaces (kept loose on purpose). */
type HybridContextChannel = Message["channel"] | ChatInputCommandInteraction["channel"];

class SlashHybridView<O extends OptionMap> implements HybridContext<ResolvedOptions<O>> {
  readonly kind = "slash" as const;

  constructor(private readonly ctx: CommandContext<O>) {}

  get options(): ResolvedOptions<O> {
    return this.ctx.options;
  }
  get client(): Client {
    return this.ctx.client;
  }
  get user(): User {
    return this.ctx.user;
  }
  get member() {
    return this.ctx.member;
  }
  get guild(): Guild | null {
    return this.ctx.guild;
  }
  get guildId(): string | null {
    return this.ctx.guildId;
  }
  get channel(): HybridContextChannel {
    return this.ctx.channel;
  }
  get channelId(): string | null {
    return this.ctx.channelId;
  }
  get raw(): ChatInputCommandInteraction {
    return this.ctx.interaction;
  }
  t(key: string, params?: TranslationParams): Promise<string> {
    return this.ctx.t(key, params);
  }
  reply(input: HybridReplyInput): Promise<InteractionResponse<boolean>> {
    return this.ctx.reply(typeof input === "string" ? input : asSlashReply(input));
  }
}

class PrefixHybridView<TArgs extends Record<string, unknown>> implements HybridContext<TArgs> {
  readonly kind = "prefix" as const;

  constructor(private readonly ctx: PrefixContext<TArgs>) {}

  get options(): TArgs {
    return this.ctx.options;
  }
  get client(): Client {
    return this.ctx.client;
  }
  get user(): User {
    return this.ctx.author;
  }
  get member() {
    return this.ctx.member;
  }
  get guild(): Guild | null {
    return this.ctx.guild;
  }
  get guildId(): string | null {
    return this.ctx.guildId;
  }
  get channel(): HybridContextChannel {
    return this.ctx.channel;
  }
  get channelId(): string {
    return this.ctx.channelId;
  }
  get raw(): Message {
    return this.ctx.message;
  }
  t(key: string, params?: TranslationParams): Promise<string> {
    return this.ctx.t(key, params);
  }
  reply(input: HybridReplyInput): Promise<Message> {
    return this.ctx.reply(typeof input === "string" ? input : asPrefixReply(input));
  }
}

/** Configuration for {@link hybridCommand}. */
export interface HybridCommandConfig<
  O extends OptionMap,
  TArgs extends Record<string, unknown>,
  R,
> extends CommandScopeMeta {
  name: string;
  description: string;
  /** Slash-side typed options. */
  options?: O;
  /** Prefix-side typed argument schema. */
  args?: (builder: PrefixArgsBuilder<{}>) => PrefixArgsBuilder<TArgs>;
  /** Alternative prefix names. */
  aliases?: readonly string[];
  defaultMemberPermissions?: PermissionResolvable | null;
  nsfw?: boolean;
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
  cooldown?: CooldownInput;
  guards?: readonly Guard[];
  autoDefer?: AutoDeferInput;
  run: (ctx: HybridContext<ResolvedOptions<O> | TArgs>) => Awaitable<R>;
}

/** A hybrid command: hand both parts to `client.register(...)` at once. */
export interface HybridCommand {
  readonly name: string;
  readonly slash: SlashCommand;
  readonly prefix: PrefixCommand;
}

/**
 * Define one command that works both as a slash command and as a prefix
 * command. `options` drive the slash payload, `args` drive the prefix parser;
 * `run` is shared and receives a {@link HybridContext}.
 */
export function hybridCommand<
  O extends OptionMap = Record<string, never>,
  TArgs extends Record<string, unknown> = Record<string, never>,
  R = void,
>(config: HybridCommandConfig<O, TArgs, R>): HybridCommand {
  const slash = command({
    name: config.name,
    description: config.description,
    options: config.options,
    defaultMemberPermissions: config.defaultMemberPermissions,
    nsfw: config.nsfw,
    install: config.install,
    contexts: config.contexts,
    guildOnly: config.guildOnly,
    nameLocalizations: config.nameLocalizations,
    descriptionLocalizations: config.descriptionLocalizations,
    cooldown: config.cooldown,
    guards: config.guards,
    autoDefer: config.autoDefer,
    run: async (ctx) => {
      await config.run(new SlashHybridView(ctx));
    },
  });

  const prefix = prefixCommand({
    name: config.name,
    aliases: config.aliases,
    description: config.description,
    cooldown: config.cooldown,
    guards: config.guards,
    args: config.args,
    run: async (ctx) => {
      await config.run(new PrefixHybridView(ctx));
    },
  });

  return { name: config.name, slash, prefix };
}
