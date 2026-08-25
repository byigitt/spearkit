---
title: "showAndAwaitModal()"
description: "Show modal on interaction, then wait for its submission — scoped to the same user and the modal's own custom-id — resolving to the ModalSubmitInteraction or null if the user dismisses it / it times out. Sidesteps the \"Unknown interaction after cancelling a modal\" trap by always bounding the wait."
---

```ts
function showAndAwaitModal(
   interaction: ModalShowingInteraction, 
   modal: ModalLike, 
options?: AwaitModalOptions): Promise<ModalSubmitInteraction<CacheType> | null>;
```

Defined in: [src/collectors.ts:140](https://github.com/byigitt/spearkit/blob/main/src/collectors.ts#L140)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | [`ModalShowingInteraction`](../type-aliases/ModalShowingInteraction) |
| `modal` | [`ModalLike`](../type-aliases/ModalLike) |
| `options` | [`AwaitModalOptions`](../interfaces/AwaitModalOptions) |

## Returns

`Promise`\<`ModalSubmitInteraction`\<`CacheType`\> \| `null`\>
