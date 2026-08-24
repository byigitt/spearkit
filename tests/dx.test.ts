import { describe, expect, it } from "vitest";
import { choices, filterChoices } from "../src/choices.js";
import { inviteUrl } from "../src/invite.js";
import {
  parseChannelId,
  parseCustomEmoji,
  parseRoleId,
  parseSnowflake,
  parseUserId,
  slashMention,
} from "../src/mentions.js";
import { PermissionFlagsBits } from "discord.js";

describe("choices", () => {
  it("builds from a display map and from value lists", () => {
    expect(choices({ Easy: "easy", Hard: "hard" })).toEqual([
      { name: "Easy", value: "easy" },
      { name: "Hard", value: "hard" },
    ]);
    expect(choices("red", "blue")).toEqual([
      { name: "red", value: "red" },
      { name: "blue", value: "blue" },
    ]);
  });
});

describe("filterChoices", () => {
  it("matches name or value and caps at 25", () => {
    const items = choices("Apple", "Banana", "Apricot");
    expect(filterChoices(items, "ap").map((c) => c.value)).toEqual(["Apple", "Apricot"]);
    expect(filterChoices(items, "").length).toBe(3);
    const many = Array.from({ length: 40 }, (_v, i) => `n${i}`);
    expect(filterChoices(many, "").length).toBe(25);
  });
});

describe("inviteUrl", () => {
  it("includes bot + applications.commands by default", () => {
    const url = inviteUrl({
      clientId: "99",
      permissions: [PermissionFlagsBits.BanMembers],
    });
    expect(url).toContain("client_id=99");
    expect(url).toContain("scope=bot+applications.commands");
    expect(url).toContain("permissions=");
  });
});

describe("mentions", () => {
  it("parses snowflakes and mention markup", () => {
    expect(parseSnowflake("123456789012345678")).toBe("123456789012345678");
    expect(parseUserId("<@123456789012345678>")).toBe("123456789012345678");
    expect(parseUserId("<@!123456789012345678>")).toBe("123456789012345678");
    expect(parseRoleId("<@&123456789012345678>")).toBe("123456789012345678");
    expect(parseChannelId("<#123456789012345678>")).toBe("123456789012345678");
    expect(parseCustomEmoji("<a:wave:123456789012345678>")).toEqual({
      animated: true,
      name: "wave",
      id: "123456789012345678",
    });
    expect(slashMention("play", "1", "song")).toBe("</play song:1>");
  });
});
