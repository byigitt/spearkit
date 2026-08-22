import { ComponentType, MessageFlags } from "discord.js";
import { describe, expect, it } from "vitest";
import { linkButton } from "../src/components/builders.js";
import { row } from "../src/components/row.js";
import {
  container,
  file,
  mediaGallery,
  section,
  separator,
  textDisplay,
  thumbnail,
} from "../src/components/v2.js";
import { normalizeReply } from "../src/context.js";

describe("components v2 layout helpers", () => {
  it("builds a text display", () => {
    const json = textDisplay("**Queue**").toJSON();
    expect(json.type).toBe(ComponentType.TextDisplay);
    expect(json.content).toBe("**Queue**");
  });

  it("builds separators with spacing and divider config", () => {
    const json = separator().toJSON();
    expect(json.type).toBe(ComponentType.Separator);

    const custom = separator({ spacing: 2, divider: false }).toJSON();
    expect(custom.spacing).toBe(2);
    expect(custom.divider).toBe(false);
  });

  it("builds thumbnails and files", () => {
    const thumb = thumbnail({ url: "https://cdn/x.png", description: "art" }).toJSON();
    expect(thumb.type).toBe(ComponentType.Thumbnail);
    expect(thumb.media.url).toBe("https://cdn/x.png");
    expect(thumb.description).toBe("art");

    const spoiler = thumbnail({ url: "https://cdn/y.png", spoiler: true }).toJSON();
    expect(spoiler.spoiler).toBe(true);

    const f = file("attachment://beat.mp3", { spoiler: true }).toJSON();
    expect(f.type).toBe(ComponentType.File);
    expect(f.file.url).toBe("attachment://beat.mp3");
    expect(f.spoiler).toBe(true);
  });

  it("builds media galleries", () => {
    const json = mediaGallery([
      { url: "https://cdn/1.png" },
      { url: "https://cdn/2.png", description: "second", spoiler: true },
    ]).toJSON();
    expect(json.type).toBe(ComponentType.MediaGallery);
    expect(json.items).toHaveLength(2);
    expect(json.items[0]!.media.url).toBe("https://cdn/1.png");
    expect(json.items[1]!.description).toBe("second");
    expect(json.items[1]!.spoiler).toBe(true);
  });

  it("builds sections with thumbnail or button accessories", () => {
    const withThumb = section({
      children: ["**Now playing**", "by Artist"],
      thumbnail: { url: "https://cdn/art.png" },
    }).toJSON();
    expect(withThumb.type).toBe(ComponentType.Section);
    expect(withThumb.components).toHaveLength(2);
    expect(withThumb.accessory.type).toBe(ComponentType.Thumbnail);

    const withButton = section({
      children: [textDisplay("Pick me")],
      button: linkButton({ label: "Open", url: "https://example.com" }),
    }).toJSON();
    expect(withButton.accessory.type).toBe(ComponentType.Button);
  });

  it("builds containers holding every child kind", () => {
    const skip = linkButton({ label: "Skip", url: "https://example.com/skip" });
    const json = container({
      accentColor: 0x5865f2,
      children: [
        textDisplay("**Now playing**"),
        separator(),
        row(skip),
        mediaGallery([{ url: "https://cdn/art.png" }]),
        file("attachment://a.png"),
        section({ children: ["side"], thumbnail: { url: "https://cdn/t.png" } }),
      ],
    }).toJSON();

    expect(json.type).toBe(ComponentType.Container);
    expect(json.accent_color).toBe(0x5865f2);
    expect(json.components.map((c) => c.type)).toEqual([
      ComponentType.TextDisplay,
      ComponentType.Separator,
      ComponentType.ActionRow,
      ComponentType.MediaGallery,
      ComponentType.File,
      ComponentType.Section,
    ]);
  });
});

describe("normalizeReply V2 handling", () => {
  const v2Tree = () => [textDisplay("hello")];

  it("auto-ORs IsComponentsV2 when the component tree contains layout parts", () => {
    const out = normalizeReply({ components: v2Tree() });
    expect(Number(out.flags) & MessageFlags.IsComponentsV2).toBeTruthy();
  });

  it("does not auto-flag classic action-row replies", () => {
    const skip = linkButton({ label: "x", url: "https://example.com" });
    const out = normalizeReply({
      content: "Choose",
      components: [row(skip)],
    });
    expect(out.flags).toBeUndefined();
  });

  it("keeps an explicitly set V2 flag", () => {
    const out = normalizeReply({
      flags: MessageFlags.IsComponentsV2,
      components: v2Tree(),
    });
    expect(out.flags).toBe(MessageFlags.IsComponentsV2);
  });

  it("combines the V2 flag with ephemeral", () => {
    const out = normalizeReply({ components: v2Tree(), ephemeral: true });
    expect(Number(out.flags) & MessageFlags.IsComponentsV2).toBeTruthy();
    expect(Number(out.flags) & MessageFlags.Ephemeral).toBeTruthy();
  });

  it("throws when content or embeds ride along with a V2 payload", () => {
    expect(() => normalizeReply({ components: v2Tree(), content: "hi" })).toThrow(
      /IsComponentsV2/,
    );
    expect(() =>
      normalizeReply({ flags: MessageFlags.IsComponentsV2, embeds: [] }),
    ).toThrow(/IsComponentsV2/);
  });
});
