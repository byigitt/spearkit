import { describe, expect, it } from "vitest";
import { Intents, SpearClient } from "../src/client.js";
import { command } from "../src/commands/command.js";
import { userCommand } from "../src/context-menus.js";
import { buildHelpEntries, helpCommand } from "../src/help.js";
import { prefixCommand } from "../src/prefix.js";

describe("helpCommand", () => {
  it("collects slash, prefix, and context-menu metadata", () => {
    const client = new SpearClient({
      intents: Intents.default,
      prefix: "!",
      logger: { level: "silent" },
    });
    client.register(
      command({ name: "ping", description: "Check latency", run: () => {} }),
      prefixCommand({
        name: "echo",
        description: "Repeat text",
        run: () => {},
      }),
      userCommand({ name: "Inspect", run: () => {} }),
      helpCommand(),
    );

    expect(buildHelpEntries(client, { exclude: "help" })).toEqual([
      {
        name: "echo",
        description: "Repeat text",
        surface: "prefix",
      },
      {
        name: "Inspect",
        description: "User context-menu command",
        surface: "userMenu",
      },
      {
        name: "ping",
        description: "Check latency",
        surface: "slash",
      },
    ]);
    client.destroy();
  });

  it("can omit non-slash surfaces", () => {
    const client = new SpearClient({
      intents: Intents.default,
      prefix: "!",
      logger: { level: "silent" },
    });
    client.register(
      command({ name: "ping", description: "Check latency", run: () => {} }),
      prefixCommand({ name: "echo", run: () => {} }),
    );

    expect(
      buildHelpEntries(client, {
        includePrefix: false,
        includeContextMenus: false,
      }),
    ).toEqual([
      {
        name: "ping",
        description: "Check latency",
        surface: "slash",
      },
    ]);
    client.destroy();
  });
});
