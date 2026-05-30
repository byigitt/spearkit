import { MessageFlags } from "discord.js";
import { describe, expect, it } from "vitest";
import { asEphemeral, normalizeReply } from "../src/context.js";

describe("normalizeReply", () => {
  it("wraps a string into content", () => {
    expect(normalizeReply("hi")).toEqual({ content: "hi" });
  });

  it("maps ephemeral: true to the ephemeral flag", () => {
    expect(normalizeReply({ content: "hi", ephemeral: true })).toEqual({
      content: "hi",
      flags: MessageFlags.Ephemeral,
    });
  });

  it("merges ephemeral into an existing numeric flag", () => {
    const result = normalizeReply({ content: "x", ephemeral: true, flags: MessageFlags.SuppressEmbeds });
    expect(result.flags).toBe(MessageFlags.SuppressEmbeds | MessageFlags.Ephemeral);
  });

  it("leaves a non-ephemeral payload untouched", () => {
    expect(normalizeReply({ content: "x" })).toEqual({ content: "x" });
  });
});

describe("asEphemeral", () => {
  it("marks a string as ephemeral", () => {
    expect(asEphemeral("hi")).toEqual({ content: "hi", ephemeral: true });
  });

  it("marks an options object as ephemeral", () => {
    expect(asEphemeral({ content: "x" })).toEqual({ content: "x", ephemeral: true });
  });
});
