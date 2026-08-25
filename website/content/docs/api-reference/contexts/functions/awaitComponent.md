---
title: "awaitComponent()"
description: "Wait for the next component interaction (button/select click) on message, resolving to it or null on timeout. Note: you must still acknowledge the returned interaction (update/deferUpdate/reply)."
---

```ts
function awaitComponent(message: Message, options?: AwaitComponentOptions): Promise<MessageComponentInteraction<CacheType> | null>;
```

Defined in: [src/collectors.ts:86](https://github.com/byigitt/spearkit/blob/main/src/collectors.ts#L86)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `Message` |
| `options` | [`AwaitComponentOptions`](../interfaces/AwaitComponentOptions) |

## Returns

`Promise`\<`MessageComponentInteraction`\<`CacheType`\> \| `null`\>
