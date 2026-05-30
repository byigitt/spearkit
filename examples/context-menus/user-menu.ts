/**
 * User-target context-menu command: appears in Apps → right-click a user.
 * ctx.targetUser is the user the menu was invoked on (typed).
 */
import { userCommand, PermissionFlagsBits, requireUserPermissions } from "spearkit";

export const reportUser = userCommand({
  name: "Report user",
  defaultMemberPermissions: PermissionFlagsBits.SendMessages, // who *sees* it
  guards: [requireUserPermissions(PermissionFlagsBits.SendMessages)],
  cooldown: 10_000,
  run: (ctx) =>
    ctx.success(`Report received for **${ctx.targetUser.tag}**. Mods will review.`, {
      ephemeral: true,
    }),
});
