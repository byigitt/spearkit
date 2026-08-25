---
title: "formatDuration()"
description: "Format a millisecond duration into human-readable text."
---

> **formatDuration**(`ms`, `options?`): `string`

Defined in: [src/format.ts:87](https://github.com/byigitt/spearkit/blob/main/src/format.ts#L87)

Format a millisecond duration into human-readable text.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `ms` | `number` |
| `options` | [`FormatDurationOptions`](../interfaces/FormatDurationOptions) |

## Returns

`string`

## Example

```ts
formatDuration(3_725_000);                         // "1 hour 2 minutes"
formatDuration(3_725_000, { locale: "tr" });       // "1 saat 2 dakika"
formatDuration(86_400_000 * 9, { largest: 3 });    // "1 week 2 days"
```
