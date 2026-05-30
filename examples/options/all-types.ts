/**
 * Options — every option type in one command.
 *
 * Each value is fully typed in the handler (shown in the inline comments).
 * Optional options resolve to `value | undefined`.
 */
import { command, option } from "spearkit";

export const everything = command({
  name: "everything",
  description: "Demonstrate every option type",
  options: {
    text: option.string({ description: "A string", required: true }),
    count: option.integer({ description: "An integer", required: true }),
    ratio: option.number({ description: "A float", required: true }),
    flag: option.boolean({ description: "A boolean", required: true }),
    member: option.user({ description: "A user", required: true }),
    where: option.channel({ description: "A channel", required: true }),
    rank: option.role({ description: "A role", required: true }),
    target: option.mentionable({ description: "A user or role", required: true }),
    file: option.attachment({ description: "A file", required: true }),
  },
  run: (ctx) => {
    const o = ctx.options;
    const text: string = o.text;
    const count: number = o.count;
    const ratio: number = o.ratio;
    const flag: boolean = o.flag;
    // o.member: User, o.where: channel, o.rank: Role, o.target: user/role, o.file: Attachment
    return ctx.reply({
      content: [
        `text=${text}`,
        `count=${count}`,
        `ratio=${ratio}`,
        `flag=${flag}`,
        `member=${o.member.tag}`,
        `channel=${o.where.id}`,
        `role=${o.rank.id}`,
        `file=${o.file.name}`,
      ].join(" "),
      ephemeral: true,
    });
  },
});
