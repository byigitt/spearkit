import type { Awaitable } from "discord.js";
import type { SpearClient } from "./client.js";

/**
 * A spear plugin: a named, reusable bundle of commands, events and components.
 * Its {@link setup} runs once when added to a client via `client.use(plugin)`.
 */
export interface SpearPlugin {
  readonly name: string;
  setup(client: SpearClient): Awaitable<void>;
}

/** Identity helper that gives a plugin object its type and editor hints. */
export function definePlugin(plugin: SpearPlugin): SpearPlugin {
  return plugin;
}
