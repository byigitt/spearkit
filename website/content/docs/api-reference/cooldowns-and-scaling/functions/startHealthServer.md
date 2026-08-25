---
title: "startHealthServer()"
description: "Start dependency-free Kubernetes/container probes: - GET /healthz — process is alive - GET /readyz — Discord ready + custom checks"
---

> **startHealthServer**(`options?`): `Promise`\<[`HealthServerHandle`](../interfaces/HealthServerHandle)\>

Defined in: [src/scale.ts:378](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L378)

Start dependency-free Kubernetes/container probes:

- `GET /healthz` — process is alive
- `GET /readyz` — Discord ready + custom checks
- `GET /stats` — cheap local shard/process snapshot

## Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`HealthServerOptions`](../interfaces/HealthServerOptions) |

## Returns

`Promise`\<[`HealthServerHandle`](../interfaces/HealthServerHandle)\>
