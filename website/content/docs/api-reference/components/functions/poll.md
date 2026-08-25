---
title: "poll()"
description: "Build a Discord poll payload with readable names and early validation."
---

```ts
function poll(config: PollConfig): PollData;
```

Defined in: [src/poll.ts:50](https://github.com/byigitt/spearkit/blob/main/src/poll.ts#L50)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`PollConfig`](../interfaces/PollConfig) |

## Returns

`PollData`

## Example

```ts
await ctx.reply({
  poll: poll({
    question: "Ship it?",
    answers: [{ text: "Yes", emoji: "✅" }, "Not yet"],
    durationHours: 6,
  }),
});
```
