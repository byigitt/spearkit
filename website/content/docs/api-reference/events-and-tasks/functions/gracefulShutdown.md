---
title: "gracefulShutdown()"
description: "Wire signal handlers that gracefully tear client down once, then exit. Returns a disposer that removes the handlers (handy for tests/hot-reload)."
---

```ts
function gracefulShutdown(client: Destroyable, options?: GracefulShutdownOptions): () => void;
```

Defined in: [src/shutdown.ts:49](https://github.com/byigitt/spearkit/blob/main/src/shutdown.ts#L49)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | [`Destroyable`](../interfaces/Destroyable) |
| `options` | [`GracefulShutdownOptions`](../interfaces/GracefulShutdownOptions) |

## Returns

() => `void`
