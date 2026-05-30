import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { describe, expect, it } from "vitest";
import { option, optionsHaveAutocomplete, toAPIOption } from "../src/commands/options.js";

describe("option builders", () => {
  it("default required is false; explicit true is preserved", () => {
    expect(option.string({ description: "d" }).required).toBe(false);
    expect(option.string({ description: "d", required: true }).required).toBe(true);
  });
});

describe("toAPIOption", () => {
  it("serialises a string option with choices", () => {
    const def = option.string({
      description: "pick",
      required: true,
      choices: [{ name: "A", value: "a" }],
    });
    expect(toAPIOption("p", def)).toEqual({
      type: ApplicationCommandOptionType.String,
      name: "p",
      description: "pick",
      required: true,
      name_localizations: undefined,
      description_localizations: undefined,
      min_length: undefined,
      max_length: undefined,
      choices: [{ name: "A", value: "a", name_localizations: undefined }],
    });
  });

  it("marks autocomplete and omits choices when an autocomplete handler exists", () => {
    const def = option.string({ description: "q", autocomplete: () => [] });
    const api = toAPIOption("q", def);
    expect(api).toMatchObject({ type: ApplicationCommandOptionType.String, autocomplete: true });
    expect("choices" in api).toBe(false);
  });

  it("serialises integer min/max", () => {
    const def = option.integer({ description: "n", minValue: 1, maxValue: 5 });
    expect(toAPIOption("n", def)).toMatchObject({
      type: ApplicationCommandOptionType.Integer,
      min_value: 1,
      max_value: 5,
    });
  });

  it("serialises channel types", () => {
    const def = option.channel({ description: "c", channelTypes: [ChannelType.GuildText] });
    expect(toAPIOption("c", def)).toMatchObject({
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildText],
    });
  });

  it("serialises entity options to their type", () => {
    expect(toAPIOption("u", option.user({ description: "u" })).type).toBe(
      ApplicationCommandOptionType.User,
    );
    expect(toAPIOption("r", option.role({ description: "r" })).type).toBe(
      ApplicationCommandOptionType.Role,
    );
    expect(toAPIOption("a", option.attachment({ description: "a" })).type).toBe(
      ApplicationCommandOptionType.Attachment,
    );
  });
});

describe("optionsHaveAutocomplete", () => {
  it("detects an autocomplete option in the map", () => {
    expect(optionsHaveAutocomplete({ a: option.string({ description: "x" }) })).toBe(false);
    expect(
      optionsHaveAutocomplete({ a: option.string({ description: "x", autocomplete: () => [] }) }),
    ).toBe(true);
  });
});
