/**
 * Discord API error helpers — turn opaque `DiscordAPIError` throws into
 * something you can branch on and show to users.
 *
 * discord.js surfaces REST failures as {@link DiscordAPIError} with a numeric
 * `code` (e.g. `10062` "Unknown interaction", `50013` "Missing permissions").
 * Memorising those numbers is a chore, and `try/catch` blocks that re-throw
 * everything turn small, recoverable failures (a deleted message, a closed DM)
 * into crashes or scary stack traces. This module gives you named codes, a
 * type-narrowing predicate, and a friendly, end-user-appropriate explanation.
 *
 * @example
 * ```ts
 * try {
 *   await message.delete();
 * } catch (err) {
 *   if (isDiscordError(err, DiscordErrorCode.UnknownMessage)) return; // already gone
 *   throw err;
 * }
 * ```
 */
import { DiscordAPIError, HTTPError, RESTJSONErrorCodes } from "discord.js";

/**
 * The Discord JSON error codes spearkit cares about most, by readable name.
 * This is a curated subset of discord.js' {@link RESTJSONErrorCodes} covering
 * the failures bots actually hit and can recover from. Values are the numeric
 * codes Discord returns on `DiscordAPIError.code`.
 */
export const DiscordErrorCode = {
  /** A referenced channel no longer exists or is invisible to the bot. */
  UnknownChannel: RESTJSONErrorCodes.UnknownChannel, // 10003
  /** The targeted guild is gone or the bot was removed from it. */
  UnknownGuild: RESTJSONErrorCodes.UnknownGuild, // 10004
  /** The referenced member is not in the guild. */
  UnknownMember: RESTJSONErrorCodes.UnknownMember, // 10007
  /** The message was deleted (or never existed) before the action ran. */
  UnknownMessage: RESTJSONErrorCodes.UnknownMessage, // 10008
  /** The user could not be resolved. */
  UnknownUser: RESTJSONErrorCodes.UnknownUser, // 10013
  /** The interaction token expired (the classic 3-second-window failure). */
  UnknownInteraction: RESTJSONErrorCodes.UnknownInteraction, // 10062
  /** The bot lacks access to the resource entirely (not just one permission). */
  MissingAccess: RESTJSONErrorCodes.MissingAccess, // 50001
  /** Action attempted on a DM channel that does not support it. */
  CannotExecuteActionOnDMChannel: RESTJSONErrorCodes.CannotExecuteActionOnDMChannel, // 50003
  /** The target user has DMs closed or blocked the bot. */
  CannotSendMessagesToThisUser: RESTJSONErrorCodes.CannotSendMessagesToThisUser, // 50007
  /** The bot is missing one or more permissions required for the action. */
  MissingPermissions: RESTJSONErrorCodes.MissingPermissions, // 50013
  /** The request body failed Discord's validation. */
  InvalidFormBodyOrContentType:
    RESTJSONErrorCodes.InvalidFormBodyOrContentType, // 50035
  /** The interaction was already acknowledged elsewhere. */
  InteractionHasAlreadyBeenAcknowledged:
    RESTJSONErrorCodes.InteractionHasAlreadyBeenAcknowledged, // 40060
  /** The bot reached the maximum number of guilds it may join. */
  MaximumNumberOfGuildsReached: RESTJSONErrorCodes.MaximumNumberOfGuildsReached, // 30001
  /** Too many active reactions / pins / etc. of this kind. */
  MaximumNumberOfReactionsReached:
    RESTJSONErrorCodes.MaximumNumberOfReactionsReached, // 30010
} as const;

/** A numeric Discord JSON error code value. */
export type DiscordErrorCodeValue =
  (typeof DiscordErrorCode)[keyof typeof DiscordErrorCode];

/**
 * Narrow an unknown thrown value to a {@link DiscordAPIError}. Pass a `code`
 * (or several) to also assert the specific failure — ideal for "ignore this
 * one error, re-throw the rest" recovery.
 *
 * @example
 * ```ts
 * if (isDiscordError(err, [DiscordErrorCode.UnknownMessage, DiscordErrorCode.UnknownChannel])) return;
 * ```
 */
export function isDiscordError(
  error: unknown,
  code?: number | string | readonly (number | string)[],
): error is DiscordAPIError {
  if (!(error instanceof DiscordAPIError)) return false;
  if (code === undefined) return true;
  const codes = Array.isArray(code) ? code : [code];
  return codes.includes(error.code);
}

/**
 * Narrow to a transport-level {@link HTTPError} (timeouts, 5xx, aborted
 * requests) — failures with an HTTP status but no Discord JSON code.
 */
export function isHTTPError(error: unknown): error is HTTPError {
  return error instanceof HTTPError;
}

/** Whether the thrown value is a Discord rate-limit (HTTP 429) response. */
export function isRateLimitError(error: unknown): boolean {
  return error instanceof DiscordAPIError && error.status === 429;
}

const FRIENDLY: Partial<Record<number, string>> = {
  [DiscordErrorCode.UnknownChannel]: "That channel no longer exists.",
  [DiscordErrorCode.UnknownMessage]: "That message no longer exists.",
  [DiscordErrorCode.UnknownMember]: "That member isn't in this server.",
  [DiscordErrorCode.UnknownUser]: "I couldn't find that user.",
  [DiscordErrorCode.UnknownInteraction]:
    "This took too long and expired — please run it again.",
  [DiscordErrorCode.InteractionHasAlreadyBeenAcknowledged]:
    "This took too long and expired — please run it again.",
  [DiscordErrorCode.MissingAccess]: "I don't have access to do that here.",
  [DiscordErrorCode.CannotSendMessagesToThisUser]:
    "I can't DM that user — they may have DMs disabled.",
  [DiscordErrorCode.CannotExecuteActionOnDMChannel]:
    "That can't be done in a DM.",
  [DiscordErrorCode.MissingPermissions]:
    "I'm missing the permissions needed to do that.",
};

/**
 * Render an end-user-appropriate sentence for a Discord error, or `null` if the
 * error isn't a recognised, explainable Discord failure (in which case you
 * should fall back to a generic "something went wrong" message and log it).
 *
 * @example
 * ```ts
 * catch (err) { await ctx.error(explainDiscordError(err) ?? "Something went wrong."); }
 * ```
 */
export function explainDiscordError(error: unknown): string | null {
  if (isRateLimitError(error)) {
    return "I'm being rate-limited right now — please try again in a moment.";
  }
  if (!(error instanceof DiscordAPIError)) return null;
  if (typeof error.code === "number") {
    const known = FRIENDLY[error.code];
    if (known !== undefined) return known;
  }
  return null;
}
