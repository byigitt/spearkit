import type { ChatInputCommandInteraction } from "discord.js";
import { describe, expect, it } from "vitest";
import { BaseContext } from "../src/context.js";
import { createI18n, I18n } from "../src/i18n.js";

describe("I18n", () => {
  it("resolves exact locale, language, fallback, and default catalogs", () => {
    const i18n = createI18n({
      defaultLocale: "en-US",
      fallbackLocale: "de",
      messages: {
        "en-US": { hello: "Hello {name}", defaultOnly: "Default" },
        tr: { hello: "Merhaba {name}" },
        de: { fallbackOnly: "Ersatz" },
      },
    });

    expect(i18n.t("tr-TR", "hello", { name: "Barış" })).toBe(
      "Merhaba Barış",
    );
    expect(i18n.t("fr", "fallbackOnly")).toBe("Ersatz");
    expect(i18n.t("fr", "defaultOnly")).toBe("Default");
  });

  it("supports formatter functions and preserves absent placeholders", () => {
    const i18n = createI18n({
      defaultLocale: "en",
      messages: {
        en: {
          count: (params) => `${params.count} item(s)`,
          missingParam: "Hello {name}",
        },
      },
    });

    expect(i18n.t("en", "count", { count: 3 })).toBe("3 item(s)");
    expect(i18n.t("en", "missingParam")).toBe("Hello {name}");
  });

  it("uses an async per-target locale resolver", async () => {
    const i18n = new I18n({
      defaultLocale: "en",
      messages: { en: { hello: "Hello" }, tr: { hello: "Merhaba" } },
      resolveLocale: async ({ guildId }) => (guildId === "tr-guild" ? "tr" : null),
    });

    await expect(
      i18n.translateFor(
        { locale: "en-US", guildId: "tr-guild", userId: "1" },
        "hello",
      ),
    ).resolves.toBe("Merhaba");
  });

  it("returns the key by default when no catalog contains it", () => {
    const i18n = new I18n({
      defaultLocale: "en",
      messages: { en: {} },
    });
    expect(i18n.t("en", "unknown")).toBe("unknown");
  });

  it("accepts a base-language catalog for a regional default", () => {
    const i18n = new I18n({
      defaultLocale: "en-US",
      messages: { en: { hello: "Hello" } },
    });
    expect(i18n.t("fr", "hello")).toBe("Hello");
  });

  it("requires the default locale catalog", () => {
    expect(
      () => new I18n({ defaultLocale: "en", messages: { tr: {} } }),
    ).toThrow(/defaultLocale/);
  });
});

describe("BaseContext.t", () => {
  it("translates using interaction locale metadata", async () => {
    const i18n = new I18n({
      defaultLocale: "en",
      messages: { en: { hello: "Hello" }, tr: { hello: "Merhaba" } },
    });
    const interaction = {
      client: { i18n },
      user: { id: "1" },
      locale: "tr",
      guildLocale: "en-US",
      guildId: "g",
    } as unknown as ChatInputCommandInteraction;
    const ctx = new (class extends BaseContext<ChatInputCommandInteraction> {})(
      interaction,
    );

    await expect(ctx.t("hello")).resolves.toBe("Merhaba");
  });
});
