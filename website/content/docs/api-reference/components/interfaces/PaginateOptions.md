---
title: "PaginateOptions"
description: "Options for paginate / buildPaginatorPage."
---

Defined in: [src/pagination.ts:28](https://github.com/byigitt/spearkit/blob/main/src/pagination.ts#L28)

## Type Parameters

| Type Parameter |
| :------ |
| `T` |

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-controls"></a> `controls?` | `"prev-next"` \| `"first-prev-next-last"` | Which buttons to show. Default `"prev-next"`. |
| <a id="property-ephemeral"></a> `ephemeral?` | `boolean` | Make the initial reply ephemeral. Default `false`. |
| <a id="property-labels"></a> `labels?` | `object` | Button labels. Defaults: `‹` Prev / `›` Next / `«` First / `»` Last. |
| `labels.first?` | `string` | - |
| `labels.last?` | `string` | - |
| `labels.next?` | `string` | - |
| `labels.prev?` | `string` | - |
| <a id="property-namespace"></a> `namespace?` | `string` | Custom-id prefix to avoid clashes with other components. Default `"spk-page"`. |
| <a id="property-pagesize"></a> `pageSize?` | `number` | Items per page. Default `10`. |
| <a id="property-render"></a> `render` | (`slice`: readonly `T`[], `state`: `object`) => \| [`PaginateRender`](../type-aliases/PaginateRender) \| `Promise`\<[`PaginateRender`](../type-aliases/PaginateRender)\> | Build the body for one page. |
| <a id="property-timeoutms"></a> `timeoutMs?` | `number` | Time (ms) before buttons are disabled. Default `5 * 60_000`. |
| <a id="property-user"></a> `user?` | `string` | When set, only this user id can click. Defaults to the invoker. |
