/**
 * A small, dependency-free structured logger used across spearkit so every
 * problem (command/component/event failures, gateway errors, your own code)
 * lands in one consistent, debuggable place.
 *
 * It is intentionally tiny: levels, scopes, structured data and a pluggable
 * sink. No `any`/`unknown` leaks into your code — log metadata is constrained
 * to primitive {@link LogValue}s and an optional {@link Error}.
 */

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
  /** Where entries go. Default {@link consoleSink}. */
  sink?: LogSink;
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

interface SharedState {
  threshold: LogThreshold;
  sink: LogSink;
}

/**
 * A leveled, scoped logger. Create one directly or read `client.logger`.
 * {@link child} loggers share the parent's threshold and sink, so calling
 * {@link setLevel} on any of them affects the whole tree.
 *
 * @example
 * ```ts
 * const log = new Logger({ level: "debug" });
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
      sink: options.sink ?? consoleSink,
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
    this.state.sink({
      level,
      message,
      scope: this.scope,
      timestamp: new Date(),
      error: options?.error,
      data: options?.data,
    });
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
