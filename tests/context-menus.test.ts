import { ApplicationCommandType, PermissionFlagsBits } from "discord.js";
import { describe, expect, it } from "vitest";
import {
  ContextMenuRegistry,
  messageCommand,
  userCommand,
} from "../src/context-menus.js";
import { requireOwner } from "../src/guards.js";

function fakeUserCtx(name: string) {
  const replies: unknown[] = [];
  const interaction = {
    commandName: name,
    user: { id: "u1", tag: "u#0001" },
    member: null,
    guild: null,
    guildId: null,
    channel: null,
    channelId: null,
    locale: "en-US",
    replied: false,
    deferred: false,
    targetUser: { id: "target", tag: "target#0001" },
    targetMember: null,
    isUserContextMenuCommand: () => true,
    client: {},
    async reply(payload: unknown) {
      this.replied = true;
      replies.push(payload);
      return {};
    },
    async editReply(payload: unknown) {
      replies.push(payload);
      return {};
    },
    async followUp(payload: unknown) {
      replies.push(payload);
      return {};
    },
    async deferReply() {
      this.deferred = true;
      return {};
    },
  };
  return { interaction, replies };
}

function fakeMessageCtx(name: string) {
  const replies: unknown[] = [];
  const interaction = {
    commandName: name,
    user: { id: "u1", tag: "u#0001" },
    member: null,
    guild: null,
    guildId: null,
    channel: null,
    channelId: null,
    locale: "en-US",
    replied: false,
    deferred: false,
    targetMessage: { id: "msg", content: "hi" },
    isMessageContextMenuCommand: () => true,
    client: {},
    async reply(payload: unknown) {
      this.replied = true;
      replies.push(payload);
      return {};
    },
    async editReply(payload: unknown) {
      replies.push(payload);
      return {};
    },
    async followUp(payload: unknown) {
      replies.push(payload);
      return {};
    },
    async deferReply() {
      this.deferred = true;
      return {};
    },
  };
  return { interaction, replies };
}

describe("userCommand", () => {
  it("serialises with ApplicationCommandType.User", () => {
    const cmd = userCommand({
      name: "Report",
      defaultMemberPermissions: PermissionFlagsBits.BanMembers,
      guildOnly: true,
      run: () => {},
    });
    const json = cmd.toJSON();
    expect(json.type).toBe(ApplicationCommandType.User);
    expect(json.name).toBe("Report");
    expect(json.default_member_permissions).toBe(String(PermissionFlagsBits.BanMembers));
    expect(json.contexts).toEqual([0]); // InteractionContextType.Guild = 0
    expect(cmd.kind).toBe("userMenu");
  });

  it("dispatches with a UserContextMenuContext exposing targetUser", async () => {
    let seen = "";
    const cmd = userCommand({
      name: "Echo",
      run: (ctx) => {
        seen = ctx.targetUser.id;
      },
    });
    const { interaction } = fakeUserCtx("Echo");
    const reg = new ContextMenuRegistry().add(cmd);
    await reg.handleUser(interaction as never);
    expect(seen).toBe("target");
  });
});

describe("messageCommand", () => {
  it("serialises with ApplicationCommandType.Message", () => {
    const cmd = messageCommand({ name: "Pin", run: () => {} });
    expect(cmd.toJSON().type).toBe(ApplicationCommandType.Message);
    expect(cmd.kind).toBe("messageMenu");
  });

  it("exposes targetMessage on the context", async () => {
    let seen = "";
    const cmd = messageCommand({
      name: "Inspect",
      run: (ctx) => {
        seen = ctx.targetMessage.content;
      },
    });
    const { interaction } = fakeMessageCtx("Inspect");
    const reg = new ContextMenuRegistry().add(cmd);
    await reg.handleMessage(interaction as never);
    expect(seen).toBe("hi");
  });
});

describe("ContextMenuRegistry", () => {
  it("counts, lists and serialises both kinds", () => {
    const reg = new ContextMenuRegistry().add(
      userCommand({ name: "A", run: () => {} }),
      messageCommand({ name: "B", run: () => {} }),
    );
    expect(reg.size).toBe(2);
    expect(reg.all().map((c) => c.kind).sort()).toEqual(["messageMenu", "userMenu"]);
    expect(reg.toJSON().map((c) => c.type).sort()).toEqual([
      ApplicationCommandType.User,
      ApplicationCommandType.Message,
    ].sort());
  });

  it("guards: denial replies with an embed and skips the handler", async () => {
    let ran = false;
    const cmd = userCommand({
      name: "Admin",
      guards: [requireOwner(["999"])],
      run: () => {
        ran = true;
      },
    });
    const reg = new ContextMenuRegistry().add(cmd);
    const { interaction, replies } = fakeUserCtx("Admin");
    await reg.handleUser(interaction as never);
    expect(ran).toBe(false);
    const payload = replies[0] as { embeds?: unknown[]; flags?: number };
    expect(payload.embeds).toBeDefined();
    expect((payload.flags ?? 0) & 64).toBe(64);
  });

  it("ignores unknown command names without throwing", async () => {
    const reg = new ContextMenuRegistry();
    const { interaction } = fakeUserCtx("missing");
    await expect(reg.handleUser(interaction as never)).resolves.toBeUndefined();
  });
});
