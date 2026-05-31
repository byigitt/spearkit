# Collectors

discord.js collectors are powerful but fiddly: you wire an event emitter, set a
`time`, write a `filter`, remember that dismissed modals need their own timeout,
and translate the "timed out" rejection into something you can branch on.
spearkit collapses the common cases to a single `await` that resolves to the
result — or `null` on timeout.

Beyond these, see the [pagination and confirm helpers](./api-reference.md#pagination--confirmation)
for ready-made paged lists and yes/no gates.

## Wait for a message ("type your answer")

`ctx.awaitMessageFrom(userId?, options?)` waits for the next message in the
current channel from a user (defaults to the invoking user):

```ts
await ctx.reply("What's your favourite colour?");
const answer = await ctx.awaitMessageFrom(ctx.user.id, { time: 30_000 });
if (answer === null) return ctx.followUp("Timed out.");
await ctx.followUp(`Nice — ${answer.content}!`);
```

The standalone `awaitMessage(channel, options)` does the same for any text
channel; `options` takes `{ filter, time }` (default `time` 60s).

## Wait for a modal submission

`ctx.awaitModal(modal, options?)` (on command and component contexts) shows a
modal and waits for the submission — scoped to the same user and that modal's
custom-id, always bounded — sidestepping the "Unknown interaction after a
cancelled modal" trap:

```ts
import { modal, textInput } from "spearkit";

const form = modal({
  id: "feedback",
  title: "Feedback",
  fields: { text: textInput({ label: "Your feedback", required: true }) },
  run: (ctx) => ctx.replyEphemeral("thanks"), // routed fallback
});

const submitted = await ctx.awaitModal(form.build(), { time: 120_000 });
if (submitted === null) return; // dismissed or timed out
await submitted.reply({ content: submitted.fields.getTextInputValue("text"), ephemeral: true });
```

This is the inline alternative to registering a separate modal handler and
threading state through its custom-id.

## Wait for a component click

`awaitComponent(message, options)` waits for the next button/select interaction
on a message. `options` takes `{ filter, time, componentType }`. You must still
acknowledge the returned interaction (`update`/`deferUpdate`/`reply`):

```ts
import { awaitComponent } from "spearkit";

const sent = await ctx.channel!.send({ content: "Pick one", components: [row] });
const click = await awaitComponent(sent, { time: 15_000 });
if (click === null) return;
await click.update("Got it!");
```
