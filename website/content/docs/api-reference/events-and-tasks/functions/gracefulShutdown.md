---
title: "gracefulShutdown()"
description: "Wire signal handlers that gracefully tear client down once, then exit. Returns a disposer that removes the handlers (handy for tests/hot-reload)."
---

> **gracefulShutdown**(`client`, `options?`): () => `void`

Defined in: [src/shutdown.ts:49](https://github.com/byigitt/spearkit/blob/main/src/shutdown.ts#L49)

Wire signal handlers that gracefully tear `client` down once, then exit.
Returns a disposer that removes the handlers (handy for tests/hot-reload).

## Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | [`Destroyable`](../interfaces/Destroyable) |
| `options` | [`GracefulShutdownOptions`](../interfaces/GracefulShutdownOptions) |

## Returns

() => `void`
