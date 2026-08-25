---
title: "EventHandler\\<E\\>"
description: "A typed handler for a discord.js client event."
---

> **EventHandler**\<`E`\> = (...`args`) => `Awaitable`\<`void`\>

Defined in: [src/events.ts:4](https://github.com/byigitt/spearkit/blob/main/src/events.ts#L4)

A typed handler for a discord.js client event.

## Type Parameters

| Type Parameter |
| :------ |
| `E` *extends* keyof `ClientEvents` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| ...`args` | `ClientEvents`\[`E`\] |

## Returns

`Awaitable`\<`void`\>
