/**
 * Per-command guards — composed left-to-right. spearkit replies with a red
 * error embed (using the configured `message`) on denial.
 */
import {
  PermissionFlagsBits,
  command,
  guard,
  guildOnly,
  option,
  requireAnyRole,
  requireUserPermissions,
} from "spearkit";

export const ban = command({
  name: "ban",
  description: "Ban a user",
  guards: [
    guildOnly("Only usable inside a server."),
    requireUserPermissions(PermissionFlagsBits.BanMembers, "You need Ban Members."),
    requireAnyRole(["111111111111111111", "222222222222222222"], "Mods/Admins only."),
    // Inline custom predicate — useful for one-off checks.
    guard((ctx) => ctx.channelId !== "111222333444555666" || { allowed: false, reason: "Not in #lobby." }),
  ],
  options: { target: option.user({ description: "User to ban", required: true }) },
  run: (ctx) => ctx.success(`Banned ${ctx.options.target.tag}.`),
});
