/**
 * Usage tracking — record *who used what*. Two independent sinks:
 *
 * - a {@link UsageStore} (a database) that persists every use, and
 * - a Discord-channel reporter that posts a human-readable line per use.
 *
 * This is deliberately separate from the {@link Logger}: the logger is for
 * problems/diagnostics, this is an audit trail of command/component usage that
 * you can keep in a store and/or mirror into a channel.
 */
import { appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { Awaitable } from "discord.js";
import type { SpearClient } from "./client.js";
import type { Logger } from "./logger.js";
import { toError } from "./logger.js";

/** What kind of interaction was used. */
export type UsageType = "command" | "prefix" | "component" | "event";

/** Outcome of a tracked use — `"success"` if the handler returned without throwing. */
export type UsageOutcome = "success" | "error";

/** A primitive metadata value attached to a usage event. */
export type UsageMetaValue = string | number | boolean | null;

/** A single recorded use. */
export interface UsageEvent {
  readonly type: UsageType;
  /** Command/component name (or event name). */
  readonly name: string;
  readonly userId?: string;
  readonly userTag?: string;
  readonly guildId?: string | null;
  readonly channelId?: string | null;
  /** Free-form extra detail. */
  readonly detail?: string;
  readonly timestamp: Date;
  /** Outcome of the handler — `"success"` or `"error"`. */
  readonly outcome?: UsageOutcome;
  /** Wall-clock duration of the handler in milliseconds. */
  readonly durationMs?: number;
  /** Snapshot of the typed options the handler ran with. */
  readonly options?: Readonly<Record<string, UsageMetaValue>>;
  /** Error message if `outcome === "error"`. */
  readonly errorMessage?: string;
}

/** A pluggable persistence backend for {@link UsageEvent}s. */
export interface UsageStore {
  /** Persist one event. */
  record(event: UsageEvent): Awaitable<void>;
  /** Read every persisted event. */
  all(): Awaitable<readonly UsageEvent[]>;
}

/** In-memory store; great for tests and dashboards. Optionally capped. */
export class MemoryUsageStore implements UsageStore {
  private readonly events: UsageEvent[] = [];

  constructor(private readonly limit: number = Number.POSITIVE_INFINITY) {}

  record(event: UsageEvent): void {
    this.events.push(event);
    if (this.events.length > this.limit) this.events.splice(0, this.events.length - this.limit);
  }

  all(): readonly UsageEvent[] {
    return this.events;
  }

  /** Total recorded events. */
  get size(): number {
    return this.events.length;
  }

  /** Events recorded for a given user id. */
  byUser(userId: string): UsageEvent[] {
    return this.events.filter((event) => event.userId === userId);
  }

  /** Forget everything. */
  clear(): void {
    this.events.length = 0;
  }
}

interface SerializedEvent {
  type: UsageType;
  name: string;
  userId?: string;
  userTag?: string;
  guildId?: string | null;
  channelId?: string | null;
  detail?: string;
  timestamp: string;
}

/**
 * File-backed store using newline-delimited JSON (`.jsonl`). Appends one line
 * per event — durable, human-inspectable, and dependency-free.
 */
export class JsonFileUsageStore implements UsageStore {
  constructor(private readonly path: string) {}

  async record(event: UsageEvent): Promise<void> {
    const line = `${JSON.stringify({ ...event, timestamp: event.timestamp.toISOString() })}\n`;
    await mkdir(dirname(this.path), { recursive: true });
    await appendFile(this.path, line, "utf8");
  }

  async all(): Promise<readonly UsageEvent[]> {
    let content: string;
    try {
      content = await readFile(this.path, "utf8");
    } catch {
      return [];
    }
    const events: UsageEvent[] = [];
    for (const line of content.split("\n")) {
      if (line.trim().length === 0) continue;
      const parsed = JSON.parse(line) as SerializedEvent;
      events.push({ ...parsed, timestamp: new Date(parsed.timestamp) });
    }
    return events;
  }
}

/** Default one-line rendering of a usage event for a Discord channel. */
export function formatUsage(event: UsageEvent): string {
  const who = event.userTag ?? (event.userId !== undefined ? `<@${event.userId}>` : "unknown");
  const where =
    event.channelId !== undefined && event.channelId !== null ? ` in <#${event.channelId}>` : "";
  const detail = event.detail !== undefined ? ` — ${event.detail}` : "";
  return `\`${event.type}\` **${event.name}** by ${who}${where}${detail}`;
}

/** Client-level usage configuration (the `usage` option). */
export interface UsageOptions {
  /** Persist events to this store (a database). */
  store?: UsageStore;
  /** Mirror events into this Discord channel id. */
  channel?: string;
  /** Custom channel-line formatter. */
  format?: (event: UsageEvent) => string;
}
interface Reporter {
  channelId: string;
  format: (event: UsageEvent) => string;
}

/**
 * Routes each {@link UsageEvent} to a store and/or a Discord channel. The
 * client owns one as `client.usage`. Tracking is fire-and-forget: a slow store
 * or channel never blocks command handling, and failures are logged.
 */
export class UsageTracker {
  /** The configured store, if any. Directly queryable. */
  store?: UsageStore;
  private reporter?: Reporter;
  private client?: SpearClient;
  private logger?: Logger;

  /** Whether anything will happen on {@link track}. */
  get enabled(): boolean {
    return this.store !== undefined || this.reporter !== undefined;
  }

  /** @internal Used by the client to resolve report channels. */
  setClient(client: SpearClient): this {
    this.client = client;
    return this;
  }

  setLogger(logger: Logger): this {
    this.logger = logger;
    return this;
  }

  /** Persist events to a store (a database). */
  setStore(store: UsageStore): this {
    this.store = store;
    return this;
  }

  /** Mirror events into a Discord channel. */
  reportTo(channelId: string, format: (event: UsageEvent) => string = formatUsage): this {
    this.reporter = { channelId, format };
    return this;
  }

  /** Record a use. Returns immediately; storing/reporting happen in the background. */
  track(event: UsageEvent): void {
    if (!this.enabled) return;
    void this.run(event);
  }

  private async run(event: UsageEvent): Promise<void> {
    if (this.store !== undefined) {
      try {
        await this.store.record(event);
      } catch (error) {
        this.logger?.error("usage store failed", { error: toError(error) });
      }
    }
    if (this.reporter !== undefined && this.client !== undefined) {
      try {
        const cache = this.client.channels.cache.get(this.reporter.channelId);
        const channel = cache ?? (await this.client.channels.fetch(this.reporter.channelId));
        if (channel !== null && "send" in channel) {
          await channel.send(this.reporter.format(event));
        }
      } catch (error) {
        this.logger?.error("usage report failed", { error: toError(error) });
      }
    }
  }
}
