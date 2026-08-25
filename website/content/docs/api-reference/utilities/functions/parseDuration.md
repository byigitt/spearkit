---
title: "parseDuration()"
description: "Parse a human duration like \"1h30m\", \"2 days\", \"1 saat 30 dakika\" or \"5000ms\" into milliseconds. Returns null if nothing parseable was found."
---

> **parseDuration**(`input`): `number` \| `null`

Defined in: [src/format.ts:150](https://github.com/byigitt/spearkit/blob/main/src/format.ts#L150)

Parse a human duration like `"1h30m"`, `"2 days"`, `"1 saat 30 dakika"` or
`"5000ms"` into milliseconds. Returns `null` if nothing parseable was found.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `string` |

## Returns

`number` \| `null`

## Example

```ts
parseDuration("1h30m");      // 5_400_000
parseDuration("1 saat");     // 3_600_000
parseDuration("oops");       // null
```
