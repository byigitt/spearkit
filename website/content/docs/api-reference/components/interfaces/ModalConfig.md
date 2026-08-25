---
title: "ModalConfig\\<P, F, R\\>"
description: "Config for a modal created with modal."
---

Defined in: [src/components/builders.ts:699](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L699)

Config for a modal created with [modal](../functions/modal).

## Type Parameters

| Type Parameter |
| :------ |
| `P` *extends* `string` |
| `F` *extends* [`ModalFieldMap`](../type-aliases/ModalFieldMap) |
| `R` |

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-fields"></a> `fields` | `F` | - |
| <a id="property-guards"></a> `guards?` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | Preconditions evaluated before the handler runs. |
| <a id="property-id"></a> `id` | `P` | - |
| <a id="property-run"></a> `run` | (`ctx`) => `Awaitable`\<`R`\> | - |
| <a id="property-title"></a> `title` | `string` | - |
