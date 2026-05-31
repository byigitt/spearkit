import { setTimeout as delay } from "node:timers/promises";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MessageFlags } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import {
  DEFAULT_AUTO_DEFER_DELAY_MS,
  armAutoDefer,
  normalizeAutoDefer,
} from "../src/auto-defer.js";
import { CommandRegistry } from "../src/commands/registry.js";
import { command } from "../src/commands/command.js";
import { fakeChatInput } from "./helpers.js";

describe("normalizeAutoDefer", () => {
  it("maps true to the defaults", () => {
    expect(normalizeAutoDefer(true)).toEqual({ ephemeral: false, delayMs: DEFAULT_AUTO_DEFER_DELAY_MS });
  });
  it("returns undefined when disabled", () => {
    expect(normalizeAutoDefer(false)).toBeUndefined();
    expect(normalizeAutoDefer(undefined)).toBeUndefined();
  });
  it("applies overrides", () => {
    expect(normalizeAutoDefer({ ephemeral: true })).toEqual({
      ephemeral: true,
      delayMs: DEFAULT_AUTO_DEFER_DELAY_MS,
    });
    expect(normalizeAutoDefer({ delayMs: 500 })).toEqual({ ephemeral: false, delayMs: 500 });
  });
});

function fakeDeferrable() {
  const obj = {
    replied: false,
    deferred: false,
    deferReply: vi.fn((opts?: { flags?: number }) => {
      obj.deferred = true;
      return Promise.resolve({ opts });
    }),
  };
  return obj;
}

describe("armAutoDefer", () => {
  afterEach(() => vi.useRealTimers());

  it("defers once the delay elapses if still unacknowledged", () => {
    vi.useFakeTimers();
    const i = fakeDeferrable();
    armAutoDefer(i as unknown as ChatInputCommandInteraction, { ephemeral: false, delayMs: 2000 });
    expect(i.deferReply).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2000);
    expect(i.deferReply).toHaveBeenCalledOnce();
    expect(i.deferReply).toHaveBeenCalledWith({});
  });

  it("passes the ephemeral flag through", () => {
    vi.useFakeTimers();
    const i = fakeDeferrable();
    armAutoDefer(i as unknown as ChatInputCommandInteraction, { ephemeral: true, delayMs: 100 });
    vi.advanceTimersByTime(100);
    expect(i.deferReply).toHaveBeenCalledWith({ flags: MessageFlags.Ephemeral });
  });

  it("does nothing after cancel", () => {
    vi.useFakeTimers();
    const i = fakeDeferrable();
    const cancel = armAutoDefer(i as unknown as ChatInputCommandInteraction, {
      ephemeral: false,
      delayMs: 2000,
    });
    cancel();
    vi.advanceTimersByTime(5000);
    expect(i.deferReply).not.toHaveBeenCalled();
  });

  it("does not defer when the handler already responded", () => {
    vi.useFakeTimers();
    const i = fakeDeferrable();
    i.replied = true;
    armAutoDefer(i as unknown as ChatInputCommandInteraction, { ephemeral: false, delayMs: 100 });
    vi.advanceTimersByTime(200);
    expect(i.deferReply).not.toHaveBeenCalled();
  });
});

describe("CommandRegistry auto-defer integration", () => {
  it("defers a slow handler before it responds", async () => {
    const reg = new CommandRegistry();
    reg.add(
      command({
        name: "slow",
        description: "slow",
        autoDefer: { delayMs: 10 },
        run: async () => {
          await delay(40);
        },
      }),
    );
    const { interaction } = fakeChatInput({ commandName: "slow" });
    await reg.handle(interaction);
    expect(interaction.deferred).toBe(true);
  });

  it("does not defer a fast handler that replies immediately", async () => {
    const reg = new CommandRegistry();
    reg.add(
      command({
        name: "fast",
        description: "fast",
        autoDefer: { delayMs: 50 },
        run: (ctx) => ctx.reply("done"),
      }),
    );
    const { interaction } = fakeChatInput({ commandName: "fast" });
    await reg.handle(interaction);
    expect(interaction.deferred).toBe(false);
    expect(interaction.replied).toBe(true);
  });

  it("applies a registry-wide default to commands without their own", async () => {
    const reg = new CommandRegistry().setAutoDefer({ ephemeral: false, delayMs: 10 });
    reg.add(
      command({
        name: "slow",
        description: "slow",
        run: async () => {
          await delay(40);
        },
      }),
    );
    const { interaction } = fakeChatInput({ commandName: "slow" });
    await reg.handle(interaction);
    expect(interaction.deferred).toBe(true);
  });
});
