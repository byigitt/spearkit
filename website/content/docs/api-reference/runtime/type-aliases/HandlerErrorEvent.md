---
title: "HandlerErrorEvent"
description: "Error details passed to SpearClient({ onHandlerError })."
---

```ts
type HandlerErrorEvent = 
  | {
  error: Error;
  interaction: RepliableInteraction;
  name: string;
  source: InteractionHandlerSource;
}
  | {
  error: Error;
  message: Message;
  name: string;
  source: "prefix";
};
```

Defined in: [src/handler-errors.ts:18](https://github.com/byigitt/spearkit/blob/main/src/handler-errors.ts#L18)

