import type { Awaitable, Client, ClientEvents } from "discord.js";

/** A typed handler for a discord.js client event. */
export type EventHandler<E extends keyof ClientEvents> = (
  ...args: ClientEvents[E]
) => Awaitable<void>;

/** Object form accepted by {@link event}. */
export interface EventConfig<E extends keyof ClientEvents> {
  name: E;
  /** Run the handler at most once, then auto-detach. */
  once?: boolean;
  run: EventHandler<E>;
}

/**
 * A type-erased, ready-to-attach event listener. Built by {@link event}; the
 * concrete event type is captured in the closures so binding stays type-safe.
 */
export interface EventDef {
  readonly name: keyof ClientEvents;
  readonly once: boolean;
  /** Attach the listener to a client. */
  attach(client: Client): void;
  /** Remove the listener from a client it was attached to. */
  detach(client: Client): void;
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

function build<E extends keyof ClientEvents>(name: E, once: boolean, run: EventHandler<E>): EventDef {
  const listeners = new WeakMap<Client, (...args: ClientEvents[E]) => void>();
  return {
    name,
    once,
    attach(client) {
      const listener = (...args: ClientEvents[E]): void => {
        try {
          const result = run(...args);
          if (result instanceof Promise) {
            result.catch((error: unknown) => client.emit("error", toError(error)));
          }
        } catch (error) {
          client.emit("error", toError(error));
        }
      };
      listeners.set(client, listener);
      if (once) client.once(name, listener);
      else client.on(name, listener);
    },
    detach(client) {
      const listener = listeners.get(client);
      if (listener !== undefined) {
        client.off(name, listener);
        listeners.delete(client);
      }
    },
  };
}

/**
 * Define a discord.js event listener with a fully-typed handler. Thrown errors
 * and rejected promises are routed to the client's `error` event instead of
 * crashing the process.
 *
 * @example
 * ```ts
 * export default event("messageCreate", (message) => {
 *   if (message.author.bot) return;
 *   // message is fully typed as Message
 * });
 * ```
 */
export function event<E extends keyof ClientEvents>(name: E, run: EventHandler<E>): EventDef;
export function event<E extends keyof ClientEvents>(config: EventConfig<E>): EventDef;
export function event<E extends keyof ClientEvents>(
  nameOrConfig: E | EventConfig<E>,
  run?: EventHandler<E>,
): EventDef {
  if (typeof nameOrConfig === "object") {
    return build(nameOrConfig.name, nameOrConfig.once ?? false, nameOrConfig.run);
  }
  if (run === undefined) {
    throw new Error("spear: event(name, run) requires a handler");
  }
  return build(nameOrConfig, false, run);
}

/** Holds event listeners and attaches them to clients in bulk. */
export class EventRegistry {
  private readonly events: EventDef[] = [];
  private readonly attached = new Set<Client>();

  /** Register one or more event definitions. */
  add(...defs: EventDef[]): this {
    this.events.push(...defs);
    for (const client of this.attached) {
      for (const def of defs) def.attach(client);
    }
    return this;
  }

  /** Number of registered listeners. */
  get size(): number {
    return this.events.length;
  }

  /** Attach every registered listener to the client. */
  attachAll(client: Client): void {
    this.attached.add(client);
    for (const def of this.events) def.attach(client);
  }

  /** Detach every registered listener from the client. */
  detachAll(client: Client): void {
    this.attached.delete(client);
    for (const def of this.events) def.detach(client);
  }
}
