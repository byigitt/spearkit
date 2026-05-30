/**
 * Plugins — bundle related commands/events/components into a reusable unit.
 *
 * `definePlugin` types the object; `setup(client)` registers the feature's
 * pieces and may be async.
 */
import { button, command, definePlugin, event, option, row } from "spearkit";

export const moderation = definePlugin({
  name: "moderation",
  setup(client) {
    const confirmKick = button({
      id: "kick:{userId}",
      label: "Confirm kick",
      style: "Danger",
      run: (ctx) => ctx.update(`Kicked <@${ctx.params.userId}> (demo).`), // userId: string
    });

    const warn = command({
      name: "warn",
      description: "Warn a member",
      options: {
        member: option.user({ description: "Member", required: true }),
        reason: option.string({ description: "Reason" }),
      },
      run: (ctx) =>
        ctx.reply({
          content: `Warning ${ctx.options.member.tag}: ${ctx.options.reason ?? "no reason given"}`,
          components: [row(confirmKick.build({ userId: ctx.options.member.id }))],
          ephemeral: true,
        }),
    });

    const ready = event("clientReady", (c) => console.log(`[moderation] ready on ${c.user.tag}`));

    client.register(warn, confirmKick, ready);
  },
});

// A plugin with async setup — await anything you need before registering.
export const tags = definePlugin({
  name: "tags",
  async setup(client) {
    const store = await Promise.resolve(new Map<string, string>([["hello", "Hi there!"]]));
    client.register(
      command({
        name: "tag",
        description: "Show a saved tag",
        options: { name: option.string({ description: "Tag name", required: true }) },
        run: (ctx) => ctx.reply(store.get(ctx.options.name) ?? "No such tag."),
      }),
    );
  },
});
