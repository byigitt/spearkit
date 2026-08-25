---
title: "startHealthServer()"
description: "Start dependency-free Kubernetes/container probes:"
---

```ts
function startHealthServer(options?: HealthServerOptions): Promise<HealthServerHandle>;
```

Defined in: [src/scale.ts:378](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L378)

- `GET /healthz` — process is alive
- `GET /readyz` — Discord ready + custom checks
- `GET /stats` — cheap local shard/process snapshot

## Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`HealthServerOptions`](../interfaces/HealthServerOptions) |

## Returns

`Promise`\<[`HealthServerHandle`](../interfaces/HealthServerHandle)\>
