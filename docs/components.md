# Components

Buttons, select menus and modals in spearkit follow one pattern: define the
appearance, the **custom-id pattern**, and the handler in one place; register
it; then `build()` the discord.js component to put in a message. spearkit decodes
incoming interactions and routes them to your handler — no `interactionCreate`
switch statements, no manual custom-id parsing.

```ts
import { button, row } from "spearkit";

const vote = button({
  id: "vote:{choice}",
  label: "Yes",
  style: "Success",
  run: (ctx) => ctx.update(`You chose ${ctx.params.choice}`), // ctx.params.choice: string
});

client.register(vote); // or client.components.add(vote)

await channel.send({
  content: "Cast your vote:",
  components: [row(vote.build({ choice: "yes" }))], // build() requires { choice }
});
```

## Custom-id patterns

The `id` is a pattern with the grammar `name` or `name:{param}` or
`name:{a}:{b}`. The leading `name` is the routing **namespace**; each `{param}`
becomes a positional value carried in the custom-id.

- In the handler, params are available as a typed object: `ctx.params.choice`.
- `build(params)` requires **exactly** those params and encodes them into the
  custom-id.

```ts
const page = button({
  id: "page:{id}:{dir}",
  label: "Next",
  run: (ctx) => ctx.update(`item ${ctx.params.id}, going ${ctx.params.dir}`),
});

page.build({ id: "42", dir: "next" }); // custom-id "page:42:next"
```

spearkit percent-escapes param values, so they may safely contain `:`. Custom-ids
are limited to 100 characters (`MAX_CUSTOM_ID_LENGTH`); `build()` throws if you
exceed it.

For advanced use, the codec is exported directly: `compilePattern`,
`buildCustomId`, `parseCustomId`, and `paramsFromValues`.

## Buttons

```ts
import { button, linkButton, ButtonStyle } from "spearkit";

const confirm = button({
  id: "confirm:{action}",
  label: "Confirm",
  style: ButtonStyle.Danger,     // or the string "Danger"
  emoji: "⚠️",
  disabled: false,
  run: (ctx) => ctx.update(`Confirmed: ${ctx.params.action}`),
});

// Link buttons have no handler and no custom-id:
const docs = linkButton({ url: "https://example.com", label: "Docs" });
```

`style` accepts the string names `"Primary"`, `"Secondary"`, `"Success"`,
`"Danger"`, or the `ButtonStyle` enum. It defaults to `"Secondary"`.

All component builders (`button`, the five selects, and `modal`) also accept
`guards?: readonly Guard[]` — preconditions evaluated before the handler runs.
See [Guards](./guards.md).

The `ButtonContext` adds, on top of the shared [reply helpers](./context.md):

| Member | Description |
| ------ | ----------- |
| `ctx.params` | Decoded custom-id params. |
| `ctx.update(input)` | Edit the message the button is on. |
| `ctx.deferUpdate()` | Acknowledge without editing yet. |
| `ctx.showModal(modal)` | Open a modal in response. |
| `ctx.message` | The message the button belongs to. |
| `ctx.customId` | The raw custom-id. |

## Select menus

There are five select builders. All share `placeholder`, `minValues`,
`maxValues`, and `disabled`; the string select additionally takes `options`,
and the channel select takes `channelTypes`.

```ts
import { stringSelect, channelSelect, ChannelType } from "spearkit";

const colour = stringSelect({
  id: "colour",
  placeholder: "Pick a colour",
  minValues: 1,
  maxValues: 1,
  options: [
    { label: "Red", value: "red" },
    { label: "Green", value: "green", description: "the calm one" },
    { label: "Blue", value: "blue", default: true },
  ],
  run: (ctx) => ctx.reply({ content: `You picked ${ctx.values.join(", ")}`, ephemeral: true }),
});

const pickChannel = channelSelect({
  id: "pick-channel",
  channelTypes: [ChannelType.GuildText],
  run: (ctx) => ctx.reply({ content: `${ctx.values.length} channel(s)`, ephemeral: true }),
});
```

Each select context exposes the relevant resolved data:

| Builder | Context | Extra accessors |
| ------- | ------- | --------------- |
| `stringSelect` | `StringSelectContext` | `values: string[]`, `value: string \| undefined` |
| `userSelect` | `UserSelectContext` | `values`, `users`, `members` |
| `roleSelect` | `RoleSelectContext` | `values`, `roles` |
| `channelSelect` | `ChannelSelectContext` | `values`, `channels` |
| `mentionableSelect` | `MentionableSelectContext` | `values`, `users`, `roles`, `members` |

Select contexts also have `ctx.params`, `ctx.update`, `ctx.deferUpdate`,
`ctx.showModal`, and the shared reply helpers.

## Modals

A modal declares its `fields` as a map of name → `textInput`. The submit handler
receives the submitted values in `ctx.fields`, keyed (and typed) by those names,
plus any custom-id params in `ctx.params`.

```ts
import { modal, textInput } from "spearkit";

const feedback = modal({
  id: "feedback:{ticket}",
  title: "Feedback",
  fields: {
    summary: textInput({ label: "Summary", required: true }),
    detail: textInput({ label: "Details", style: "Paragraph", maxLength: 2000 }),
  },
  run: (ctx) =>
    ctx.reply({
      // ctx.params.ticket: string, ctx.fields.summary / ctx.fields.detail: string
      content: `#${ctx.params.ticket}: ${ctx.fields.summary}`,
      ephemeral: true,
    }),
});
```

`textInput` config: `label` (required), `style` (`"Short"` default, or
`"Paragraph"`, or a `TextInputStyle`), `placeholder`, `required`, `minLength`,
`maxLength`, `value`.

Open a modal from a command or a component handler with `showModal` — modals
cannot be the *response* to another modal, but they can follow a command or a
button/select:

```ts
import { command } from "spearkit";

const ask = command({
  name: "ask",
  description: "Open the feedback form",
  run: (ctx) => ctx.showModal(feedback.build({ ticket: "1234" })),
});
```

## Action rows

`row(...components)` wraps builders in an `ActionRowBuilder`. A row holds up to
five buttons, or exactly one select menu.

```ts
import { row } from "spearkit";

const components = [
  row(confirm.build({ action: "delete" }), docs),
  row(colour.build()),
];
await channel.send({ content: "Choose:", components });
```

## Registering and routing

Register components like anything else:

```ts
client.register(vote, colour, feedback);
// equivalently:
client.components.add(vote, colour, feedback);
```

`SpearClient` routes every button, select and modal interaction to the matching
namespace automatically. The `ComponentRegistry` API:

| Member | Description |
| ------ | ----------- |
| `add(...defs)` | Register components (override by namespace). |
| `size` | Number registered. |
| `onError(handler)` | Set the error handler. |
| `handle(interaction)` | Route an interaction; returns `true` if matched. |
| `setDefaultGuards(guards)` | Guards run before each component's own guards. |

`setLogger` and `setUsageHook` also exist; the client wires all three for you.

### Error handling

By default a throwing handler emits the client `error` event and replies with an
ephemeral message. Customise it:

```ts
client.components.onError((error, interaction) => {
  console.error("component failed", error);
});
```

## End-to-end example

```ts
import {
  SpearClient,
  Intents,
  command,
  button,
  stringSelect,
  modal,
  textInput,
  row,
} from "spearkit";

const client = new SpearClient({ intents: Intents.default });

const open = button({
  id: "open-form:{topic}",
  label: "Open form",
  style: "Primary",
  run: (ctx) => ctx.showModal(form.build({ topic: ctx.params.topic })),
});

const rating = stringSelect({
  id: "rating",
  placeholder: "Rate us",
  options: [
    { label: "Good", value: "good" },
    { label: "Bad", value: "bad" },
  ],
  run: (ctx) => ctx.reply({ content: `Thanks: ${ctx.value}`, ephemeral: true }),
});

const form = modal({
  id: "form:{topic}",
  title: "Tell us more",
  fields: { body: textInput({ label: "Message", style: "Paragraph", required: true }) },
  run: (ctx) => ctx.reply({ content: `[${ctx.params.topic}] ${ctx.fields.body}`, ephemeral: true }),
});

const panel = command({
  name: "panel",
  description: "Show the panel",
  run: (ctx) =>
    ctx.reply({
      content: "How was it?",
      components: [row(open.build({ topic: "support" })), row(rating.build())],
    }),
});

client.register(panel, open, rating, form);
```

## See also

- [Commands](./commands.md) — opening components from commands.
- [Contexts](./context.md) — the reply/update helpers contexts share.
- [Client](./client.md) — registration and routing.
