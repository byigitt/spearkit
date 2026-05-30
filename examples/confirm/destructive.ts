/**
 * Confirmation prompt for a destructive action.
 */
import { command, confirm, option } from "spearkit";

export const purge = command({
  name: "purge",
  description: "Delete N recent messages",
  options: {
    count: option.integer({ description: "How many", required: true, minValue: 1, maxValue: 100 }),
  },
  run: async (ctx) => {
    const result = await confirm(ctx.interaction, {
      title: "Purge confirmation",
      body: `Delete the last **${ctx.options.count}** messages?`,
      confirm: { label: "Delete", style: "Danger" },
      cancel: { label: "Keep", style: "Secondary" },
      timeoutMs: 20_000,
    });
    if (!result.confirmed) {
      await ctx.info(result.reason === "timeout" ? "Timed out." : "Cancelled.");
      return;
    }
    // …perform the destructive action here…
    await ctx.success(`Deleted ${ctx.options.count} messages.`);
  },
});
