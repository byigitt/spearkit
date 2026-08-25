---
title: "createPayloadStore()"
description: "Build a PayloadStore over any KeyValueStore."
---

```ts
function createPayloadStore<T>(options: CreatePayloadStoreOptions): PayloadStore<T>;
```

Defined in: [src/payload.ts:55](https://github.com/byigitt/spearkit/blob/main/src/payload.ts#L55)

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
