---
title: "HandlerErrorHandler"
description: "Return a string to override the user-facing message, false to suppress a response, or nothing to use spearkit's safe default."
---

```ts
type HandlerErrorHandler = (event: HandlerErrorEvent) => Awaitable<string | false | void>;
```

Defined in: [src/handler-errors.ts:36](https://github.com/byigitt/spearkit/blob/main/src/handler-errors.ts#L36)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `event` | [`HandlerErrorEvent`](HandlerErrorEvent) |

## Returns

`Awaitable`\<`string` \| `false` \| `void`\>
