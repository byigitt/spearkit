import { describe, expect, it } from "vitest";
import { DiscordAPIError } from "discord.js";
import {
  DiscordErrorCode,
  explainDiscordError,
  isDiscordError,
  isHTTPError,
  isRateLimitError,
} from "../src/discord-errors.js";

function apiError(code: number, status = 400): DiscordAPIError {
  return new DiscordAPIError(
    { code, message: `error ${code}` },
    code,
    status,
    "POST",
    "https://discord.com/api/v10/x",
    { body: {}, files: [] },
  );
}

describe("isDiscordError", () => {
  it("narrows DiscordAPIError and ignores other throwables", () => {
    expect(isDiscordError(apiError(50013))).toBe(true);
    expect(isDiscordError(new Error("nope"))).toBe(false);
    expect(isDiscordError("string")).toBe(false);
  });

  it("matches a single code", () => {
    expect(isDiscordError(apiError(10008), DiscordErrorCode.UnknownMessage)).toBe(true);
    expect(isDiscordError(apiError(10008), DiscordErrorCode.MissingPermissions)).toBe(false);
  });

  it("matches any code in a list", () => {
    const err = apiError(DiscordErrorCode.UnknownChannel);
    expect(
      isDiscordError(err, [DiscordErrorCode.UnknownMessage, DiscordErrorCode.UnknownChannel]),
    ).toBe(true);
    expect(isDiscordError(err, [DiscordErrorCode.MissingPermissions])).toBe(false);
  });
});

describe("isRateLimitError / isHTTPError", () => {
  it("detects 429 responses", () => {
    expect(isRateLimitError(apiError(0, 429))).toBe(true);
    expect(isRateLimitError(apiError(50013, 403))).toBe(false);
  });

  it("does not treat a DiscordAPIError as an HTTPError", () => {
    expect(isHTTPError(apiError(50013))).toBe(false);
    expect(isHTTPError(new Error("x"))).toBe(false);
  });
});

describe("explainDiscordError", () => {
  it("returns a friendly sentence for known codes", () => {
    expect(explainDiscordError(apiError(DiscordErrorCode.MissingPermissions))).toMatch(/permission/i);
    expect(explainDiscordError(apiError(DiscordErrorCode.UnknownMessage))).toMatch(/no longer exists/i);
    expect(explainDiscordError(apiError(DiscordErrorCode.CannotSendMessagesToThisUser))).toMatch(/DM/);
  });

  it("explains rate limits before code lookup", () => {
    expect(explainDiscordError(apiError(0, 429))).toMatch(/rate-limited/i);
  });

  it("returns null for unknown / non-Discord errors", () => {
    expect(explainDiscordError(apiError(999999))).toBeNull();
    expect(explainDiscordError(new Error("boom"))).toBeNull();
  });
});
