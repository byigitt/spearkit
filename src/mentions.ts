/**
 * Parse Discord mention markup and snowflakes people paste into text commands.
 */

const SNOWFLAKE = /^(\d{17,20})$/;
const USER = /^<@!?(\d{17,20})>$/;
const ROLE = /^<@&(\d{17,20})>$/;
const CHANNEL = /^<#(\d{17,20})>$/;
const EMOJI = /<(a)?:(\w+):(\d{17,20})>/;

/** A custom emoji parsed from `<:name:id>` / `<a:name:id>`. */
export interface ParsedCustomEmoji {
  name: string;
  id: string;
  animated: boolean;
}

/** Extract a snowflake from raw digits, or `null`. */
export function parseSnowflake(input: string): string | null {
  const match = SNOWFLAKE.exec(input.trim());
  return match?.[1] ?? null;
}

/** User mention (`<@id>` / `<@!id>`) or a bare snowflake. */
export function parseUserId(input: string): string | null {
  const trimmed = input.trim();
  return USER.exec(trimmed)?.[1] ?? parseSnowflake(trimmed);
}

/** Role mention (`<@&id>`) or a bare snowflake. */
export function parseRoleId(input: string): string | null {
  const trimmed = input.trim();
  return ROLE.exec(trimmed)?.[1] ?? parseSnowflake(trimmed);
}

/** Channel mention (`<#id>`) or a bare snowflake. */
export function parseChannelId(input: string): string | null {
  const trimmed = input.trim();
  return CHANNEL.exec(trimmed)?.[1] ?? parseSnowflake(trimmed);
}

/** Parse a custom emoji mention. Unicode emoji returns `null`. */
export function parseCustomEmoji(input: string): ParsedCustomEmoji | null {
  const match = EMOJI.exec(input.trim());
  if (match === null) return null;
  return {
    animated: match[1] === "a",
    name: match[2] ?? "",
    id: match[3] ?? "",
  };
}

/**
 * Chat-input command mention (`</name:id>`). Subcommands use a space:
 * `</play song:123>`.
 */
export function slashMention(name: string, commandId: string, subcommand?: string): string {
  const path = subcommand === undefined ? name : `${name} ${subcommand}`;
  return `</${path}:${commandId}>`;
}
