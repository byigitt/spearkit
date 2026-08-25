---
title: "paginate()"
description: "Send an item list across paginated, button-controlled embeds."
---

```ts
function paginate<T>(
   interaction: RepliableInteraction, 
   items: readonly T[], 
options: PaginateOptions<T>): Promise<void>;
```

Defined in: [src/pagination.ts:147](https://github.com/byigitt/spearkit/blob/main/src/pagination.ts#L147)

The first page is replied to [interaction](#paginate) (or `editReply`d when
already deferred), then a button-component collector handles prev/next
clicks until the timeout fires — at which point the buttons are disabled.

## Type Parameters

| Type Parameter |
| :------ |
| `T` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `RepliableInteraction` |
| `items` | readonly `T`[] |
| `options` | [`PaginateOptions`](../interfaces/PaginateOptions)\<`T`\> |

## Returns

`Promise`\<`void`\>
