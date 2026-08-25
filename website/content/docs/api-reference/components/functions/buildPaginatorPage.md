---
title: "buildPaginatorPage()"
description: "Build the payload for a single paginator page (embeds + button row), without any interaction or collector wiring. Useful for tests, web previews and custom UIs that want spearkit's slicing/controls but their own send path."
---

```ts
function buildPaginatorPage<T>(
   items: readonly T[], 
   page: number, 
   options: PaginateOptions<T>): Promise<{
  pages: number;
  payload: BaseMessageOptions;
}>;
```

Defined in: [src/pagination.ts:123](https://github.com/byigitt/spearkit/blob/main/src/pagination.ts#L123)

## Type Parameters

| Type Parameter |
| :------ |
| `T` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `items` | readonly `T`[] |
| `page` | `number` |
| `options` | [`PaginateOptions`](../interfaces/PaginateOptions)\<`T`\> |

## Returns

`Promise`\<\{
  `pages`: `number`;
  `payload`: `BaseMessageOptions`;
\}\>
