import { describe, expect, it } from "vitest";
import { SlashCommand } from "../src/commands/command.js";
import { hybridCommand } from "../src/hybrid.js";
import { option } from "../src/commands/options.js";

describe("hybridCommand", () => {
  it("exposes a slash command and a prefix command of the same name", () => {
    const ping = hybridCommand({
      name: "ping",
      description: "Check latency",
      options: { target: option.user({ description: "Who" }) },
      args: (a) => a.snowflake("target"),
      run: () => undefined,
    });
    expect(ping.name).toBe("ping");
    expect(ping.slash).toBeInstanceOf(SlashCommand);
    expect(ping.prefix.kind).toBe("prefixCommand");
    expect(ping.prefix.name).toBe("ping");
  });
});
