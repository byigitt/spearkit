import { describe, expect, it, vi } from "vitest";
import type {
  Message,
  ModalSubmitInteraction,
} from "discord.js";
import {
  awaitComponent,
  awaitMessage,
  showAndAwaitModal,
  type CollectableChannel,
  type ModalShowingInteraction,
} from "../src/collectors.js";

describe("awaitMessage", () => {
  it("resolves to the first collected message", async () => {
    const msg = { content: "hi" } as Message;
    const channel = {
      awaitMessages: vi.fn().mockResolvedValue({ first: () => msg }),
    } as unknown as CollectableChannel;
    expect(await awaitMessage(channel, { time: 1000 })).toBe(msg);
  });

  it("resolves to null on timeout (rejection)", async () => {
    const channel = {
      awaitMessages: vi.fn().mockRejectedValue(new Error("time")),
    } as unknown as CollectableChannel;
    expect(await awaitMessage(channel)).toBeNull();
  });

  it("passes the filter and a single-message limit through", async () => {
    const channel = {
      awaitMessages: vi.fn().mockResolvedValue({ first: () => undefined }),
    } as unknown as CollectableChannel;
    await awaitMessage(channel, { filter: () => true, time: 5 });
    expect(channel.awaitMessages).toHaveBeenCalledWith(
      expect.objectContaining({ max: 1, time: 5, errors: ["time"] }),
    );
  });
});

describe("awaitComponent", () => {
  it("returns the matched interaction", async () => {
    const got = { customId: "x", componentType: 2 };
    const message = {
      awaitMessageComponent: vi.fn().mockResolvedValue(got),
    } as unknown as Message;
    expect(await awaitComponent(message)).toBe(got);
  });

  it("returns null on timeout", async () => {
    const message = {
      awaitMessageComponent: vi.fn().mockRejectedValue(new Error("time")),
    } as unknown as Message;
    expect(await awaitComponent(message)).toBeNull();
  });

  it("filters by componentType when given", async () => {
    let captured: ((i: { componentType: number }) => boolean) | undefined;
    const message = {
      awaitMessageComponent: vi.fn((opts: { filter: (i: { componentType: number }) => boolean }) => {
        captured = opts.filter;
        return Promise.resolve({});
      }),
    } as unknown as Message;
    await awaitComponent(message, { componentType: 2 });
    expect(captured?.({ componentType: 2 })).toBe(true);
    expect(captured?.({ componentType: 3 })).toBe(false);
  });
});

describe("showAndAwaitModal", () => {
  function fakeInteraction(submission: unknown, reject = false) {
    const calls: { filter?: (i: ModalSubmitInteraction) => boolean } = {};
    const interaction = {
      user: { id: "u1" },
      showModal: vi.fn().mockResolvedValue(undefined),
      awaitModalSubmit: vi.fn((opts: { filter: (i: ModalSubmitInteraction) => boolean }) => {
        calls.filter = opts.filter;
        return reject ? Promise.reject(new Error("time")) : Promise.resolve(submission);
      }),
    };
    return { interaction, calls };
  }

  it("shows the modal and returns the submission", async () => {
    const submission = { customId: "fb:1" };
    const { interaction } = fakeInteraction(submission);
    const modal = { data: { custom_id: "fb:1" } };
    const result = await showAndAwaitModal(
      interaction as unknown as ModalShowingInteraction,
      modal as never,
    );
    expect(interaction.showModal).toHaveBeenCalledWith(modal);
    expect(result).toBe(submission);
  });

  it("scopes the wait to the same user and modal custom-id", async () => {
    const { interaction, calls } = fakeInteraction({ customId: "fb:1" });
    await showAndAwaitModal(
      interaction as unknown as ModalShowingInteraction,
      { data: { custom_id: "fb:1" } } as never,
    );
    const filter = calls.filter!;
    expect(filter({ user: { id: "u1" }, customId: "fb:1" } as ModalSubmitInteraction)).toBe(true);
    expect(filter({ user: { id: "u2" }, customId: "fb:1" } as ModalSubmitInteraction)).toBe(false);
    expect(filter({ user: { id: "u1" }, customId: "other" } as ModalSubmitInteraction)).toBe(false);
  });

  it("returns null when dismissed / timed out", async () => {
    const { interaction } = fakeInteraction(undefined, true);
    const result = await showAndAwaitModal(
      interaction as unknown as ModalShowingInteraction,
      { data: { custom_id: "fb:1" } } as never,
    );
    expect(result).toBeNull();
  });
});
