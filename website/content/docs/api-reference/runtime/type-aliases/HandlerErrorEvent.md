---
title: "HandlerErrorEvent"
description: "Error details passed to SpearClient({ onHandlerError })."
---

> **HandlerErrorEvent** = \{ `error`: `Error`; `interaction`: `RepliableInteraction`; `name`: `string`; `source`: [`InteractionHandlerSource`](InteractionHandlerSource); \} \| \{ `error`: `Error`; `message`: `Message`; `name`: `string`; `source`: `"prefix"`; \}

Defined in: [src/handler-errors.ts:18](https://github.com/byigitt/spearkit/blob/main/src/handler-errors.ts#L18)

Error details passed to `SpearClient({ onHandlerError })`.
