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

/** Optional bulk-write extension used by {@link BufferedUsageStore}. */
export interface BatchUsageStore extends UsageStore {
  /** Persist several events in one database/file round-trip. */
  recordMany(events: readonly UsageEvent[]): Awaitable<void>;
}

/** Options for {@link BufferedUsageStore}. */
export interface BufferedUsageStoreOptions {
  /** Events per downstream write. Default 100. */
  batchSize?: number;
  /** Periodic flush interval. Default 1000ms; `0` disables. */
  flushIntervalMs?: number;
  /** Hard in-memory bound. Default 10,000. Oldest events drop first. */
  maxBuffered?: number;
  /** Observe dropped telemetry events. */
  onDrop?: (count: number) => void;
  /** Observe background flush errors. */
  onError?: (error: unknown) => void;
}

/**
 * Bounded, batched wrapper for high-volume usage telemetry.
 *
 * Handler dispatch remains fire-and-forget, but one event no longer means one
 * database/file call. Downstreams implementing {@link BatchUsageStore} receive
 * real bulk writes; other stores are written sequentially inside each batch.
 */
export class BufferedUsageStore implements UsageStore {
  private readonly batchSize: number;
  private readonly maxBuffered: number;
  private readonly buffer: UsageEvent[] = [];
  private readonly timer?: ReturnType<typeof setInterval>;
  private flushChain: Promise<void> = Promise.resolve();
  private droppedCount = 0;

  constructor(
    private readonly downstream: UsageStore,
    private readonly options: BufferedUsageStoreOptions = {},
  ) {
    this.batchSize = options.batchSize ?? 100;
    this.maxBuffered = options.maxBuffered ?? 10_000;
    if (!Number.isInteger(this.batchSize) || this.batchSize <= 0) {
      throw new RangeError(
        "spearkit: BufferedUsageStore batchSize must be a positive integer",
      );
    }
    if (!Number.isInteger(this.maxBuffered) || this.maxBuffered <= 0) {
      throw new RangeError(
        "spearkit: BufferedUsageStore maxBuffered must be a positive integer",
      );
    }
    const interval = options.flushIntervalMs ?? 1000;
    if (interval > 0) {
      this.timer = setInterval(() => {
        void this.flush().catch((error) => options.onError?.(error));
      }, interval);
      this.timer.unref?.();
    }
  }

  /** Events waiting for a downstream write. */
  get size(): number {
    return this.buffer.length;
  }

  /** Total events discarded because the buffer hit `maxBuffered`. */
  get dropped(): number {
    return this.droppedCount;
  }

  record(event: UsageEvent): void {
    if (this.buffer.length >= this.maxBuffered) {
      this.buffer.shift();
      this.droppedCount += 1;
      this.options.onDrop?.(this.droppedCount);
    }
    this.buffer.push(event);
    if (this.buffer.length >= this.batchSize) {
      void this.flush().catch((error) => this.options.onError?.(error));
    }
  }

  async all(): Promise<readonly UsageEvent[]> {
    await this.flush();
    return this.downstream.all();
  }

  /** Drain all currently buffered events through serialized batches. */
  flush(): Promise<void> {
    this.flushChain = this.flushChain.catch(() => undefined).then(async () => {
      while (this.buffer.length > 0) {
        const batch = this.buffer.splice(0, this.batchSize);
        if ("recordMany" in this.downstream) {
          await (this.downstream as BatchUsageStore).recordMany(batch);
        } else {
          for (const event of batch) await this.downstream.record(event);
        }
      }
    });
    return this.flushChain;
  }

  /** Stop the timer and flush remaining events. */
  async close(): Promise<void> {
    if (this.timer !== undefined) clearInterval(this.timer);
    await this.flush();
  }
}

/** In-memory store; great for tests and dashboards. Optionally capped. */
export class MemoryUsageStore implements BatchUsageStore {
  private readonly events: UsageEvent[] = [];

  constructor(private readonly limit: number = Number.POSITIVE_INFINITY) {}

  record(event: UsageEvent): void {
    this.events.push(event);
    if (this.events.length > this.limit) this.events.splice(0, this.events.length - this.limit);
  }

  recordMany(events: readonly UsageEvent[]): void {
    for (const event of events) this.record(event);
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
export class JsonFileUsageStore implements BatchUsageStore {
  constructor(private readonly path: string) {}

  async record(event: UsageEvent): Promise<void> {
    await this.recordMany([event]);
  }

  async recordMany(events: readonly UsageEvent[]): Promise<void> {
    if (events.length === 0) return;
    const lines = events
      .map(
        (event) =>
          JSON.stringify({
            ...event,
            timestamp: event.timestamp.toISOString(),
          }),
      )
      .join("\n");
    await mkdir(dirname(this.path), { recursive: true });
    await appendFile(this.path, `${lines}\n`, "utf8");
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
