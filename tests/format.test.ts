import { describe, expect, it } from "vitest";
import {
  discordTimestamp,
  formatDuration,
  parseDuration,
  relativeTimestamp,
} from "../src/format.js";

describe("formatDuration", () => {
  it("formats common durations in English by default", () => {
    expect(formatDuration(3_725_000)).toBe("1 hour 2 minutes");
    expect(formatDuration(86_400_000)).toBe("1 day");
    expect(formatDuration(2 * 86_400_000 + 3 * 3_600_000)).toBe("2 days 3 hours");
  });

  it("uses Turkish labels when locale is tr/tr-TR", () => {
    expect(formatDuration(3_725_000, { locale: "tr" })).toBe("1 saat 2 dakika");
    expect(formatDuration(86_400_000 * 9, { locale: "tr-TR", largest: 3 })).toBe("1 hafta 2 gün");
  });

  it("respects largest=Infinity to keep every non-zero unit", () => {
    const ms = 7 * 86_400_000 + 2 * 86_400_000 + 3 * 3_600_000 + 4 * 60_000 + 5 * 1000;
    expect(formatDuration(ms, { largest: Number.POSITIVE_INFINITY })).toBe(
      "1 week 2 days 3 hours 4 minutes 5 seconds",
    );
  });

  it("falls back to a zero label for non-positive durations", () => {
    expect(formatDuration(0)).toBe("0 seconds");
    expect(formatDuration(-1)).toBe("0 seconds");
    expect(formatDuration(0, { locale: "tr" })).toBe("0 saniye");
  });

  it("accepts a custom label set", () => {
    const out = formatDuration(60_000, {
      locale: {
        week: ["w", "w"],
        day: ["d", "d"],
        hour: ["h", "h"],
        minute: ["min", "min"],
        second: ["sec", "sec"],
        separator: ":",
        zero: "—",
      },
    });
    expect(out).toBe("1 min");
  });
});

describe("parseDuration", () => {
  it("parses common short forms", () => {
    expect(parseDuration("1h30m")).toBe(5_400_000);
    expect(parseDuration("2d")).toBe(2 * 86_400_000);
    expect(parseDuration("500ms")).toBe(500);
    expect(parseDuration("3 weeks")).toBe(3 * 604_800_000);
  });

  it("parses Turkish unit names", () => {
    expect(parseDuration("1 saat 30 dakika")).toBe(5_400_000);
    expect(parseDuration("2 gün")).toBe(2 * 86_400_000);
  });

  it("returns null on no match", () => {
    expect(parseDuration("")).toBeNull();
    expect(parseDuration("nothing")).toBeNull();
  });

  it("sums every recognised token", () => {
    expect(parseDuration("1d 2h 3m")).toBe(86_400_000 + 2 * 3_600_000 + 3 * 60_000);
  });
});

describe("discordTimestamp", () => {
  it("uses the default 'f' style", () => {
    const date = new Date("2026-01-02T03:04:05.000Z");
    expect(discordTimestamp(date)).toBe(`<t:${Math.floor(date.getTime() / 1000)}:f>`);
  });

  it("accepts an epoch-ms number and a style", () => {
    const ms = 1_700_000_000_000;
    expect(discordTimestamp(ms, "R")).toBe(`<t:${Math.floor(ms / 1000)}:R>`);
  });

  it("relativeTimestamp shortcut emits the R style", () => {
    const date = new Date(0);
    expect(relativeTimestamp(date)).toBe("<t:0:R>");
  });
});
