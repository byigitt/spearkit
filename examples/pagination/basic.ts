/**
 * Paginated /members listing — 10 per page, only the invoking user can click.
 */
import { EmbedBuilder, command, paginate } from "spearkit";

export const members = command({
  name: "members",
  description: "Paginated guild member listing",
  run: async (ctx) => {
    if (ctx.guild === null) {
      await ctx.error("Server-only.");
      return;
    }
    await ctx.defer();
    const memberList = [...ctx.guild.members.cache.values()].map((m) => m.user.tag);
    await paginate(ctx.interaction, memberList, {
      pageSize: 10,
      render: (slice, { page, pages }) =>
        new EmbedBuilder()
          .setTitle(`Members — page ${page + 1} / ${pages}`)
          .setDescription(slice.join("\n") || "(empty)")
          .setColor(0x3498db),
      controls: "first-prev-next-last",
      timeoutMs: 5 * 60_000,
    });
  },
});
