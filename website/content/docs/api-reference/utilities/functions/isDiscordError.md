---
title: "isDiscordError()"
description: "Narrow an unknown thrown value to a DiscordAPIError. Pass a code (or several) to also assert the specific failure — ideal for \"ignore this one error, re-throw the rest\" recovery."
---

```ts
function isDiscordError(error: unknown, code?: string | number | readonly (string | number)[]): error is DiscordAPIError;
```

Defined in: [src/discord-errors.ts:78](https://github.com/byigitt/spearkit/blob/main/src/discord-errors.ts#L78)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |
| `code?` | `string` \| `number` \| readonly (`string` \| `number`)[] |

## Returns

`error is DiscordAPIError`

## Example

```ts
if (isDiscordError(err, [DiscordErrorCode.UnknownMessage, DiscordErrorCode.UnknownChannel])) return;
```
