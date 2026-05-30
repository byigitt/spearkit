/**
 * spear — discord.js++
 *
 * A developer-experience-first layer over discord.js. Everything discord.js
 * exports is re-exported here, so `spear` is a drop-in replacement; the spear
 * additions (commands, events, components, client) sit alongside it.
 */

// Drop-in: re-export the entire discord.js surface.
export * from "discord.js";

// --- spear additions -------------------------------------------------------
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
