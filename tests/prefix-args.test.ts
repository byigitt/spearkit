import { describe, expect, it } from "vitest";
import { prefixArgs } from "../src/prefix-args.js";
import { PrefixContext, PrefixRegistry, prefixCommand } from "../src/prefix.js";
import type { Message } from "discord.js";

function fakeMessage(content: string): { message: Message; replies: unknown[] } {
  const replies: unknown[] = [];
  const message = {
    content,
    author: { id: "u1", tag: "u#0001", bot: false },
    member: null,
    guild: null,
    guildId: null,
    channelId: "c1",
    channel: { send: () => Promise.resolve({}) },
    client: { user: { id: "BOT" } },
    reply(payload: unknown) {
      replies.push(payload);
      return Promise.resolve({});
    },
  };
  return { message: message as unknown as Message, replies };
}

describe("prefixArgs builder + parser", () => {
  it("parses primitives positionally", () => {
    const parser = prefixArgs().string("name").integer("count").compile();
    const r = parser.parse(["spear", "3"], "spear 3");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.values).toEqual({ name: "spear", count: 3 });
  });

  it("snowflake accepts raw ids and mentions", () => {
    const parser = prefixArgs().snowflake("target").compile();
    expect(parser.parse(["123456789012345678"], "123456789012345678")).toMatchObject({
      ok: true,
      values: { target: "123456789012345678" },
    });
    expect(parser.parse(["<@!123456789012345678>"], "<@!123456789012345678>")).toMatchObject({
      ok: true,
      values: { target: "123456789012345678" },
    });
    expect(parser.parse(["nope"], "nope")).toMatchObject({ ok: false, arg: "target" });
  });

  it("duration accepts short forms in en and tr", () => {
    const parser = prefixArgs().duration("d").compile();
    expect(parser.parse(["1h30m"], "1h30m")).toMatchObject({ ok: true, values: { d: 5_400_000 } });
    expect(parser.parse(["1", "saat"], "1 saat")).toMatchObject({ ok: false }); // separate tokens
    expect(parser.parse(["1saat"], "1saat")).toMatchObject({ ok: true, values: { d: 3_600_000 } });
  });

  it("rest captures the remainder of the message", () => {
    const parser = prefixArgs().snowflake("target").rest("reason").compile();
    const r = parser.parse(["123456789012345678", "spamming", "and", "raid"], "123456789012345678 spamming and raid");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.values).toEqual({ target: "123456789012345678", reason: "spamming and raid" });
  });

  it("required = true makes missing args error", () => {
    const parser = prefixArgs().string("name", { required: true }).compile();
    expect(parser.parse([], "")).toMatchObject({ ok: false, arg: "name" });
    expect(parser.parse(["x"], "x")).toMatchObject({ ok: true });
  });

  it("default values stand in for missing tokens", () => {
    const parser = prefixArgs()
      .string("name", { default: "anonymous" })
      .duration("d", { default: 60_000 })
      .compile();
    const r = parser.parse([], "");
    expect(r).toMatchObject({ ok: true, values: { name: "anonymous", d: 60_000 } });
  });

  it("boolean accepts the common spellings", () => {
    const parser = prefixArgs().boolean("flag").compile();
    expect(parser.parse(["yes"], "yes")).toMatchObject({ ok: true, values: { flag: true } });
    expect(parser.parse(["off"], "off")).toMatchObject({ ok: true, values: { flag: false } });
    expect(parser.parse(["bogus"], "bogus")).toMatchObject({ ok: false });
  });
});

describe("prefixCommand integration", () => {
  it("populates ctx.options on the handler when args is provided", async () => {
    let seen: { target?: string; reason?: string } = {};
    const reg = new PrefixRegistry().setOptions("!");
    reg.add(
      prefixCommand({
        name: "mute",
        args: (a) => a.snowflake("target", { required: true }).rest("reason"),
        run: (ctx) => {
          seen = ctx.options;
        },
      }),
    );
    const { message } = fakeMessage("!mute 123456789012345678 spamming the chat");
    await reg.handle(message);
    expect(seen).toEqual({ target: "123456789012345678", reason: "spamming the chat" });
  });

  it("replies with an error embed when parsing fails", async () => {
    const reg = new PrefixRegistry().setOptions("!");
    reg.add(
      prefixCommand({
        name: "mute",
        args: (a) => a.snowflake("target", { required: true }),
        run: () => {},
      }),
    );
    const { message, replies } = fakeMessage("!mute nope");
    await reg.handle(message);
    expect(replies).toHaveLength(1);
    const payload = replies[0] as { embeds?: { toJSON(): { description?: string } }[] };
    expect(payload.embeds?.[0]?.toJSON().description).toMatch(/target/);
  });

  it("default ctx.options is an empty object when no args schema", async () => {
    let seen: unknown;
    const reg = new PrefixRegistry().setOptions("!");
    reg.add(
      prefixCommand({
        name: "ping",
        run: (ctx) => {
          seen = ctx.options;
        },
      }),
    );
    const { message } = fakeMessage("!ping");
    await reg.handle(message);
    expect(seen).toEqual({});
  });
});

describe("PrefixContext typed options", () => {
  it("exposes the options object directly", () => {
    const ctx = new PrefixContext({} as Message, "x", [], "", { a: 1 } as const);
    expect(ctx.options.a).toBe(1);
  });
});
