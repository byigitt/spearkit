/**
 * Auto-defer — the antidote to `DiscordAPIError[10062]: Unknown interaction`.
 *
 * An interaction token is only valid for 3 seconds before the *first* response.
 * Any handler that awaits a database query, an HTTP call, or anything else slow
 * blows past that window and the interaction dies. The fix is always the same:
 * `deferReply()` early. Auto-defer does it for you — it arms a timer when the
 * handler starts and, if the handler hasn't responded in time, defers
 * automatically. Cancelled the instant your handler replies/defers itself.
 *
 * Enable per command (`command({ autoDefer: true })`) or globally
 * (`new SpearClient({ autoDefer: true })`). With it on, respond via
 * `ctx.send(...)` / `ctx.editReply(...)` rather than `ctx.reply(...)`, since the
 * reply slot may already be taken by the auto-defer.
 */
import {
  MessageFlags,
  type ChatInputCommandInteraction,
  type MessageContextMenuCommandInteraction,
  type UserContextMenuCommandInteraction,
} from "discord.js";

/** How a handler opts into auto-defer: `true` for defaults, or fine-tuning. */
export type AutoDeferInput = boolean | { ephemeral?: boolean; delayMs?: number };

/** Resolved auto-defer settings. */
export interface AutoDeferConfig {
  /** Defer as an ephemeral ("thinking…" hidden) response. */
  ephemeral: boolean;
  /** Delay before the safety defer fires, in ms. Kept under Discord's 3s window. */
  delayMs: number;
}

/** Default safety margin: defer at 2s, leaving headroom before the 3s cutoff. */
export const DEFAULT_AUTO_DEFER_DELAY_MS = 2000;

/** Normalise an {@link AutoDeferInput} (or `undefined`) into a config, or `undefined` when disabled. */
export function normalizeAutoDefer(input: AutoDeferInput | undefined): AutoDeferConfig | undefined {
  if (input === undefined || input === false) return undefined;
  if (input === true) return { ephemeral: false, delayMs: DEFAULT_AUTO_DEFER_DELAY_MS };
  return {
    ephemeral: input.ephemeral ?? false,
    delayMs: input.delayMs ?? DEFAULT_AUTO_DEFER_DELAY_MS,
  };
}

/** Interactions auto-defer supports (those answered with `deferReply`). */
export type AutoDeferrableInteraction =
  | ChatInputCommandInteraction
  | UserContextMenuCommandInteraction
  | MessageContextMenuCommandInteraction;

/**
 * Arm a one-shot timer that calls `deferReply()` if the interaction is still
 * un-acknowledged when it fires. Returns a cancel function — always call it
 * once your handler settles (e.g. in a `finally`) to disarm the timer.
 */
export function armAutoDefer(
  interaction: AutoDeferrableInteraction,
  config: AutoDeferConfig,
): () => void {
  const timer = setTimeout(() => {
    if (!interaction.replied && !interaction.deferred) {
      void interaction
        .deferReply(config.ephemeral ? { flags: MessageFlags.Ephemeral } : {})
        .catch(() => undefined);
    }
  }, config.delayMs);
  if (typeof timer.unref === "function") timer.unref();
  return () => clearTimeout(timer);
}
