---
title: "discordTimestamp()"
description: "Render a Discord-flavoured timestamp tag (<t:1234:R>)."
---

```ts
function discordTimestamp(date: number | Date, style?: DiscordTimestampStyle): string;
```

Defined in: [src/format.ts:185](https://github.com/byigitt/spearkit/blob/main/src/format.ts#L185)

Styles: `t` short time, `T` long time, `d` short date, `D` long date,
`f` short date/time (default), `F` long date/time, `R` relative.

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `date` | `number` \| `Date` | `undefined` |
| `style` | [`DiscordTimestampStyle`](../type-aliases/DiscordTimestampStyle) | `"f"` |

## Returns

`string`

## Example

```ts
discordTimestamp(date);                  // <t:1234:f>
discordTimestamp(date, "R");              // <t:1234:R>
discordTimestamp(Date.now() + 60_000, "R"); // <t:..:R>
```
