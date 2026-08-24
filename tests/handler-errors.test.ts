import type { ChatInputCommandInteraction } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { Embeds } from "../src/embeds.js";
import { dispatchHandlerError } from "../src/handler-errors.js";
import { Logger } from "../src/logger.js";

function interaction() {
  return {
    deferred: false,
    replied: false,
    reply: vi.fn().mockResolvedValue(undefined),
    editReply: vi.fn().mockResolvedValue(undefined),
    followUp: vi.fn().mockResolvedValue(undefined),
  } as unknown as ChatInputCommandInteraction;
}

describe("dispatchHandlerError", () => {
  it("uses a custom user-facing message", async () => {
    const target = interaction();
    await dispatchHandlerError({
      event: {
        source: "command",
        name: "broken",
        error: new Error("private detail"),
        interaction: target,
      },
      handler: () => "Try again later.",
      logger: new Logger({ level: "silent" }),
      embeds: new Embeds(),
    });

    expect(target.reply).toHaveBeenCalledWith(
      expect.objectContaining({ content: "Try again later." }),
    );
  });

  it("suppresses the automatic response when the policy returns false", async () => {
    const target = interaction();
    await dispatchHandlerError({
      event: {
        source: "component",
        name: "vote",
        error: new Error("boom"),
        interaction: target,
      },
      handler: () => false,
      logger: new Logger({ level: "silent" }),
      embeds: new Embeds(),
    });

    expect(target.reply).not.toHaveBeenCalled();
  });

  it("does not expose arbitrary error messages by default", async () => {
    const target = interaction();
    await dispatchHandlerError({
      event: {
        source: "contextMenu",
        name: "Inspect",
        error: new Error("database password leaked here"),
        interaction: target,
      },
      logger: new Logger({ level: "silent" }),
      embeds: new Embeds(),
    });

    expect(target.reply).toHaveBeenCalledWith(
      expect.objectContaining({ content: "Something went wrong." }),
    );
  });
});
