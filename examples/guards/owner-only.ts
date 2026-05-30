/**
 * Owner-only guard — pin a command to specific user ids (you, your co-maintainer).
 */
import { command, requireOwner } from "spearkit";

const OWNERS = ["123456789012345678", "234567890123456789"];

export const evalCommand = command({
  name: "eval",
  description: "Evaluate code (owner-only)",
  guards: [requireOwner(OWNERS, "Owner-only.")],
  run: async (ctx) => {
    await ctx.replyInfo("Running…");
  },
});
