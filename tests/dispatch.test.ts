import { describe, expect, it, vi } from "vitest";
import { command, commandGroup, subcommand } from "../src/commands/command.js";
import { option } from "../src/commands/options.js";
import { CommandRegistry } from "../src/commands/registry.js";
import { button, modal, stringSelect, textInput } from "../src/components/builders.js";
import { ComponentRegistry } from "../src/components/registry.js";
import {
  fakeAutocomplete,
  fakeButton,
  fakeChatInput,
  fakeModalSubmit,
  fakeStringSelect,
} from "./helpers.js";

describe("CommandRegistry dispatch", () => {
  it("resolves typed options and runs the handler", async () => {
    let seen: { text: string; times: number | undefined } | undefined;
    const echo = command({
      name: "echo",
      description: "d",
      options: {
        text: option.string({ description: "t", required: true }),
        times: option.integer({ description: "n" }),
      },
      run: (ctx) => {
        seen = { text: ctx.options.text, times: ctx.options.times };
        return ctx.reply(ctx.options.text);
      },
    });
    const reg = new CommandRegistry().add(echo);
    const { interaction, capture } = fakeChatInput({
      commandName: "echo",
      options: { text: "hi", times: 3 },
    });
    await reg.handle(interaction);
    expect(seen).toEqual({ text: "hi", times: 3 });
    expect(capture.replies).toEqual([{ content: "hi" }]);
  });

  it("leaves an absent optional option as undefined", async () => {
    let times: number | undefined = -1;
    const cmd = command({
      name: "c",
      description: "d",
      options: { times: option.integer({ description: "n" }) },
      run: (ctx) => {
        times = ctx.options.times;
      },
    });
    const reg = new CommandRegistry().add(cmd);
    await reg.handle(fakeChatInput({ commandName: "c" }).interaction);
    expect(times).toBeUndefined();
  });

  it("routes to the correct subcommand handler", async () => {
    const calls: string[] = [];
    const grp = commandGroup({
      name: "g",
      description: "d",
      subcommands: {
        one: subcommand({ description: "1", run: () => void calls.push("one") }),
        two: subcommand({ description: "2", run: () => void calls.push("two") }),
      },
    });
    const reg = new CommandRegistry().add(grp);
    await reg.handle(fakeChatInput({ commandName: "g", subcommand: "two" }).interaction);
    expect(calls).toEqual(["two"]);
  });

  it("ignores an unknown command", async () => {
    const reg = new CommandRegistry().add(command({ name: "known", description: "d", run: () => {} }));
    const { capture } = fakeChatInput({ commandName: "known" });
    await reg.handle(fakeChatInput({ commandName: "unknown" }).interaction);
    expect(capture.replies).toHaveLength(0);
  });

  it("routes handler errors to a custom error handler", async () => {
    const onError = vi.fn();
    const reg = new CommandRegistry()
      .add(
        command({
          name: "boom",
          description: "d",
          run: () => {
            throw new Error("kaboom");
          },
        }),
      )
      .onError(onError);
    const { interaction } = fakeChatInput({ commandName: "boom" });
    await reg.handle(interaction);
    expect(onError).toHaveBeenCalledOnce();
    expect((onError.mock.calls[0]?.[0] as Error).message).toBe("kaboom");
  });

  it("falls back to an ephemeral reply and emits error when no handler is set", async () => {
    const reg = new CommandRegistry().add(
      command({
        name: "boom",
        description: "d",
        run: () => {
          throw new Error("kaboom");
        },
      }),
    );
    const { interaction, capture } = fakeChatInput({ commandName: "boom" });
    await reg.handle(interaction);
    expect(capture.errors.map((e) => e.message)).toEqual(["kaboom"]);
    expect(capture.replies).toHaveLength(1);
  });
});

describe("CommandRegistry autocomplete dispatch", () => {
  it("responds with filtered suggestions", async () => {
    const fruits = ["apple", "apricot", "banana"];
    const cmd = command({
      name: "fruit",
      description: "d",
      options: {
        q: option.string({
          description: "q",
          autocomplete: (ctx) =>
            fruits.filter((f) => f.startsWith(ctx.value)).map((f) => ({ name: f, value: f })),
        }),
      },
      run: () => {},
    });
    const reg = new CommandRegistry().add(cmd);
    const { interaction, capture } = fakeAutocomplete({
      commandName: "fruit",
      focused: { name: "q", value: "ap" },
    });
    await reg.handleAutocomplete(interaction);
    expect(capture.autocomplete[0]).toEqual([
      { name: "apple", value: "apple", name_localizations: undefined },
      { name: "apricot", value: "apricot", name_localizations: undefined },
    ]);
  });
});

describe("ComponentRegistry routing", () => {
  it("routes a button click with decoded params", async () => {
    let choice: string | undefined;
    const vote = button({
      id: "vote:{choice}",
      run: (ctx) => {
        choice = ctx.params.choice;
        return ctx.update(`ok:${ctx.params.choice}`);
      },
    });
    const reg = new ComponentRegistry().add(vote);
    const { interaction, capture } = fakeButton("vote:yes");
    const handled = await reg.handle(interaction);
    expect(handled).toBe(true);
    expect(choice).toBe("yes");
    expect(capture.updates).toEqual(["ok:yes"]);
  });

  it("routes a string select with its chosen values", async () => {
    let values: string[] = [];
    const menu = stringSelect({
      id: "menu",
      options: [{ label: "A", value: "a" }],
      run: (ctx) => {
        values = ctx.values;
      },
    });
    const reg = new ComponentRegistry().add(menu);
    const { interaction } = fakeStringSelect("menu", ["a", "b"]);
    expect(await reg.handle(interaction)).toBe(true);
    expect(values).toEqual(["a", "b"]);
  });

  it("routes a modal submit with resolved fields and params", async () => {
    let result: { ticket: string; summary: string } | undefined;
    const fb = modal({
      id: "fb:{ticket}",
      title: "t",
      fields: { summary: textInput({ label: "S" }) },
      run: (ctx) => {
        result = { ticket: ctx.params.ticket, summary: ctx.fields.summary };
      },
    });
    const reg = new ComponentRegistry().add(fb);
    const { interaction } = fakeModalSubmit("fb:42", { summary: "hello" });
    expect(await reg.handle(interaction)).toBe(true);
    expect(result).toEqual({ ticket: "42", summary: "hello" });
  });

  it("returns false for an unregistered namespace", async () => {
    const reg = new ComponentRegistry().add(button({ id: "known", run: () => {} }));
    expect(await reg.handle(fakeButton("missing").interaction)).toBe(false);
  });

  it("emits error and replies ephemerally when a handler throws", async () => {
    const reg = new ComponentRegistry().add(
      button({
        id: "boom",
        run: () => {
          throw new Error("explode");
        },
      }),
    );
    const { interaction, capture } = fakeButton("boom");
    await reg.handle(interaction);
    expect(capture.errors.map((e) => e.message)).toEqual(["explode"]);
    expect(capture.replies).toHaveLength(1);
  });
});
