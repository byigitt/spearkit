/**
 * Ergonomic, validated Discord poll payloads.
 *
 * The returned object is ordinary discord.js {@link PollData}; pass it as
 * `poll` to `ctx.reply`, `channel.send`, or any compatible message method.
 * Polls cannot be combined with Components V2 and cannot be edited after send.
 */
import type { EmojiIdentifierResolvable, PollAnswerData, PollData } from "discord.js";

/** One answer accepted by {@link poll}. */
export type PollAnswerInput =
  | string
  | {
      text: string;
      emoji?: EmojiIdentifierResolvable;
    };

/** Configuration for {@link poll}. */
export interface PollConfig {
  /** Question text (maximum 300 characters). */
  question: string;
  /** Between 2 and 10 answers; answer text is limited to 55 characters. */
  answers: readonly PollAnswerInput[];
  /** Number of hours before expiry, 1–768 (32 days). Default: 24. */
  durationHours?: number;
  /** Allow voters to select more than one answer. Default: false. */
  multiselect?: boolean;
}

function assertLength(label: string, value: string, max: number): void {
  if (value.length === 0 || value.length > max) {
    throw new RangeError(`spearkit: poll ${label} must contain 1–${max} characters`);
  }
}

/**
 * Build a Discord poll payload with readable names and early validation.
 *
 * @example
 * ```ts
 * await ctx.reply({
 *   poll: poll({
 *     question: "Ship it?",
 *     answers: [{ text: "Yes", emoji: "✅" }, "Not yet"],
 *     durationHours: 6,
 *   }),
 * });
 * ```
 */
export function poll(config: PollConfig): PollData {
  assertLength("question", config.question, 300);
  if (config.answers.length < 2 || config.answers.length > 10) {
    throw new RangeError("spearkit: poll answers must contain 2–10 choices");
  }

  const duration = config.durationHours ?? 24;
  if (!Number.isInteger(duration) || duration < 1 || duration > 768) {
    throw new RangeError("spearkit: poll durationHours must be an integer from 1 to 768");
  }

  const answers: PollAnswerData[] = config.answers.map((answer, index) => {
    const resolved = typeof answer === "string" ? { text: answer } : answer;
    assertLength(`answer ${index + 1}`, resolved.text, 55);
    return { text: resolved.text, emoji: resolved.emoji };
  });

  return {
    question: { text: config.question },
    answers,
    duration,
    allowMultiselect: config.multiselect ?? false,
  };
}
