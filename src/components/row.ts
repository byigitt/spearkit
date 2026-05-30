import { ActionRowBuilder, type MessageActionRowComponentBuilder } from "discord.js";

/**
 * Wrap one or more component builders in an action row.
 *
 * A row holds up to five buttons, or exactly one select menu.
 *
 * @example
 * ```ts
 * const components = [row(yes.build(), no.build())];
 * await channel.send({ content: "Vote:", components });
 * ```
 */
export function row<C extends MessageActionRowComponentBuilder>(
  ...components: C[]
): ActionRowBuilder<C> {
  return new ActionRowBuilder<C>().addComponents(...components);
}
