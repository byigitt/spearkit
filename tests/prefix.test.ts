import { describe, expect, it } from "vitest";
import type { Message } from "discord.js";
import { PrefixContext, PrefixRegistry, prefixCommand } from "../src/prefix.js";
import { CooldownManager } from "../src/cooldown.js";

function fakeMessage(
  content: string,
  opts: { bot?: boolean; userId?: string; botId?: string } = {},
): { message: Message; replies: unknown[] } {
  const replies: unknown[] = [];
  const message = {
    content,
    author: { id: opts.userId ?? "u1", bot: opts.bot ?? false },
    member: null,
    guild: null,
    guildId: null,
    channelId: "c1",
    channel: {
      send(payload: unknown) {
        replies.push(["send", payload]);
        return Promise.resolve({});
      },
    },
    client: { user: { id: opts.botId ?? "BOT" } },
    reply(payload: unknown) {
      replies.push(payload);
      return Promise.resolve({});
    },
  };
  return { message: message as unknown as Message, replies };
}

describe("prefixCommand", () => {
  it("captures aliases and normalises cooldowns", () => {
    const cmd = prefixCommand({ name: "ping", aliases: ["p"], cooldown: 500, run: () => {} });
    expect(cmd.kind).toBe("prefixCommand");
    expect(cmd.aliases).toEqual(["p"]);
    expect(cmd.cooldown).toEqual({ duration: 500 });
  });
});

describe("PrefixRegistry.handle", () => {
  it("parses prefix, command name and arguments", async () => {
    const reg = new PrefixRegistry().setOptions("!");
    let seen: { name: string; args: string[]; rest: string } | undefined;
    reg.add(
      prefixCommand({
        name: "echo",
        run: (ctx) => {
          seen = { name: ctx.commandName, args: ctx.args, rest: ctx.rest };
          void ctx.reply("done");
        },
      }),
    );
    const { message, replies } = fakeMessage("!echo hello world");
    expect(await reg.handle(message)).toBe(true);
    expect(seen).toEqual({ name: "echo", args: ["hello", "world"], rest: "hello world" });
    expect(replies).toEqual(["done"]);
  });

  it("ignores non-prefixed messages and bot authors", async () => {
    const reg = new PrefixRegistry().setOptions("!");
    reg.add(prefixCommand({ name: "ping", run: (c) => void c.reply("pong") }));
    expect(await reg.handle(fakeMessage("just chatting").message)).toBe(false);
    expect(await reg.handle(fakeMessage("!ping", { bot: true }).message)).toBe(false);
  });

  it("matches aliases case-insensitively", async () => {
    const reg = new PrefixRegistry().setOptions("!");
    reg.add(prefixCommand({ name: "help", aliases: ["h"], run: (c) => void c.reply("help!") }));
    expect(reg.get("H")?.name).toBe("help");
    const { message, replies } = fakeMessage("!H");
    expect(await reg.handle(message)).toBe(true);
    expect(replies).toEqual(["help!"]);
  });

  it("accepts a bot mention as a prefix", async () => {
    const reg = new PrefixRegistry().setOptions({ prefix: [], mention: true });
    reg.add(prefixCommand({ name: "hi", run: (c) => void c.reply("yo") }));
    const { message, replies } = fakeMessage("<@999> hi", { botId: "999" });
    expect(await reg.handle(message)).toBe(true);
    expect(replies).toEqual(["yo"]);
  });

  it("enforces a cooldown across calls", async () => {
    const reg = new PrefixRegistry().setOptions("!");
    reg.setCooldowns(new CooldownManager());
    reg.add(prefixCommand({ name: "lim", cooldown: 60_000, run: (c) => void c.reply("ok") }));
    const first = fakeMessage("!lim");
    await reg.handle(first.message);
    const second = fakeMessage("!lim");
    await reg.handle(second.message);
    expect(first.replies).toEqual(["ok"]);
    expect(second.replies).toHaveLength(1);
    expect(String(second.replies[0])).toMatch(/cooldown/i);
  });

  it("does nothing when no prefixes are configured", async () => {
    const reg = new PrefixRegistry();
    reg.add(prefixCommand({ name: "ping", run: (c) => void c.reply("pong") }));
    expect(await reg.handle(fakeMessage("!ping").message)).toBe(false);
  });
});

describe("PrefixContext", () => {
  it("exposes message accessors", () => {
    const { message } = fakeMessage("!x");
    const ctx = new PrefixContext(message, "x", [], "");
    expect(ctx.author.id).toBe("u1");
    expect(ctx.channelId).toBe("c1");
  });
});
