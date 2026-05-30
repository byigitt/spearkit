/**
 * Options — value/length constraints and channel-type filters.
 */
import { ChannelType, command, option } from "spearkit";

export const configure = command({
  name: "configure",
  description: "Constrained options",
  options: {
    // numeric bounds
    volume: option.integer({ description: "0-100", required: true, minValue: 0, maxValue: 100 }),
    // string length bounds
    code: option.string({ description: "4-8 chars", required: true, minLength: 4, maxLength: 8 }),
    // restrict selectable channel types
    logChannel: option.channel({
      description: "A text or announcement channel",
      required: true,
      channelTypes: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
    }),
  },
  run: (ctx) =>
    ctx.reply({
      content: `volume=${ctx.options.volume} code=${ctx.options.code} channel=${ctx.options.logChannel.id}`,
      ephemeral: true,
    }),
});
