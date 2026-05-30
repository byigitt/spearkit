import { describe, expect, it } from "vitest";
import {
  Embeds,
  DEFAULT_EMBED_COLORS,
  DEFAULT_EMBED_ICONS,
  defaultEmbeds,
} from "../src/embeds.js";
import { CommandRegistry } from "../src/commands/registry.js";
import { command } from "../src/commands/command.js";
import { fakeChatInput } from "./helpers.js";

describe("Embeds.build", () => {
  it("uses default colors and icon-prefixed descriptions", () => {
    const e = new Embeds();
    const err = e.error("nope").toJSON();
    expect(err.color).toBe(DEFAULT_EMBED_COLORS.error);
    expect(err.description).toBe(`${DEFAULT_EMBED_ICONS.error} nope`);

    const ok = e.success("done").toJSON();
    expect(ok.color).toBe(DEFAULT_EMBED_COLORS.success);
    expect(ok.description).toBe(`${DEFAULT_EMBED_ICONS.success} done`);

    expect(e.info("read").toJSON().color).toBe(DEFAULT_EMBED_COLORS.info);
    expect(e.warn("care").toJSON().color).toBe(DEFAULT_EMBED_COLORS.warn);
  });

  it("applies overrides without losing other defaults", () => {
    const e = new Embeds({ colors: { success: 0x00ff88 }, icons: { error: "" } });
    expect(e.colors.success).toBe(0x00ff88);
    expect(e.colors.error).toBe(DEFAULT_EMBED_COLORS.error);
    expect(e.icons.warn).toBe(DEFAULT_EMBED_ICONS.warn);
    // empty icon: no prefix, no leading space
    expect(e.error("boom").toJSON().description).toBe("boom");
  });

  it("accepts a structured body and prefixes the description", () => {
    const e = new Embeds();
    const embed = e.info({
      title: "Hello",
      description: "world",
      fields: [{ name: "k", value: "v" }],
      footer: { text: "f" },
      url: "https://example.com",
      thumbnail: { url: "https://example.com/t.png" },
      image: { url: "https://example.com/i.png" },
    }).toJSON();
    expect(embed.title).toBe("Hello");
    expect(embed.description).toBe(`${DEFAULT_EMBED_ICONS.info} world`);
    expect(embed.fields).toEqual([{ name: "k", value: "v" }]);
    expect(embed.footer?.text).toBe("f");
    expect(embed.url).toBe("https://example.com");
    expect(embed.thumbnail?.url).toBe("https://example.com/t.png");
    expect(embed.image?.url).toBe("https://example.com/i.png");
  });

  it("normalises Date | number | string timestamps", () => {
    const e = new Embeds();
    const date = new Date("2026-01-02T03:04:05.000Z");
    expect(e.info({ description: "x", timestamp: date }).toJSON().timestamp).toBe(date.toISOString());
    expect(e.info({ description: "x", timestamp: date.getTime() }).toJSON().timestamp).toBe(date.toISOString());
    expect(e.info({ description: "x", timestamp: date.toISOString() }).toJSON().timestamp).toBe(date.toISOString());
  });

  it("exposes a shared default instance", () => {
    expect(defaultEmbeds.colors.error).toBe(DEFAULT_EMBED_COLORS.error);
  });
});

describe("context preset replies", () => {
  it("ctx.success/info/warn/error send the matching preset embed via state-aware send", async () => {
    const reg = new CommandRegistry().add(
      command({
        name: "mix",
        description: "d",
        run: async (ctx) => {
          await ctx.success("done");
          await ctx.info("note");
          await ctx.warn("careful");
          await ctx.error("nope"); // ephemeral by default
        },
      }),
    );
    const { interaction, capture } = fakeChatInput({ commandName: "mix" });
    await reg.handle(interaction);
    // The first call is .reply(); subsequent calls fall through to followUp.
    const all = [...capture.replies, ...capture.followUps];
    expect(all).toHaveLength(4);
    const colors = all.map((payload) => {
      const p = payload as { embeds?: { toJSON(): { color?: number } }[] };
      return p.embeds?.[0]?.toJSON().color;
    });
    expect(colors).toEqual([
      DEFAULT_EMBED_COLORS.success,
      DEFAULT_EMBED_COLORS.info,
      DEFAULT_EMBED_COLORS.warn,
      DEFAULT_EMBED_COLORS.error,
    ]);
    // The error reply is ephemeral by default (Ephemeral flag = 64).
    const errPayload = all[3] as { flags?: number };
    expect((errPayload.flags ?? 0) & 64).toBe(64);
  });

  it("ctx.replySuccess uses .reply() explicitly", async () => {
    const reg = new CommandRegistry().add(
      command({
        name: "ping",
        description: "d",
        run: async (ctx) => {
          await ctx.replySuccess("hi");
        },
      }),
    );
    const { interaction, capture } = fakeChatInput({ commandName: "ping" });
    await reg.handle(interaction);
    expect(capture.replies).toHaveLength(1);
    expect(capture.followUps).toHaveLength(0);
  });
});
