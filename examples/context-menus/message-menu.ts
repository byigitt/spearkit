/**
 * Message-target context-menu command: appears in Apps → right-click a message.
 * ctx.targetMessage is the message the menu was invoked on.
 */
import { messageCommand } from "spearkit";

export const inspectMessage = messageCommand({
  name: "Inspect message",
  run: (ctx) =>
    ctx.info(
      {
        title: "Message details",
        description: ctx.targetMessage.content.slice(0, 200),
        fields: [
          { name: "Author", value: ctx.targetMessage.author.tag, inline: true },
          { name: "Id", value: ctx.targetMessage.id, inline: true },
          { name: "Length", value: String(ctx.targetMessage.content.length), inline: true },
        ],
      },
      { ephemeral: true },
    ),
});
