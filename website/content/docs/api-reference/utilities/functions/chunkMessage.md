---
title: "chunkMessage()"
description: "Split text into chunks that each fit within Discord's per-message limit, breaking on line boundaries (and word boundaries for over-long lines) so you never silently lose the tail of a long reply."
---

```ts
function chunkMessage(text: string, options?: ChunkOptions): string[];
```

Defined in: [src/format.ts:242](https://github.com/byigitt/spearkit/blob/main/src/format.ts#L242)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |
| `options` | [`ChunkOptions`](../interfaces/ChunkOptions) |

## Returns

`string`[]

## Example

```ts
for (const part of chunkMessage(hugeLog)) await ctx.followUp(part);
```
