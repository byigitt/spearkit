import { describe, expect, it } from "vitest";
import { PermissionFlagsBits, PermissionsBitField } from "discord.js";
import type { GuildBasedChannel, GuildMember } from "discord.js";
import {
  botMissingPermissions,
  canActOn,
  compareRoles,
  formatPermissions,
  hasPermissions,
  missingPermissions,
  moderationCheck,
} from "../src/permissions.js";
interface FakeMember {
  id: string;
  user: { username: string };
  guild: { ownerId: string; members: { me: FakeMember | null } };
  roles: { highest: { position: number; comparePositionTo(o: { position: number }): number } };
  __perms?: PermissionsBitField;
}

function member(id: string, position: number, ownerId = "owner"): FakeMember {
  return {
    id,
    user: { username: id },
    guild: { ownerId, members: { me: null } },
    roles: {
      highest: {
        position,
        comparePositionTo(other) {
          return position - other.position;
        },
      },
    },
  };
}

function channel(me: FakeMember | null): GuildBasedChannel {
  return {
    guild: { members: { me } },
    permissionsFor(who: { __perms?: PermissionsBitField }) {
      return who.__perms ?? null;
    },
  } as unknown as GuildBasedChannel;
}

const M = (...flags: bigint[]): GuildMember => {
  const m = member("x", 1);
  m.__perms = new PermissionsBitField(flags);
  return m as unknown as GuildMember;
};

describe("missingPermissions", () => {
  it("returns only the absent permission names", () => {
    const who = M(PermissionFlagsBits.SendMessages);
    const missing = missingPermissions(channel(null), who, [
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.BanMembers,
    ]);
    expect(missing).toEqual(["BanMembers"]);
  });

  it("reports everything missing when permissions can't be resolved", () => {
    const who = member("x", 1) as unknown as GuildMember; // no __perms → permissionsFor null
    expect(missingPermissions(channel(null), who, [PermissionFlagsBits.BanMembers])).toEqual([
      "BanMembers",
    ]);
  });

  it("hasPermissions is true only when nothing is missing", () => {
    const who = M(PermissionFlagsBits.BanMembers);
    expect(hasPermissions(channel(null), who, PermissionFlagsBits.BanMembers)).toBe(true);
    expect(hasPermissions(channel(null), who, PermissionFlagsBits.KickMembers)).toBe(false);
  });
});

describe("botMissingPermissions", () => {
  it("uses guild.members.me", () => {
    const me = member("bot", 5);
    me.__perms = new PermissionsBitField([PermissionFlagsBits.ManageMessages]);
    expect(botMissingPermissions(channel(me), PermissionFlagsBits.ManageMessages)).toEqual([]);
    expect(botMissingPermissions(channel(me), PermissionFlagsBits.BanMembers)).toEqual(["BanMembers"]);
  });

  it("reports all missing when the bot member is unavailable", () => {
    expect(botMissingPermissions(channel(null), PermissionFlagsBits.BanMembers)).toEqual([
      "BanMembers",
    ]);
  });
});

describe("compareRoles / canActOn", () => {
  it("compares highest roles", () => {
    const a = member("a", 10) as unknown as GuildMember;
    const b = member("b", 4) as unknown as GuildMember;
    expect(compareRoles(a, b)).toBeGreaterThan(0);
    expect(compareRoles(b, a)).toBeLessThan(0);
  });

  it("blocks acting on self, owner, and equal/higher members", () => {
    const owner = "owner";
    const a = member("a", 5, owner) as unknown as GuildMember;
    const lower = member("b", 2, owner) as unknown as GuildMember;
    const higher = member("c", 9, owner) as unknown as GuildMember;
    const theOwner = member("owner", 1, owner) as unknown as GuildMember;
    expect(canActOn(a, a)).toBe(false);
    expect(canActOn(a, theOwner)).toBe(false);
    expect(canActOn(a, lower)).toBe(true);
    expect(canActOn(a, higher)).toBe(false);
  });

  it("lets the guild owner act regardless of role position", () => {
    const ownerActor = member("owner", 1, "owner") as unknown as GuildMember;
    const target = member("t", 99, "owner") as unknown as GuildMember;
    expect(canActOn(ownerActor, target)).toBe(true);
  });
});

describe("moderationCheck", () => {
  it("passes when moderator and bot both outrank the target", () => {
    const mod = member("mod", 8, "owner") as unknown as GuildMember;
    const target = member("t", 3, "owner") as unknown as GuildMember;
    const me = member("bot", 9, "owner") as unknown as GuildMember;
    expect(moderationCheck({ moderator: mod, target, me })).toEqual({ ok: true });
  });

  it("rejects self-targeting with the action verb", () => {
    const mod = member("mod", 8, "owner") as unknown as GuildMember;
    const result = moderationCheck({ moderator: mod, target: mod, action: "ban" });
    expect(result).toEqual({ ok: false, reason: "You can't ban yourself." });
  });

  it("rejects targeting the server owner", () => {
    const mod = member("mod", 8, "owner") as unknown as GuildMember;
    const owner = member("owner", 1, "owner") as unknown as GuildMember;
    const result = moderationCheck({ moderator: mod, target: owner, action: "kick", me: null });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/server owner/);
  });

  it("rejects when the moderator doesn't outrank the target", () => {
    const mod = member("mod", 3, "owner") as unknown as GuildMember;
    const target = member("t", 7, "owner") as unknown as GuildMember;
    const result = moderationCheck({ moderator: mod, target, me: null });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/above or equal to yours/);
  });

  it("rejects when the bot doesn't outrank the target", () => {
    const mod = member("mod", 9, "owner") as unknown as GuildMember;
    const target = member("t", 7, "owner") as unknown as GuildMember;
    const me = member("bot", 4, "owner") as unknown as GuildMember;
    const result = moderationCheck({ moderator: mod, target, me, action: "timeout" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/move my role above theirs/);
  });
});

describe("formatPermissions", () => {
  it("renders friendly labels", () => {
    expect(formatPermissions([PermissionFlagsBits.BanMembers, PermissionFlagsBits.ManageMessages])).toBe(
      "Ban Members, Manage Messages",
    );
  });
  it("renders 'none' for an empty set", () => {
    expect(formatPermissions([])).toBe("none");
  });
});
