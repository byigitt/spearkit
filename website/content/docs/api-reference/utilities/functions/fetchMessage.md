---
title: "fetchMessage()"
description: "Resolve a message id in a given channel's messages manager."
---

> **fetchMessage**(`messages`, `messageId`, `options?`): `Promise`\<`Message`\<`boolean`\> \| `null`\>

Defined in: [src/safe-fetch.ts:77](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L77)

Resolve a message id in a given channel's messages manager.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `messages` | `MessageManager`\<`boolean`\> \| `null` \| `undefined` |
| `messageId` | `string` \| `null` \| `undefined` |
| `options` | [`SafeFetchOptions`](../interfaces/SafeFetchOptions) |

## Returns

`Promise`\<`Message`\<`boolean`\> \| `null`\>
