---
title: "HealthServerOptions"
description: "Options for startHealthServer."
---

Defined in: [src/scale.ts:352](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L352)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-checks"></a> `checks?` | `Readonly`\<`Record`\<`string`, [`HealthCheck`](../type-aliases/HealthCheck)\>\> | Database/Redis/etc checks included in `/readyz`. |
| <a id="property-client"></a> `client?` | `Client`\<`boolean`\> | Optional Discord client; readiness requires `client.isReady()`. |
| <a id="property-host"></a> `host?` | `string` | Bind host. Default `"0.0.0.0"`. |
| <a id="property-port"></a> `port?` | `number` | Bind port. Default 3001; pass 0 in tests. |
