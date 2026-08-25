---
title: "createPayloadStore()"
description: "Build a PayloadStore over any KeyValueStore."
---

> **createPayloadStore**\<`T`\>(`options`): [`PayloadStore`](../interfaces/PayloadStore)\<`T`\>

Defined in: [src/payload.ts:55](https://github.com/byigitt/spearkit/blob/main/src/payload.ts#L55)

Build a [PayloadStore](../interfaces/PayloadStore) over any [KeyValueStore](../../storage/interfaces/KeyValueStore).

## Type Parameters

| Type Parameter |
| :------ |
| `T` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`CreatePayloadStoreOptions`](../interfaces/CreatePayloadStoreOptions) |

## Returns

[`PayloadStore`](../interfaces/PayloadStore)\<`T`\>

## Example

```ts
const tickets = createPayloadStore<{ userId: string; page: number }>({
  store: new MemoryStore(),
});
const token = await tickets.put({ userId: "1", page: 3 });
next.build({ token }); // custom-id "page:<token>"
```
