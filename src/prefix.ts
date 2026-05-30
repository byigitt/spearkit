/**
 * Classic text/prefix commands (e.g. `!ping`) alongside slash commands.
 *
 * Reading other users' message content requires the privileged
 * `MessageContent` intent (use `Intents.messages`). The client listens on
 * `messageCreate`, matches a configured prefix (or a bot mention), parses the
 * command name + arguments and dispatches. Cooldowns are shared with slash
 * commands via the same {@link CooldownManager}.
 */
import type {
  Awaitable,
  Message,
  MessageCreateOptions,
  MessagePayload,
  MessageReplyOptions,
} from "discord.js";
import type { Logger } from "./logger.js";
import { toError } from "./logger.js";
import type { UsageEvent } from "./usage.js";
import { runGuards, type Guard, type GuardContext } from "./guards.js";
import { defaultEmbeds, type Embeds } from "./embeds.js";
import { PrefixArgsBuilder, prefixArgs, type PrefixArgsParser } from "./prefix-args.js";
import {
  formatCooldownMessage,
  normalizeCooldown,
  type CooldownActor,
  type CooldownConfig,
  type CooldownInput,
  type CooldownManager,
} from "./cooldown.js";

/** Options controlling how prefix messages are recognised. */
export interface PrefixOptions {
  /** One or more command prefixes (e.g. `"!"` or `["!", "?"]`). */
  prefix?: string | readonly string[];
  /** Also accept a leading bot mention as a prefix. Default `true`. */
  mention?: boolean;
  /** Ignore messages authored by bots. Default `true`. */
  ignoreBots?: boolean;
  /** Match command names case-insensitively. Default `true`. */
  caseInsensitive?: boolean;
}

/** Configuration for a prefix command. */
export interface PrefixCommandConfig<
  TArgs extends Record<string, unknown> = Record<string, never>,
  R = void,
> {
  /** Primary command name (the word after the prefix). */
  name: string;
  /** Alternative names that also trigger the command. */
  aliases?: readonly string[];
  /** Human description (for your own help command). */
  description?: string;
  /** Rate-limit this command. A number is a duration in ms. */
  cooldown?: CooldownInput;
  /** Preconditions evaluated before the handler runs. */
  guards?: readonly Guard[];
  /** Typed argument schema; `ctx.options` will be shaped from this. */
  args?: (builder: PrefixArgsBuilder<{}>) => PrefixArgsBuilder<TArgs>;
  /** Handler invoked with a {@link PrefixContext} typed by `args`. */
  run: (ctx: PrefixContext<TArgs>) => Awaitable<R>;
}

/** A registrable prefix command. Build it with {@link prefixCommand}. */
export interface PrefixCommand {
  readonly kind: "prefixCommand";
  readonly name: string;
  readonly aliases: readonly string[];
  readonly description?: string;
  readonly cooldown?: CooldownConfig;
  readonly guards?: readonly Guard[];
  readonly parser?: PrefixArgsParser<Record<string, unknown>>;
  readonly run: (ctx: PrefixContext) => Promise<void>;
}

/** Define a prefix command. */
export function prefixCommand<
  TArgs extends Record<string, unknown> = Record<string, never>,
  R = void,
>(config: PrefixCommandConfig<TArgs, R>): PrefixCommand {
  const parser =
    config.args !== undefined
      ? (config.args(prefixArgs()).compile() as PrefixArgsParser<Record<string, unknown>>)
      : undefined;
  return {
    kind: "prefixCommand",
    name: config.name,
    aliases: config.aliases ?? [],
    description: config.description,
    cooldown: config.cooldown !== undefined ? normalizeCooldown(config.cooldown) : undefined,
    guards: config.guards,
    parser,
    run: async (ctx) => {
      await config.run(ctx as PrefixContext<TArgs>);
    },
  };
}

/** The handler argument for a prefix command: the message plus parsed args. */
export class PrefixContext<
  TArgs extends Record<string, unknown> = Record<string, never>,
> {
  constructor(
    /** The triggering message. */
    readonly message: Message,
    /** The matched command name (as typed). */
    readonly commandName: string,
    /** Whitespace-split arguments after the command name. */
    readonly args: string[],
    /** The raw text after the command name. */
    readonly rest: string,
    /** Typed parsed arguments from `args` schema, or `{}` if none. */
    readonly options: TArgs = {} as TArgs,
  ) {}

  get client(): Message["client"] {
    return this.message.client;
  }
  get author() {
    return this.message.author;
  }
  get member() {
    return this.message.member;
  }
  get guild() {
    return this.message.guild;
  }
  get guildId(): string | null {
    return this.message.guildId;
  }
  get channel() {
    return this.message.channel;
  }
  get channelId(): string {
    return this.message.channelId;
  }

  /** Reply to the triggering message. */
  reply(content: string | MessagePayload | MessageReplyOptions): Promise<Message> {
    return this.message.reply(content);
  }

  /** Send a message to the same channel (no reply reference). */
  async send(content: string | MessagePayload | MessageCreateOptions): Promise<Message | undefined> {
    const channel = this.message.channel;
    if ("send" in channel) return channel.send(content);
    return undefined;
  }
}

/** Error hook invoked when a prefix command handler throws. */
export type PrefixErrorHandler = (error: Error, message: Message) => Awaitable<void>;

interface ResolvedPrefixOptions {
  prefixes: string[];
  mention: boolean;
  ignoreBots: boolean;
  caseInsensitive: boolean;
}

function resolveOptions(input: string | readonly string[] | PrefixOptions): ResolvedPrefixOptions {
  if (typeof input === "string") return { prefixes: [input], mention: true, ignoreBots: true, caseInsensitive: true };
  if (Array.isArray(input)) {
    return { prefixes: [...input], mention: true, ignoreBots: true, caseInsensitive: true };
  }
  const options = input as PrefixOptions;
  const prefix = options.prefix ?? [];
  return {
    prefixes: typeof prefix === "string" ? [prefix] : [...prefix],
    mention: options.mention ?? true,
    ignoreBots: options.ignoreBots ?? true,
    caseInsensitive: options.caseInsensitive ?? true,
  };
}

function actorFromMessage(message: Message): CooldownActor {
  const member = message.member;
  const roleIds = member !== null ? [...member.roles.cache.keys()] : [];
  return {
    userId: message.author.id,
    roleIds,
    guildId: message.guildId,
    channelId: message.channelId,
  };
}

/** Holds prefix commands and dispatches matching messages to them. */
export class PrefixRegistry {
  private readonly commands = new Map<string, PrefixCommand>();
  private readonly lookup = new Map<string, PrefixCommand>();
  private options: ResolvedPrefixOptions = {
    prefixes: [],
    mention: true,
    ignoreBots: true,
    caseInsensitive: true,
  };
  private logger?: Logger;
  private cooldowns?: CooldownManager;
  private defaultCooldown?: CooldownConfig;
  private errorHandler?: PrefixErrorHandler;
  private defaultGuards: readonly Guard[] = [];
  private onUsage?: (event: UsageEvent) => void;

  /** Configure prefixes and matching behaviour. */
  setOptions(input: string | readonly string[] | PrefixOptions): this {
    this.options = resolveOptions(input);
    return this;
  }

  /** Attach a logger for dispatch tracing and error reporting. */
  setLogger(logger: Logger): this {
    this.logger = logger;
    return this;
  }

  /** Attach a hook called after each successful prefix command run. */
  setUsageHook(hook: (event: UsageEvent) => void): this {
    this.onUsage = hook;
    return this;
  }

  /** Share a cooldown manager and an optional default cooldown. */
  setCooldowns(manager: CooldownManager, defaultCooldown?: CooldownConfig): this {
    this.cooldowns = manager;
    this.defaultCooldown = defaultCooldown;
    return this;
  }

  /** Guards that run before every prefix command's own guards. */
  setDefaultGuards(guards: readonly Guard[]): this {
    this.defaultGuards = guards;
    return this;
  }

  /** Set the handler used when a prefix command throws. */
  onError(handler: PrefixErrorHandler): this {
    this.errorHandler = handler;
    return this;
  }

  /** Register one or more prefix commands (and their aliases). */
  add(...commands: PrefixCommand[]): this {
    for (const command of commands) {
      this.commands.set(command.name, command);
      this.index(command.name, command);
      for (const alias of command.aliases) this.index(alias, command);
    }
    return this;
  }

  private index(key: string, command: PrefixCommand): void {
    this.lookup.set(this.options.caseInsensitive ? key.toLowerCase() : key, command);
  }

  /** Look up a command by name or alias. */
  get(nameOrAlias: string): PrefixCommand | undefined {
    return this.lookup.get(this.options.caseInsensitive ? nameOrAlias.toLowerCase() : nameOrAlias);
  }

  /** Number of registered commands (excluding aliases). */
  get size(): number {
    return this.commands.size;
  }

  /** Every registered command. */
  list(): PrefixCommand[] {
    return [...this.commands.values()];
  }

  /** Strip a matching prefix (or bot mention) from `content`, or return `null`. */
  private stripPrefix(content: string, botId: string | undefined): string | null {
    for (const prefix of this.options.prefixes) {
      if (prefix.length > 0 && content.startsWith(prefix)) return content.slice(prefix.length);
    }
    if (this.options.mention && botId !== undefined) {
      const match = /^<@!?(\d+)>\s*/.exec(content);
      if (match !== null && match[1] === botId) return content.slice(match[0].length);
    }
    return null;
  }

  /**
   * Parse and dispatch a message. Returns `true` when a command ran (or was
   * blocked by a cooldown), `false` when the message was not a prefix command.
   */
  async handle(message: Message): Promise<boolean> {
    if (this.options.prefixes.length === 0 && !this.options.mention) return false;
    if (this.options.ignoreBots && message.author.bot) return false;

    const stripped = this.stripPrefix(message.content, message.client.user?.id);
    if (stripped === null) return false;

    const trimmed = stripped.trimStart();
    const match = /^(\S+)\s*([\s\S]*)$/.exec(trimmed);
    if (match === null) return false;
    const name = match[1] ?? "";
    const rest = match[2] ?? "";
    const command = this.get(name);
    if (command === undefined) return false;

    this.logger?.debug("prefix", { data: { command: command.name, user: message.author.id } });

    const cooldown = command.cooldown ?? this.defaultCooldown;
    if (cooldown !== undefined && this.cooldowns !== undefined) {
      const result = this.cooldowns.consume(`prefix:${command.name}`, cooldown, actorFromMessage(message));
      if (!result.allowed) {
        await message.reply(formatCooldownMessage(cooldown, result.remaining)).catch(() => undefined);
        return true;
      }
    }
    const guards = combineGuards(this.defaultGuards, command.guards);
    if (guards.length > 0) {
      const guardCtx = guardContextFromMessage(message);
      const guardResult = await runGuards(guardCtx, guards);
      if (!guardResult.allowed) {
        this.logger?.debug("prefix denied", {
          data: {
            command: command.name,
            user: message.author.id,
            reason: guardResult.reason ?? "",
          },
        });
        await replyDeniedMessage(message, guardResult.reason);
        return true;
      }
    }

    const args = rest.length > 0 ? rest.split(/\s+/) : [];
    let options: Record<string, unknown> = {};
    if (command.parser !== undefined) {
      const parsed = command.parser.parse(args, rest);
      if (!parsed.ok) {
        this.logger?.debug("prefix arg error", {
          data: { command: command.name, user: message.author.id, arg: parsed.arg, reason: parsed.reason },
        });
        const embeds = clientEmbeds(message.client);
        await message.reply({ embeds: [embeds.error(`Argument \`${parsed.arg}\`: ${parsed.reason}`)] }).catch(() => undefined);
        return true;
      }
      options = parsed.values as Record<string, unknown>;
    }
    try {
      await command.run(new PrefixContext(message, name, args, rest, options) as PrefixContext);
      this.onUsage?.({
        type: "prefix",
        name: command.name,
        userId: message.author.id,
        userTag: message.author.tag,
        guildId: message.guildId,
        channelId: message.channelId,
        timestamp: new Date(),
      });
    } catch (error) {
      const err = toError(error);
      this.logger?.error(`prefix command "${command.name}" failed`, { error: err });
      if (this.errorHandler !== undefined) await this.errorHandler(err, message);
    }
    return true;
  }
}

function combineGuards(defaults: readonly Guard[], own: readonly Guard[] | undefined): readonly Guard[] {
  if (own === undefined || own.length === 0) return defaults;
  if (defaults.length === 0) return own;
  return [...defaults, ...own];
}

function guardContextFromMessage(message: Message): GuardContext {
  return {
    client: message.client,
    user: message.author,
    member: message.member,
    guild: message.guild,
    guildId: message.guildId,
    channelId: message.channelId,
  };
}

function clientEmbeds(client: { embeds?: Embeds } | unknown): Embeds {
  return ((client as { embeds?: Embeds }).embeds) ?? defaultEmbeds;
}

async function replyDeniedMessage(message: Message, reason: string | undefined): Promise<void> {
  const embeds = clientEmbeds(message.client);
  const text = reason ?? "You don't have permission to use this.";
  await message.reply({ embeds: [embeds.error(text)] }).catch(() => undefined);
}