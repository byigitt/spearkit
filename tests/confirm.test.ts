import { EventEmitter } from "node:events";
import { describe, expect, it } from "vitest";
import { confirm } from "../src/confirm.js";

interface FakeButton {
  customId: string;
  user: { id: string };
  deferUpdate(): Promise<void>;
}

function fakeInteraction() {
  const replies: unknown[] = [];
  const collectorEvents = new EventEmitter();
  const fakeMsg = {
    createMessageComponentCollector(_opts: unknown) {
      return collectorEvents;
    },
  };
  const interaction = {
    user: { id: "u1" },
    client: {},
    replied: false,
    deferred: false,
    async reply(payload: unknown) {
      this.replied = true;
      replies.push(payload);
      return {};
    },
    async editReply(payload: unknown) {
      replies.push(payload);
      return {};
    },
    async fetchReply() {
      return fakeMsg;
    },
  };
  return { interaction, replies, collectorEvents };
}

async function tick() {
  await new Promise((r) => setTimeout(r, 0));
}

describe("confirm", () => {
  it("sends an info embed and two buttons", async () => {
    const { interaction, replies, collectorEvents } = fakeInteraction();
    const pending = confirm(interaction as never, { body: "are you sure?" });
    await tick();
    const payload = replies[0] as { embeds: unknown[]; components: { components: { data: { custom_id: string; label: string } }[] }[]; flags?: number };
    expect(payload.embeds).toBeDefined();
    expect(payload.components).toHaveLength(1);
    const buttons = payload.components[0]?.components ?? [];
    expect(buttons.map((b) => b.data.custom_id)).toEqual(["spk-confirm:yes", "spk-confirm:no"]);
    expect(buttons.map((b) => b.data.label)).toEqual(["Confirm", "Cancel"]);
    expect((payload.flags ?? 0) & 64).toBe(64); // ephemeral by default
    // End the collector so the promise resolves.
    collectorEvents.emit("end");
    const result = await pending;
    expect(result.reason).toBe("timeout");
    expect(result.confirmed).toBe(false);
  });

  it("resolves confirmed=true on the yes click", async () => {
    const { interaction, collectorEvents } = fakeInteraction();
    const pending = confirm(interaction as never, { body: "?", ephemeral: false });
    await tick();
    const button: FakeButton = {
      customId: "spk-confirm:yes",
      user: { id: "u1" },
      deferUpdate: () => Promise.resolve(),
    };
    collectorEvents.emit("collect", button);
    await tick();
    collectorEvents.emit("end");
    const result = await pending;
    expect(result.confirmed).toBe(true);
    expect(result.reason).toBe("confirm");
  });

  it("resolves confirmed=false on the cancel click", async () => {
    const { interaction, collectorEvents } = fakeInteraction();
    const pending = confirm(interaction as never, { body: "?" });
    await tick();
    const button: FakeButton = {
      customId: "spk-confirm:no",
      user: { id: "u1" },
      deferUpdate: () => Promise.resolve(),
    };
    collectorEvents.emit("collect", button);
    await tick();
    collectorEvents.emit("end");
    const result = await pending;
    expect(result.confirmed).toBe(false);
    expect(result.reason).toBe("cancel");
  });

  it("applies custom labels and styles", async () => {
    const { interaction, replies, collectorEvents } = fakeInteraction();
    const pending = confirm(interaction as never, {
      body: "?",
      confirm: { label: "Reset", style: "Danger" },
      cancel: { label: "Keep", style: "Secondary" },
    });
    await tick();
    const payload = replies[0] as { components: { components: { data: { label: string; style: number } }[] }[] };
    expect(payload.components[0]?.components.map((b) => b.data.label)).toEqual(["Reset", "Keep"]);
    collectorEvents.emit("end");
    await pending;
  });
});
