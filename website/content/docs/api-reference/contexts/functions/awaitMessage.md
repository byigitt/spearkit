---
title: "awaitMessage()"
description: "Wait for the next message in channel that matches filter, resolving to the Message or null if none arrives before time elapses."
---

> **awaitMessage**(`channel`, `options?`): `Promise`\<`Message`\<`boolean`\> \| `null`\>

Defined in: [src/collectors.ts:53](https://github.com/byigitt/spearkit/blob/main/src/collectors.ts#L53)

Wait for the next message in `channel` that matches `filter`, resolving to the
`Message` or `null` if none arrives before `time` elapses.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `channel` | [`CollectableChannel`](../type-aliases/CollectableChannel) |
| `options` | [`AwaitMessageOptions`](../interfaces/AwaitMessageOptions) |

## Returns

`Promise`\<`Message`\<`boolean`\> \| `null`\>
