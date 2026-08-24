/**
 * Compile-time assertions. This file is type-checked by `tsc` (it is part of
 * the tsconfig `include`) but is not run by vitest. If inference regresses,
 * the build fails here.
 */
import type { Attachment, User } from "discord.js";
import { command } from "../src/commands/command.js";
import { option } from "../src/commands/options.js";
import {
  button,
  checkbox,
  checkboxGroup,
  fileUpload,
  modal,
  radioGroup,
  stringSelectField,
  textInput,
  userSelectField,
} from "../src/components/builders.js";
import { createI18n } from "../src/i18n.js";

// --- i18n key inference ----------------------------------------------------

const translations = createI18n({
  defaultLocale: "en",
  messages: {
    en: { hello: "Hello", goodbye: "Goodbye" },
    tr: { hello: "Merhaba" },
  },
});
translations.t("en", "hello");
translations.t("tr", "goodbye"); // runtime fallback to default catalog
// @ts-expect-error unknown translation key
translations.t("en", "missing");

// --- slash command option inference ---------------------------------------

command({
  name: "echo",
  description: "Repeat",
  options: {
    msg: option.string({ description: "Text", required: true }),
    times: option.integer({ description: "Count", required: false }),
    pick: option.string({
      description: "Pick",
      choices: [
        { name: "A", value: "a" },
        { name: "B", value: "b" },
      ],
    }),
    who: option.user({ description: "User", required: true }),
  },
  run: (ctx) => {
    const msg: string = ctx.options.msg;
    const times: number | undefined = ctx.options.times;
    const pick: "a" | "b" | undefined = ctx.options.pick;
    const who: User = ctx.options.who;
    void msg;
    void times;
    void pick;
    void who;
    // @ts-expect-error optional option must be widened with undefined
    const wrongTimes: number = ctx.options.times;
    void wrongTimes;
    // @ts-expect-error choices narrow the value to the literal union
    const wrongPick: string = ctx.options.pick;
    void wrongPick;
    // @ts-expect-error option name does not exist
    void ctx.options.nope;
  },
});

// --- button param inference ------------------------------------------------

const vote = button({
  id: "vote:{choice}",
  run: (ctx) => {
    const choice: string = ctx.params.choice;
    void choice;
  },
});
vote.build({ choice: "yes" });
// @ts-expect-error build requires the choice param
vote.build();
// @ts-expect-error wrong param key
vote.build({ wrong: "x" });

const plain = button({ id: "plain", run: () => {} });
plain.build();
// @ts-expect-error a param-less button takes no build arguments
plain.build({ any: "x" });

// --- modal field + param inference -----------------------------------------

modal({
  id: "feedback:{ticket}",
  title: "Feedback",
  fields: {
    comment: textInput({ label: "Comment", style: "Paragraph" }),
    rating: textInput({ label: "Rating" }),
  },
  run: (ctx) => {
    const ticket: string = ctx.params.ticket;
    const comment: string = ctx.fields.comment;
    const rating: string = ctx.fields.rating;
    void ticket;
    void comment;
    void rating;
    // @ts-expect-error field name does not exist
    void ctx.fields.missing;
  },
});

// --- modal field + param inference (Label fields) --------------------------

const report = modal({
  id: "report:{userId}",
  title: "Report",
  fields: {
    reason: textInput({ label: "Why", style: "Paragraph", required: true }),
    kind: radioGroup({
      label: "Type",
      options: [
        { label: "Spam", value: "spam" },
        { label: "Abuse", value: "abuse" },
      ],
    }),
    optionalKind: radioGroup({
      label: "Opt",
      required: false,
      options: [{ label: "A", value: "a" }],
    }),
    extras: checkboxGroup({
      label: "Also",
      options: [
        { label: "Ban", value: "ban" },
        { label: "Delete", value: "delete" },
      ],
    }),
    agree: checkbox({ label: "I understand" }),
    proof: fileUpload({ label: "Screenshots" }),
    channel: stringSelectField({
      label: "Channel",
      options: [{ label: "General", value: "general" }],
    }),
    target: userSelectField({ label: "User" }),
  },
  run: (ctx) => {
    const reason: string = ctx.fields.reason;
    const kind: "spam" | "abuse" = ctx.fields.kind;
    const optionalKind: "a" | undefined = ctx.fields.optionalKind;
    const extras: ("ban" | "delete")[] = ctx.fields.extras;
    const agree: boolean = ctx.fields.agree;
    const proof: Attachment[] = ctx.fields.proof;
    const channel: string[] = ctx.fields.channel;
    const target: string[] = ctx.fields.target;
    void reason;
    void kind;
    void optionalKind;
    void extras;
    void agree;
    void proof;
    void channel;
    void target;
    // @ts-expect-error field name does not exist
    void ctx.fields.missing;
  },
});
report.build({ userId: "u1" });
// @ts-expect-error build requires the userId param
report.build();

export {};
