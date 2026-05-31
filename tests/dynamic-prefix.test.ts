import { describe, expect, it } from "vitest";
import type { Message } from "discord.js";
import { PrefixRegistry, prefixCommand } from "../src/prefix.js";

function fakeMessage(
  content: string,
  opts: { guildId?: string | null; userId?: string } = {},
): { message: Message; replies: unknown[] } {
  const replies: unknown[] = [];
  const message = {
    content,
    author: { id: opts.userId ?? "u1", bot: false },
    member: null,
    guild: null,
    guildId: opts.guildId ?? null,
    channelId: "c1",
    client: { user: { id: "BOT" } },
    reply(payload: unknown) {
      replies.push(payload);
      return Promise.resolve({});
    },
  };
  return { message: message as unknown as Message, replies };
}

const ping = () => prefixCommand({ name: "ping", run: (c) => void c.reply("pong") });

describe("dynamic prefix resolver", () => {
  it("accepts a per-guild prefix alongside the static one", async () => {
    const reg = new PrefixRegistry().setOptions({
      prefix: "!",
      dynamic: (m) => (m.guildId === "g1" ? "?" : null),
    });
    reg.add(ping());

    // static prefix works everywhere
    expect(await reg.handle(fakeMessage("!ping").message)).toBe(true);

    // dynamic prefix works only in the matching guild
    const g1 = fakeMessage("?ping", { guildId: "g1" });
    expect(await reg.handle(g1.message)).toBe(true);
    expect(g1.replies).toEqual(["pong"]);

    // and is not applied elsewhere
    expect(await reg.handle(fakeMessage("?ping", { guildId: "g2" }).message)).toBe(false);
  });

  it("passes the message to the resolver", async () => {
    let seenGuild: string | null = "unset";
    const reg = new PrefixRegistry().setOptions({
      prefix: "!",
      dynamic: (m) => {
        seenGuild = m.guildId;
        return null;
      },
    });
    reg.add(ping());
    await reg.handle(fakeMessage("!ping", { guildId: "g7" }).message);
    expect(seenGuild).toBe("g7");
  });

  it("supports multiple dynamic prefixes and an async resolver", async () => {
    const reg = new PrefixRegistry().setOptions({
      mention: false,
      dynamic: async () => ["?", ">"],
    });
    reg.add(ping());
    expect(await reg.handle(fakeMessage("?ping").message)).toBe(true);
    expect(await reg.handle(fakeMessage(">ping").message)).toBe(true);
    expect(await reg.handle(fakeMessage("!ping").message)).toBe(false);
  });

  it("falls back to static prefixes when the resolver returns null", async () => {
    const reg = new PrefixRegistry().setOptions({ prefix: "!", dynamic: () => null });
    reg.add(ping());
    expect(await reg.handle(fakeMessage("!ping").message)).toBe(true);
  });
});
