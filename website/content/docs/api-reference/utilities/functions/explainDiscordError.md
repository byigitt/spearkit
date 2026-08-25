---
title: "explainDiscordError()"
description: "Render an end-user-appropriate sentence for a Discord error, or null if the error isn't a recognised, explainable Discord failure (in which case you should fall back to a generic \"something went wrong\" message and log it)."
---

```ts
function explainDiscordError(error: unknown): string | null;
```

Defined in: [src/discord-errors.ts:129](https://github.com/byigitt/spearkit/blob/main/src/discord-errors.ts#L129)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |

## Returns

`string` \| `null`

## Example

```ts
catch (err) { await ctx.error(explainDiscordError(err) ?? "Something went wrong."); }
```
