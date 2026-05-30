import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionContextType,
  PermissionFlagsBits,
  PermissionsBitField,
} from "discord.js";
import { describe, expect, it } from "vitest";
import { command, commandGroup, subcommand, subcommandGroup } from "../src/commands/command.js";
import { option } from "../src/commands/options.js";

describe("command().toJSON", () => {
  it("produces a chat-input command with its options", () => {
    const cmd = command({
      name: "echo",
      description: "Repeat",
      options: { msg: option.string({ description: "Text", required: true }) },
      run: () => {},
    });
    const json = cmd.toJSON();
    expect(cmd.name).toBe("echo");
    expect(json.type).toBe(ApplicationCommandType.ChatInput);
    expect(json.options).toEqual([
      {
        type: ApplicationCommandOptionType.String,
        name: "msg",
        description: "Text",
        required: true,
        name_localizations: undefined,
        description_localizations: undefined,
        min_length: undefined,
        max_length: undefined,
        choices: undefined,
      },
    ]);
  });

  it("maps guildOnly to guild interaction context", () => {
    const json = command({ name: "g", description: "d", guildOnly: true, run: () => {} }).toJSON();
    expect(json.contexts).toEqual([InteractionContextType.Guild]);
  });

  it("serialises default member permissions to a bitfield string", () => {
    const json = command({
      name: "p",
      description: "d",
      defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
      run: () => {},
    }).toJSON();
    expect(json.default_member_permissions).toBe(
      new PermissionsBitField(PermissionFlagsBits.ManageGuild).bitfield.toString(),
    );
  });

  it("reports autocomplete presence", () => {
    const withAuto = command({
      name: "a",
      description: "d",
      options: { q: option.string({ description: "q", autocomplete: () => [] }) },
      run: () => {},
    });
    const without = command({ name: "b", description: "d", run: () => {} });
    expect(withAuto.hasAutocomplete).toBe(true);
    expect(without.hasAutocomplete).toBe(false);
  });
});

describe("commandGroup().toJSON", () => {
  it("nests subcommands and groups as options", () => {
    const json = commandGroup({
      name: "admin",
      description: "Admin tools",
      subcommands: {
        ping: subcommand({ description: "ping", run: () => {} }),
      },
      groups: {
        users: subcommandGroup({
          description: "user tools",
          subcommands: {
            ban: subcommand({
              description: "ban",
              options: { target: option.user({ description: "who", required: true }) },
              run: () => {},
            }),
          },
        }),
      },
    }).toJSON();

    expect(json.options).toEqual([
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "ping",
        description: "ping",
        name_localizations: undefined,
        description_localizations: undefined,
        options: [],
      },
      {
        type: ApplicationCommandOptionType.SubcommandGroup,
        name: "users",
        description: "user tools",
        name_localizations: undefined,
        description_localizations: undefined,
        options: [
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "ban",
            description: "ban",
            name_localizations: undefined,
            description_localizations: undefined,
            options: [
              {
                type: ApplicationCommandOptionType.User,
                name: "target",
                description: "who",
                required: true,
                name_localizations: undefined,
                description_localizations: undefined,
              },
            ],
          },
        ],
      },
    ]);
  });

  it("propagates autocomplete from nested subcommands", () => {
    const g = commandGroup({
      name: "g",
      description: "d",
      subcommands: {
        find: subcommand({
          description: "find",
          options: { q: option.string({ description: "q", autocomplete: () => [] }) },
          run: () => {},
        }),
      },
    });
    expect(g.hasAutocomplete).toBe(true);
  });
});
