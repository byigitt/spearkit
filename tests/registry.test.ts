import { describe, expect, it } from "vitest";
import { command } from "../src/commands/command.js";
import { CommandRegistry } from "../src/commands/registry.js";
import { ComponentRegistry } from "../src/components/registry.js";
import { button, modal, stringSelect, textInput } from "../src/components/builders.js";

const cmd = (name: string) => command({ name, description: "d", run: () => {} });

describe("CommandRegistry", () => {
  it("adds, looks up, lists and removes commands", () => {
    const reg = new CommandRegistry();
    reg.add(cmd("a"), cmd("b"));
    expect(reg.size).toBe(2);
    expect(reg.names.sort()).toEqual(["a", "b"]);
    expect(reg.get("a")?.name).toBe("a");
    expect(reg.remove("a")).toBe(true);
    expect(reg.get("a")).toBeUndefined();
    expect(reg.size).toBe(1);
  });

  it("overrides a command registered under the same name", () => {
    const reg = new CommandRegistry();
    reg.add(cmd("dup"));
    reg.add(cmd("dup"));
    expect(reg.size).toBe(1);
  });

  it("serialises all commands", () => {
    const reg = new CommandRegistry().add(cmd("a"), cmd("b"));
    expect(reg.toJSON()).toHaveLength(2);
  });

  it("requires a token or rest instance to deploy", async () => {
    const reg = new CommandRegistry().add(cmd("a"));
    await expect(reg.deploy({ applicationId: "1" })).rejects.toThrow(/token or a pre-configured REST/);
  });
});

describe("ComponentRegistry", () => {
  it("registers components of every kind", () => {
    const reg = new ComponentRegistry();
    reg.add(
      button({ id: "b", run: () => {} }),
      stringSelect({ id: "s", options: [{ label: "x", value: "x" }], run: () => {} }),
      modal({ id: "m", title: "t", fields: { f: textInput({ label: "F" }) }, run: () => {} }),
    );
    expect(reg.size).toBe(3);
  });

  it("overrides components sharing a namespace", () => {
    const reg = new ComponentRegistry();
    reg.add(button({ id: "dup", run: () => {} }));
    reg.add(button({ id: "dup", run: () => {} }));
    expect(reg.size).toBe(1);
  });
});
