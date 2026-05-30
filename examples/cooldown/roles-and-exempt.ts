/**
 * Cooldown — exemptions and per-role overrides.
 *
 * - Everyone waits 10s.
 * - Members with the "VIP" role only wait 2s (override).
 * - Members with the "Moderator" role never wait (exempt).
 */
import { command } from "spearkit";

const MOD_ROLE = "111111111111111111";
const VIP_ROLE = "222222222222222222";

export const search = command({
  name: "search",
  description: "Search the archive",
  cooldown: {
    duration: 10_000,
    scope: "user",
    exempt: { roles: [MOD_ROLE] },
    overrides: { roles: { [VIP_ROLE]: 2_000 } },
    message: (ms) => `Easy there — ${Math.ceil(ms / 1000)}s left.`,
  },
  run: (ctx) => ctx.reply("Searching the archive…"),
});
