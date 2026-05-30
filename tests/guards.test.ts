import { PermissionsBitField, PermissionFlagsBits } from "discord.js";
import { describe, expect, it } from "vitest";
import {
  denied,
  dmOnly,
  guard,
  guildOnly,
  requireAllRoles,
  requireAnyRole,
  requireOwner,
  requireUserPermissions,
  runGuards,
  type GuardContext,
} from "../src/guards.js";
import { CommandRegistry } from "../src/commands/registry.js";
import { command } from "../src/commands/command.js";
import { fakeChatInput } from "./helpers.js";

function ctx(overrides: Partial<GuardContext> = {}): GuardContext {
  return {
    client: {} as never,
    user: { id: "u1" } as never,
    member: null,
    guild: null,
    guildId: null,
    channelId: null,
    ...overrides,
  };
}

describe("runGuards + denied", () => {
  it("passes when every guard returns true", async () => {
    const out = await runGuards(ctx(), [() => true, async () => true]);
    expect(out).toEqual({ allowed: true });
  });

  it("short-circuits on the first denial and carries the reason", async () => {
    let secondRan = false;
    const out = await runGuards(ctx(), [
      () => denied("nope"),
      () => {
        secondRan = true;
        return true;
      },
    ]);
    expect(out).toEqual({ allowed: false, reason: "nope" });
    expect(secondRan).toBe(false);
  });

  it("treats a bare false as a denial without reason", async () => {
    const out = await runGuards(ctx(), [() => false]);
    expect(out).toEqual({ allowed: false, reason: undefined });
  });
});

describe("built-in predicates", () => {
  it("guildOnly / dmOnly", async () => {
    expect(await guildOnly()(ctx({ guildId: "g" }))).toBe(true);
    expect(await guildOnly()(ctx({ guildId: null }))).toEqual({ allowed: false, reason: expect.any(String) });
    expect(await dmOnly()(ctx({ guildId: null }))).toBe(true);
    expect(await dmOnly()(ctx({ guildId: "g" }))).toEqual({ allowed: false, reason: expect.any(String) });
  });

  it("requireAnyRole reads array-shaped roles (APIInteractionGuildMember)", async () => {
    const member = { roles: ["r1", "r2"], permissions: "0" } as never;
    expect(await requireAnyRole(["r2", "r3"])(ctx({ member }))).toBe(true);
    expect(await requireAnyRole(["r9"])(ctx({ member }))).toMatchObject({ allowed: false });
  });

  it("requireAnyRole reads cache-shaped roles (GuildMember)", async () => {
    const member = { roles: { cache: new Map([["r5", {}]]) }, permissions: "0" } as never;
    expect(await requireAnyRole(["r5"])(ctx({ member }))).toBe(true);
  });

  it("requireAllRoles", async () => {
    const member = { roles: ["r1", "r2", "r3"], permissions: "0" } as never;
    expect(await requireAllRoles(["r1", "r2"])(ctx({ member }))).toBe(true);
    expect(await requireAllRoles(["r1", "r9"])(ctx({ member }))).toMatchObject({ allowed: false });
  });

  it("requireOwner", async () => {
    expect(await requireOwner(["u1"])(ctx({ user: { id: "u1" } as never }))).toBe(true);
    expect(await requireOwner(["u9"])(ctx({ user: { id: "u1" } as never }))).toMatchObject({ allowed: false });
  });

  it("requireUserPermissions with PermissionsBitField and string permissions", async () => {
    const bf = new PermissionsBitField(PermissionFlagsBits.BanMembers);
    expect(
      await requireUserPermissions(PermissionFlagsBits.BanMembers)(
        ctx({ member: { permissions: bf, roles: [] } as never }),
      ),
    ).toBe(true);
    const stringPerms = String(PermissionFlagsBits.BanMembers);
    expect(
      await requireUserPermissions(PermissionFlagsBits.BanMembers)(
        ctx({ member: { permissions: stringPerms, roles: [] } as never }),
      ),
    ).toBe(true);
    expect(
      await requireUserPermissions(PermissionFlagsBits.Administrator)(
        ctx({ member: { permissions: stringPerms, roles: [] } as never }),
      ),
    ).toMatchObject({ allowed: false });
  });

  it("guard() is identity sugar", async () => {
    const g = guard((c) => (c.user.id === "ok" ? true : denied("no")));
    expect(await g(ctx({ user: { id: "ok" } as never }))).toBe(true);
    expect(await g(ctx({ user: { id: "x" } as never }))).toMatchObject({ allowed: false });
  });
});

describe("CommandRegistry enforces guards", () => {
  it("denies → ephemeral error embed reply, handler does not run", async () => {
    let ran = false;
    const reg = new CommandRegistry().add(
      command({
        name: "admin",
        description: "d",
        guards: [requireOwner(["999"])],
        run: () => {
          ran = true;
        },
      }),
    );
    const { interaction, capture } = fakeChatInput({ commandName: "admin" });
    await reg.handle(interaction);
    expect(ran).toBe(false);
    expect(capture.replies).toHaveLength(1);
    const payload = capture.replies[0] as { embeds?: unknown[]; flags?: number };
    expect(payload.embeds).toBeDefined();
    expect((payload.flags ?? 0) & 64).toBe(64);
  });

  it("passes → handler runs", async () => {
    let ran = false;
    const reg = new CommandRegistry().add(
      command({
        name: "ok",
        description: "d",
        guards: [() => true],
        run: () => {
          ran = true;
        },
      }),
    );
    const { interaction } = fakeChatInput({ commandName: "ok" });
    await reg.handle(interaction);
    expect(ran).toBe(true);
  });

  it("default guards run before command-specific guards and can deny first", async () => {
    let commandGuardRan = false;
    const reg = new CommandRegistry()
      .setDefaultGuards([() => denied("server-only")])
      .add(
        command({
          name: "x",
          description: "d",
          guards: [
            () => {
              commandGuardRan = true;
              return true;
            },
          ],
          run: () => {},
        }),
      );
    const { interaction, capture } = fakeChatInput({ commandName: "x" });
    await reg.handle(interaction);
    expect(commandGuardRan).toBe(false);
    const payload = capture.replies[0] as { embeds?: { toJSON(): { description?: string } }[] };
    expect(payload.embeds?.[0]?.toJSON().description).toMatch(/server-only/);
  });
});
