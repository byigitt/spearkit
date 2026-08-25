---
title: "truncate()"
description: "Truncate text to at most max characters, appending suffix (default …) when it had to cut. The result — suffix included — never exceeds max."
---

```ts
function truncate(
   text: string, 
   max: number, 
   suffix?: string): string;
```

Defined in: [src/format.ts:206](https://github.com/byigitt/spearkit/blob/main/src/format.ts#L206)

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `text` | `string` | `undefined` |
| `max` | `number` | `undefined` |
| `suffix` | `string` | `"…"` |

## Returns

`string`

## Example

```ts
truncate("a very long reason", 10); // → "a very lo…"
```
