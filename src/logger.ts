/**
 * A small, dependency-free structured logger used across spearkit so every
 * problem (command/component/event failures, gateway errors, your own code)
 * lands in one consistent, debuggable place.
 *
 * Pluggable transports — the default writes to the console, but you can also
 * stream to a JSONL file ({@link jsonlSink}), POST high-severity entries to a
 * Discord webhook ({@link webhookSink}), or write your own. Setting
 * `transports: [...]` replaces the default; otherwise pass a single `sink`.
 */
import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

/** Severity of a log entry, lowest to highest. */
export type LogLevel = "debug" | "info" | "warn" | "error";

/** A minimum severity to emit, or `"silent"` to suppress everything. */
export type LogThreshold = LogLevel | "silent";

/** A primitive metadata value attached to a log entry. */
export type LogValue = string | number | boolean | bigint | null | undefined;

/** Extra context passed alongside a log message. */
export interface LogOptions {
  /** An error to attach; the default sink renders its stack. */
  error?: Error;
  /** Structured key/value metadata. */
  data?: Record<string, LogValue>;
}

/** A fully-resolved record handed to a {@link LogSink}. */
export interface LogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly scope?: string;
  readonly timestamp: Date;
  readonly error?: Error;
  readonly data?: Readonly<Record<string, LogValue>>;
}

/** Receives every entry at or above the configured threshold. */
export type LogSink = (entry: LogEntry) => void;

/** Construction options for a {@link Logger}. */
export interface LoggerOptions {
  /** Minimum level to emit. Default `"info"`. */
  level?: LogThreshold;
  /** Single transport — shorthand for `transports: [sink]`. */
  sink?: LogSink;
  /** Multiple transports. If set, takes precedence over `sink`. */
  transports?: readonly LogSink[];
  /** A scope prefix for every entry (e.g. `"commands"`). */
  scope?: string;
}

const RANK: Record<LogThreshold, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: Number.POSITIVE_INFINITY,
};

function formatValue(value: LogValue): string {
  return typeof value === "string" ? value : String(value);
}

/** Default sink: human-readable lines to the console (stderr for warn/error). */
export function consoleSink(entry: LogEntry): void {
  const scope = entry.scope !== undefined ? ` [${entry.scope}]` : "";
  let suffix = "";
  if (entry.data !== undefined) {
    const parts = Object.entries(entry.data).map(([k, v]) => `${k}=${formatValue(v)}`);
    if (parts.length > 0) suffix = ` ${parts.join(" ")}`;
  }
  const line = `${entry.timestamp.toISOString()} ${entry.level.toUpperCase()}${scope} ${entry.message}${suffix}`;
  const write = entry.level === "warn" || entry.level === "error" ? console.error : console.log;
  write(line);
  if (entry.error !== undefined) write(entry.error.stack ?? String(entry.error));
}

/**
 * JSON-lines sink: appends one JSON object per entry to `path`. Fire-and-forget;
 * filesystem errors are swallowed so logging never crashes the bot.
 */
export function jsonlSink(path: string, options: { minLevel?: LogLevel } = {}): LogSink {
  const min = options.minLevel ?? "debug";
  let dirReady = false;
  let chain: Promise<void> = Promise.resolve();
  return (entry) => {
    if (RANK[entry.level] < RANK[min]) return;
    const record = {
      ...entry,
      timestamp: entry.timestamp.toISOString(),
      error: entry.error
        ? { name: entry.error.name, message: entry.error.message, stack: entry.error.stack }
        : undefined,
    };
    const line = `${JSON.stringify(record)}\n`;
    chain = chain.then(async () => {
      try {
        if (!dirReady) {
          await mkdir(dirname(path), { recursive: true });
          dirReady = true;
        }
        await appendFile(path, line, "utf8");
      } catch {
        // Swallow — log file unwritable shouldn't kill the bot.
      }
    });
  };
}


/**
 * Discord-webhook sink: POSTs an embed to a webhook URL for entries at or
 * above `minLevel` (default `"warn"`). Useful for sending errors to a private
 * `#bot-errors` channel.
 */
export function webhookSink(options: { url: string; minLevel?: LogLevel; username?: string }): LogSink {
  const min = options.minLevel ?? "warn";
  return (entry) => {
    if (RANK[entry.level] < RANK[min]) return;
    const color = entry.level === "error" ? 0xf04a47 : entry.level === "warn" ? 0xf9a825 : 0x3498db;
    const fields: { name: string; value: string; inline?: boolean }[] = [];
    if (entry.scope !== undefined) fields.push({ name: "Scope", value: entry.scope, inline: true });
    if (entry.data !== undefined) {
      for (const [k, v] of Object.entries(entry.data)) {
        fields.push({ name: k, value: formatValue(v).slice(0, 1000), inline: true });
      }
    }
    const desc = entry.error?.stack !== undefined
      ? `${entry.message}\n\`\`\`\n${entry.error.stack.slice(0, 1800)}\n\`\`\``
      : entry.message;
    const body = {
      username: options.username ?? "spearkit",
      embeds: [
        {
          title: `[${entry.level.toUpperCase()}] ${entry.message.slice(0, 240)}`,
          description: desc.slice(0, 4000),
          color,
          timestamp: entry.timestamp.toISOString(),
          fields: fields.slice(0, 25),
        },
      ],
    };
    void fetch(options.url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => undefined);
  };
}

interface SharedState {
  threshold: LogThreshold;
  transports: readonly LogSink[];
}

function resolveTransports(options: LoggerOptions): readonly LogSink[] {
  if (options.transports !== undefined && options.transports.length > 0) return options.transports;
  if (options.sink !== undefined) return [options.sink];
  return [consoleSink];
}

/**
 * A leveled, scoped logger. Create one directly or read `client.logger`.
 * {@link child} loggers share the parent's threshold and transports, so calling
 * {@link setLevel} on any of them affects the whole tree.
 *
 * @example
 * ```ts
 * const log = new Logger({ level: "debug", transports: [consoleSink, jsonlSink("./logs/bot.jsonl")] });
 * log.info("ready", { data: { shard: 0 } });
 * log.child("commands").error("handler failed", { error });
 * ```
 */
export class Logger {
  private state: SharedState;
  /** The scope prefix applied to every entry, if any. */
  readonly scope?: string;

  constructor(options: LoggerOptions = {}) {
    this.state = {
      threshold: options.level ?? "info",
      transports: resolveTransports(options),
    };
    this.scope = options.scope;
  }

  /** The current minimum threshold. */
  get level(): LogThreshold {
    return this.state.threshold;
  }

  /** Change the threshold for this logger and every child sharing its state. */
  setLevel(level: LogThreshold): this {
    this.state.threshold = level;
    return this;
  }

  /** Replace the transport list for this logger and every child sharing its state. */
  setTransports(transports: readonly LogSink[]): this {
    this.state.transports = transports;
    return this;
  }

  /** Append a transport to the existing list. */
  addTransport(sink: LogSink): this {
    this.state.transports = [...this.state.transports, sink];
    return this;
  }

  /** Whether an entry of `level` would currently be emitted. */
  enabled(level: LogLevel): boolean {
    return RANK[level] >= RANK[this.state.threshold];
  }

  /** A child logger with an extra scope segment, sharing this logger's state. */
  child(scope: string): Logger {
    const combined = this.scope !== undefined ? `${this.scope}:${scope}` : scope;
    const child = new Logger({ scope: combined });
    child.state = this.state;
    return child;
  }

  /** Emit an entry at an explicit level. */
  log(level: LogLevel, message: string, options?: LogOptions): void {
    if (!this.enabled(level)) return;
    const entry: LogEntry = {
      level,
      message,
      scope: this.scope,
      timestamp: new Date(),
      error: options?.error,
      data: options?.data,
    };
    for (const sink of this.state.transports) {
      try {
        sink(entry);
      } catch {
        // Never let a broken transport kill the dispatcher.
      }
    }
  }

  /** Verbose diagnostics, off by default. */
  debug(message: string, options?: LogOptions): void {
    this.log("debug", message, options);
  }

  /** Normal operational messages. */
  info(message: string, options?: LogOptions): void {
    this.log("info", message, options);
  }

  /** Recoverable problems worth attention. */
  warn(message: string, options?: LogOptions): void {
    this.log("warn", message, options);
  }

  /** Failures. Attach the cause via `{ error }`. */
  error(message: string, options?: LogOptions): void {
    this.log("error", message, options);
  }
}

/** Coerce an unknown thrown value into an {@link Error}. */
export function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}
