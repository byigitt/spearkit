/**
 * spearkit — discord.js++
 *
 * A developer-experience-first layer over discord.js. Everything discord.js
 * exports is re-exported here, so `spearkit` is a drop-in replacement; the spearkit
 * additions (commands, events, components, client) sit alongside it.
 */

// Drop-in: re-export the entire discord.js surface.
export * from "discord.js";

// --- spearkit additions -------------------------------------------------------
export * from "./embeds.js";
export * from "./lock.js";
export * from "./safe-fetch.js";
export * from "./format.js";
export * from "./cache.js";
export * from "./config.js";
export * from "./guards.js";
export * from "./context-menus.js";
export * from "./prefix-args.js";
export * from "./pagination.js";
export * from "./logger.js";
export * from "./env.js";
export * from "./cooldown.js";
export * from "./scheduler.js";
export * from "./prefix.js";
export * from "./usage.js";
export * from "./context.js";
export * from "./commands/options.js";
export * from "./commands/command.js";
export * from "./commands/context.js";
export * from "./commands/registry.js";
export * from "./events.js";
export * from "./components/index.js";
export * from "./client.js";
export * from "./plugin.js";
export * from "./loader.js";
