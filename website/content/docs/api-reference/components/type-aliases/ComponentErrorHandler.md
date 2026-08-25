---
title: "ComponentErrorHandler"
description: "Error hook invoked when a component handler throws."
---

```ts
type ComponentErrorHandler = (error: Error, interaction: RepliableInteraction, namespace: string) => Awaitable<void>;
```

Defined in: [src/components/registry.ts:78](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L78)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `Error` |
| `interaction` | `RepliableInteraction` |
| `namespace` | `string` |

## Returns

`Awaitable`\<`void`\>
