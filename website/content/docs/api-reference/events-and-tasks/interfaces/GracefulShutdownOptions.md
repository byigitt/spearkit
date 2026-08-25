---
title: "GracefulShutdownOptions"
description: "Options for gracefulShutdown."
---

Defined in: [src/shutdown.ts:32](https://github.com/byigitt/spearkit/blob/main/src/shutdown.ts#L32)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-exit"></a> `exit?` | `boolean` | Call `process.exit()` when done. Default `true`. Set `false` in tests. |
| <a id="property-logger"></a> `logger?` | [`ShutdownLogger`](ShutdownLogger) | Optional progress logger. |
| <a id="property-onshutdown"></a> `onShutdown?` | (`signal`: `Signals`) => `Awaitable`\<`void`\> | Runs before `client.destroy()` — flush databases, close connections, etc. |
| <a id="property-signals"></a> `signals?` | readonly `Signals`[] | Signals to listen for. Default `["SIGINT", "SIGTERM"]`. |
| <a id="property-timeoutms"></a> `timeoutMs?` | `number` | Force-exit if shutdown takes longer than this many ms. Default `10000`. |
