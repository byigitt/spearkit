/**
 * Example suite — proves every file under examples/ is real, working code, not
 * just type-checked prose.
 *
 * Two layers:
 *  1. "loads offline" — imports every example module. Examples connect to
 *     Discord (`client.start`, REST deploys, `client.login`); we stub those
 *     network entry points and provide the env the examples read, so importing
 *     a module runs its top-level wiring AND its `void main()` to completion
 *     without leaving the machine. A broken example throws or rejects here.
 *  2. "behaves" — dispatches faithful mock interactions through a representative
 *     set of exported handlers and asserts the responses, tying the example
 *     code paths into the tested cases.
 */
import { setTimeout as delay } from "node:timers/promises";
import { Client, REST } from "discord.js";
import { afterAll, describe, expect, it, vi } from "vitest";

import { CommandRegistry } from "../src/commands/registry.js";
import { ComponentRegistry } from "../src/components/registry.js";
import { ContextMenuRegistry } from "../src/context-menus.js";
import { SpearClient } from "../src/client.js";
import { PrefixRegistry } from "../src/prefix.js";

import {
  fakeAutocomplete,
  fakeButton,
  fakeChatInput,
  fakeModalSubmit,
  fakeStringSelect,
} from "./helpers.js";

// Behavioral handles — these example modules are declarative (no `main()`), so
// importing them is side-effect free and gives us the definitions to dispatch.
import { order } from "../examples/options/choices.js";
import { echo } from "../examples/slash-commands/with-options.js";
import { whereami } from "../examples/slash-commands/basic.js";
import { settings } from "../examples/slash-commands/subcommands.js";
import { fruit } from "../examples/autocomplete/basic.js";
import { refresh } from "../examples/buttons/basic.js";
import { vote, page } from "../examples/buttons/with-params.js";
import { toppings } from "../examples/select-menus/string-select.js";
import { feedback } from "../examples/modals/basic.js";
import { inspectMessage } from "../examples/context-menus/message-menu.js";
import { mute } from "../examples/prefix-args/mute.js";

declare global {
  interface ImportMeta {
    glob(pattern: string): Record<string, () => Promise<Record<string, unknown>>>;
  }
}

// --- offline harness ---------------------------------------------------------

const ENV = {
  DISCORD_TOKEN: "offline-token",
  DISCORD_APP_ID: "111111111111111111",
  GUILD_ID: "222222222222222222",
} as const;

const savedEnv: Record<string, string | undefined> = {};
for (const key of Object.keys(ENV)) savedEnv[key] = process.env[key];
// Set before any example module is imported (top-level, runs at file load).
for (const [key, value] of Object.entries(ENV)) process.env[key] = value;

// Replace the methods that would otherwise reach Discord. spearkit re-exports
// these exact classes, so stubbing the prototypes covers every example.
const stubs = [
  vi.spyOn(Client.prototype, "login").mockResolvedValue("offline-token"),
  vi.spyOn(REST.prototype, "put").mockResolvedValue([] as never),
  vi.spyOn(REST.prototype, "get").mockResolvedValue([] as never),
  vi.spyOn(SpearClient.prototype, "deployCommands").mockResolvedValue([] as never),
  vi.spyOn(SpearClient.prototype, "deployAllCommands").mockResolvedValue([] as never),
];

afterAll(() => {
  for (const stub of stubs) stub.mockRestore();
  for (const key of Object.keys(ENV)) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
});


// --- 1. every example loads and runs offline ---------------------------------

// `import.meta.glob` is Vite's compile-time directory import (vitest runs on
// Vite). The call must stay literal for Vite to expand it; we augment the type
// locally so the suite needs no ambient vite/client defs.
const exampleModules = import.meta.glob("../examples/**/*.ts");

describe("examples load and run offline", () => {
  it("discovers every example file", () => {
    // Guard against a glob that silently matches nothing.
    expect(Object.keys(exampleModules).length).toBeGreaterThan(40);
  });

  for (const [path, load] of Object.entries(exampleModules)) {
    it(`loads ${path.replace("../examples/", "")}`, async () => {
      const mod = await load();
      expect(mod).toBeTypeOf("object");
      // Let any fire-and-forget `void main()` settle; a rejection here means a
      // broken example, which surfaces as an unhandled rejection / failure.
      await delay(10);
    });
  }
});

// --- 2. representative handlers behave ---------------------------------------

describe("example command handlers", () => {
  it("options/choices: order narrows choices and defaults sugar", async () => {
    const { interaction, capture } = fakeChatInput({
      commandName: "order",
      options: { size: "md" },
    });
    await new CommandRegistry().add(order).handle(interaction);
    expect(capture.replies).toEqual([{ content: "A md drink with 0 sugar(s)." }]);
  });

  it("slash-commands/with-options: echo repeats the text", async () => {
    const { interaction, capture } = fakeChatInput({
      commandName: "echo",
      options: { text: "ab", times: 3 },
    });
    await new CommandRegistry().add(echo).handle(interaction);
    expect(capture.replies).toEqual([{ content: "ababab" }]);
  });

  it("slash-commands/basic: whereami reports a DM when there is no guild", async () => {
    const { interaction, capture } = fakeChatInput({ commandName: "whereami" });
    await new CommandRegistry().add(whereami).handle(interaction);
    expect(capture.replies).toEqual([{ content: "In a DM" }]);
  });

  it("slash-commands/subcommands: settings routes to the get subcommand", async () => {
    const { interaction, capture } = fakeChatInput({
      commandName: "settings",
      subcommand: "get",
      options: { key: "prefix" },
    });
    await new CommandRegistry().add(settings).handle(interaction);
    expect(capture.replies).toEqual([{ content: "Value of prefix: (demo)" }]);
  });

  it("autocomplete/basic: fruit suggests matching names", async () => {
    const { interaction, capture } = fakeAutocomplete({
      commandName: "fruit",
      focused: { name: "name", value: "ap" },
    });
    await new CommandRegistry().add(fruit).handleAutocomplete(interaction);
    expect(capture.autocomplete).toEqual([
      [
        { name: "apple", value: "apple" },
        { name: "apricot", value: "apricot" },
      ],
    ]);
  });
});

describe("example component handlers", () => {
  it("buttons/basic: refresh updates with a timestamp", async () => {
    const { interaction, capture } = fakeButton("refresh");
    expect(await new ComponentRegistry().add(refresh).handle(interaction)).toBe(true);
    expect(capture.updates).toHaveLength(1);
    expect(capture.updates[0]).toMatch(/^Refreshed at /);
  });

  it("buttons/with-params: vote and page decode their custom-id params", async () => {
    const reg = new ComponentRegistry().add(vote).add(page);

    const yes = fakeButton("vote:yes");
    expect(await reg.handle(yes.interaction)).toBe(true);
    expect(yes.capture.updates).toEqual(["You voted: yes"]);

    const next = fakeButton("page:3:next");
    expect(await reg.handle(next.interaction)).toBe(true);
    expect(next.capture.updates).toEqual(["page 3, direction next"]);
  });

  it("select-menus/string-select: toppings echoes the chosen values", async () => {
    const { interaction, capture } = fakeStringSelect("toppings", ["cheese", "olives"]);
    expect(await new ComponentRegistry().add(toppings).handle(interaction)).toBe(true);
    expect(capture.replies[0]).toMatchObject({ content: "Chosen: cheese, olives" });
  });

  it("modals/basic: feedback resolves params and fields", async () => {
    const { interaction, capture } = fakeModalSubmit("feedback:1234", {
      summary: "great",
      detail: "",
    });
    expect(await new ComponentRegistry().add(feedback).handle(interaction)).toBe(true);
    expect(capture.replies[0]).toMatchObject({ content: "Thanks (#1234): great" });
  });
});

describe("example context-menu handlers", () => {
  it("context-menus/message-menu: inspectMessage replies with an embed", async () => {
    const replies: unknown[] = [];
    const interaction = {
      commandName: "Inspect message",
      user: { id: "u1", tag: "u#0001" },
      member: null,
      guild: null,
      guildId: null,
      channel: null,
      channelId: null,
      locale: "en-US",
      replied: false,
      deferred: false,
      client: {},
      targetMessage: { id: "m1", content: "hello world", author: { tag: "author#0001" } },
      isMessageContextMenuCommand: () => true,
      reply(payload: unknown) {
        replies.push(payload);
        this.replied = true;
        return Promise.resolve({});
      },
      editReply: () => Promise.resolve({}),
      followUp: () => Promise.resolve({}),
      deferReply() {
        this.deferred = true;
        return Promise.resolve({});
      },
    };
    await new ContextMenuRegistry().add(inspectMessage).handleMessage(interaction as never);
    expect(replies).toHaveLength(1);
    expect((replies[0] as { embeds?: unknown[] }).embeds).toBeDefined();
  });
});

describe("example prefix handlers", () => {
  it("prefix-args/mute: parses snowflake, duration and rest into a reply", async () => {
    const replies: unknown[] = [];
    const message = {
      content: "!mute 123456789012345678 1h spamming the chat",
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
    const reg = new PrefixRegistry().setOptions("!").add(mute);
    expect(await reg.handle(message as never)).toBe(true);
    expect(replies).toEqual([
      "Muted <@123456789012345678> for 3600s: spamming the chat",
    ]);
  });
});
