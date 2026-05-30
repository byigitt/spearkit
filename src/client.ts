import {
  Client,
  GatewayIntentBits,
  type ClientOptions,
  type Interaction,
} from "discord.js";
import { SlashCommand } from "./commands/command.js";
import { CommandRegistry, type DeployResult } from "./commands/registry.js";
import { EventRegistry, type EventDef } from "./events.js";
import { ComponentRegistry, type ComponentDef } from "./components/registry.js";
import type { SpearPlugin } from "./plugin.js";
import { loadInto, type LoadOptions } from "./loader.js";
import { Logger, type LoggerOptions, toError } from "./logger.js";
import { loadEnv, type LoadEnvOptions } from "./env.js";
import { CooldownManager, normalizeCooldown, type CooldownInput } from "./cooldown.js";
import { TaskScheduler, task, type ScheduledTask, type TaskConfig } from "./scheduler.js";
import { PrefixRegistry, type PrefixCommand, type PrefixOptions } from "./prefix.js";
import { UsageTracker, type UsageEvent, type UsageOptions } from "./usage.js";

/** Anything that can be handed to {@link SpearClient.register}. */
export type Registerable = SlashCommand | EventDef | ComponentDef | ScheduledTask | PrefixCommand;

const allIntents = Object.values(GatewayIntentBits).filter(
  (value): value is GatewayIntentBits => typeof value === "number",
);

/**
 * Ready-made intent presets. Pass one to {@link SpearClient} as `intents`.
 * `all` includes privileged intents — enable them in the developer portal.
 */
export const Intents = {
  /** No intents. */
  none: [] as GatewayIntentBits[],
  /** Just `Guilds` — enough for slash commands and interactions. */
  default: [GatewayIntentBits.Guilds],
  /** Guild + member gateway data. */
  guilds: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  /** Read message content (privileged) alongside guild messages. */
  messages: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  /** Every intent, including privileged ones. */
  all: allIntents,
} as const;

/** spearkit-specific client options layered on top of discord.js {@link ClientOptions}. */
export interface SpearOptions {
  /** A {@link Logger} instance, or options to build one. Exposed as `client.logger`. */
  logger?: Logger | LoggerOptions;
  /**
   * Auto-load a `.env` file into `process.env` on {@link SpearClient.start}.
   * `true` (default) loads `.env` from the cwd; pass {@link LoadEnvOptions} for
   * a custom path or override behaviour, or `false` to disable.
   */
  dotenv?: boolean | LoadEnvOptions;
  /** A default cooldown applied to every command. A command's own cooldown overrides it. */
  cooldown?: CooldownInput;
  /** Enable prefix (text) commands. A string/array sets prefixes; an object configures matching. */
  prefix?: string | readonly string[] | PrefixOptions;
  /** Track command/component/prefix usage to a store and/or a Discord channel. */
  usage?: UsageOptions;
}

/** Options for {@link SpearClient}: discord.js options plus {@link SpearOptions}. `intents` may be omitted. */
export type SpearClientOptions = Partial<ClientOptions> & SpearOptions;

/**
 * A discord.js {@link Client} with batteries included: command, event and
 * component registries plus interaction routing wired up automatically.
 *
 * @example
 * ```ts
 * const client = new SpearClient({ intents: Intents.default });
 * client.register(ping, onReady, voteButton);
 * await client.start(process.env.TOKEN);
 * await client.deployCommands({ guildId: "123" });
 * ```
 */
export class SpearClient extends Client {
  /** Slash command registry and dispatcher. */
  readonly commands = new CommandRegistry();
  /** Event listener registry. */
  readonly events = new EventRegistry();
  /** Button / select / modal registry and router. */
  readonly components = new ComponentRegistry();
  /** Structured logger shared across spearkit and available to your code. */
  readonly logger: Logger;
  /** Shared cooldown manager used by command dispatch; also usable directly. */
  readonly cooldowns = new CooldownManager();
  /** Cron/interval task scheduler; started on ready and stopped on destroy. */
  readonly scheduler = new TaskScheduler();
  /** Prefix (text) command registry, dispatched from `messageCreate`. */
  readonly prefix = new PrefixRegistry();
  /** Usage tracker: records who used what to a store and/or a Discord channel. */
  readonly usage = new UsageTracker();
  private readonly envConfig: false | LoadEnvOptions;

  constructor(options: SpearClientOptions = {}) {
    const { intents, logger, dotenv, cooldown, prefix, usage, ...rest } = options;
    super({ ...rest, intents: intents ?? Intents.default });
    this.envConfig = dotenv === false ? false : dotenv === undefined || dotenv === true ? {} : dotenv;
    this.logger = logger instanceof Logger ? logger : new Logger(logger);
    this.commands.setLogger(this.logger.child("commands"));
    const defaultCooldown = cooldown !== undefined ? normalizeCooldown(cooldown) : undefined;
    this.commands.setCooldowns(this.cooldowns, defaultCooldown);
    this.components.setLogger(this.logger.child("components"));
    this.events.attachAll(this);
    this.on("interactionCreate", (interaction) => this.route(interaction));
    this.on("error", (error) => this.logger.error("client error", { error: toError(error) }));
    this.scheduler.setLogger(this.logger.child("scheduler"));
    this.once("clientReady", () => this.scheduler.start(this));
    this.prefix.setLogger(this.logger.child("prefix"));
    this.prefix.setCooldowns(this.cooldowns, defaultCooldown);
    if (prefix !== undefined) this.prefix.setOptions(prefix);
    this.on("messageCreate", (message) => {
      void this.prefix.handle(message);
    });
    this.usage.setClient(this).setLogger(this.logger.child("usage"));
    if (usage !== undefined) {
      if (usage.store !== undefined) this.usage.setStore(usage.store);
      if (usage.channel !== undefined) this.usage.reportTo(usage.channel, usage.format);
      const onUsage = (event: UsageEvent): void => this.usage.track(event);
      this.commands.setUsageHook(onUsage);
      this.components.setUsageHook(onUsage);
      this.prefix.setUsageHook(onUsage);
    }
  }

  /**
   * Register commands, events and components in one call. Each item is routed
   * to the matching registry based on its kind.
   */
  register(...items: Registerable[]): this {
    for (const item of items) {
      if (item instanceof SlashCommand) {
        this.commands.add(item);
      } else if ("attach" in item) {
        this.events.add(item);
      } else if (item.kind === "task") {
        this.scheduler.add(item);
      } else if (item.kind === "prefixCommand") {
        this.prefix.add(item);
      } else {
        this.components.add(item);
      }
    }
    return this;
  }

  /** Install one or more plugins, running each plugin's `setup`. */
  async use(...plugins: SpearPlugin[]): Promise<this> {
    for (const plugin of plugins) {
      await plugin.setup(this);
    }
    return this;
  }

  /**
   * Recursively load a directory and register every command, event and
   * component it exports. Returns the number of items registered.
   */
  load(dir: string, options?: LoadOptions): Promise<number> {
    return loadInto(this, dir, options);
  }

  /**
   * Log in. Falls back to the `DISCORD_TOKEN` environment variable when no
   * token is passed.
   */
  async start(token?: string): Promise<this> {
    if (this.envConfig !== false) loadEnv(this.envConfig);
    const resolved = token ?? process.env.DISCORD_TOKEN;
    if (resolved === undefined || resolved.length === 0) {
      throw new Error("spearkit: start() needs a token (pass one or set DISCORD_TOKEN)");
    }
    await this.login(resolved);
    return this;
  }

  /**
   * Push the registered slash commands to discord using the client's own
   * authenticated REST connection. Call after the client is ready.
   */
  async deployCommands(options: { guildId?: string } = {}): Promise<DeployResult> {
    const applicationId = this.application?.id ?? this.user?.id;
    if (applicationId == null) {
      throw new Error("spearkit: deployCommands() must run after the client is ready");
    }
    return this.commands.deploy({ rest: this.rest, applicationId, guildId: options.guildId });
  }

  private async route(interaction: Interaction): Promise<void> {
    if (interaction.isChatInputCommand()) {
      await this.commands.handle(interaction);
    } else if (interaction.isAutocomplete()) {
      await this.commands.handleAutocomplete(interaction);
    } else {
      await this.components.handle(interaction);
    }
  }

  /** Define and register a scheduled task in one call. */
  schedule(config: TaskConfig): ScheduledTask {
    const scheduled = task(config);
    this.scheduler.add(scheduled);
    return scheduled;
  }

  /** Stop the scheduler, then tear down the discord.js client. */
  override async destroy(): Promise<void> {
    this.scheduler.stop();
    await super.destroy();
  }
}
