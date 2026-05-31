/**
 * Graceful shutdown — close the bot cleanly on `SIGINT`/`SIGTERM`.
 *
 * A `Ctrl-C` or a container stop sends a signal; if you don't handle it the
 * process dies mid-flight, leaving the gateway connection, scheduler timers and
 * any open handles to be reaped abruptly. {@link gracefulShutdown} runs an
 * optional hook, calls `client.destroy()` (which also stops spearkit's
 * scheduler), and exits — with a hard timeout so a wedged shutdown can't hang
 * forever.
 *
 * @example
 * ```ts
 * gracefulShutdown(client, { onShutdown: () => db.close() });
 * // or, on a SpearClient:
 * client.enableGracefulShutdown({ onShutdown: () => db.close() });
 * ```
 */
import type { Awaitable } from "discord.js";

/** Anything with an async-or-sync `destroy()` — a discord.js `Client` qualifies. */
export interface Destroyable {
  destroy(): Awaitable<void>;
}

/** Minimal logger shape used for shutdown progress (your `client.logger` fits). */
export interface ShutdownLogger {
  info?(message: string): void;
  error?(message: string, meta?: unknown): void;
}

/** Options for {@link gracefulShutdown}. */
export interface GracefulShutdownOptions {
  /** Signals to listen for. Default `["SIGINT", "SIGTERM"]`. */
  signals?: readonly NodeJS.Signals[];
  /** Force-exit if shutdown takes longer than this many ms. Default `10000`. */
  timeoutMs?: number;
  /** Call `process.exit()` when done. Default `true`. Set `false` in tests. */
  exit?: boolean;
  /** Runs before `client.destroy()` — flush databases, close connections, etc. */
  onShutdown?: (signal: NodeJS.Signals) => Awaitable<void>;
  /** Optional progress logger. */
  logger?: ShutdownLogger;
}

/**
 * Wire signal handlers that gracefully tear `client` down once, then exit.
 * Returns a disposer that removes the handlers (handy for tests/hot-reload).
 */
export function gracefulShutdown(
  client: Destroyable,
  options: GracefulShutdownOptions = {},
): () => void {
  const signals = options.signals ?? (["SIGINT", "SIGTERM"] as const);
  const timeoutMs = options.timeoutMs ?? 10_000;
  const exit = options.exit ?? true;
  let shuttingDown = false;

  const handler = (signal: NodeJS.Signals): void => {
    if (shuttingDown) return;
    shuttingDown = true;
    options.logger?.info?.(`received ${signal}, shutting down`);
    const force = setTimeout(() => {
      options.logger?.error?.("shutdown timed out — forcing exit");
      if (exit) process.exit(1);
    }, timeoutMs);
    if (typeof force.unref === "function") force.unref();
    void (async () => {
      try {
        await options.onShutdown?.(signal);
        await client.destroy();
        clearTimeout(force);
        options.logger?.info?.("shutdown complete");
        if (exit) process.exit(0);
      } catch (error) {
        clearTimeout(force);
        options.logger?.error?.("shutdown failed", error);
        if (exit) process.exit(1);
      }
    })();
  };

  for (const signal of signals) process.on(signal, handler);
  return () => {
    for (const signal of signals) process.off(signal, handler);
  };
}
