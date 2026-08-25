---
title: "CreatePayloadStoreOptions"
description: "Options for createPayloadStore."
---

Defined in: [src/payload.ts:25](https://github.com/byigitt/spearkit/blob/main/src/payload.ts#L25)

Options for [createPayloadStore](../functions/createPayloadStore).

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-namespace"></a> `namespace?` | `string` | Key prefix so several payload maps can share one store. Default `"payload"`. |
| <a id="property-store"></a> `store` | [`KeyValueStore`](../../storage/interfaces/KeyValueStore) | Backing store. |
| <a id="property-ttlms"></a> `ttlMs?` | `number` | Time-to-live in milliseconds. Omit to keep payloads until [PayloadStore.delete](PayloadStore#delete). |
