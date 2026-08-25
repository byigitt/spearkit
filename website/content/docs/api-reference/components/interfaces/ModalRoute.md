---
title: "ModalRoute"
description: "Routing entry for a modal submission."
---

Defined in: [src/components/registry.ts:62](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L62)

## Extends

- `RouteBase`

## Extended by

- [`Modal`](Modal)

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | `RouteBase.guards` |
| <a id="property-kind"></a> `kind` | `readonly` | `"modal"` | - |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | `RouteBase.namespace` |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | `RouteBase.paramNames` |

## Methods

### handle()

```ts
handle(interaction: ModalSubmitInteraction, params: Record<string, string>): Promise<void>;
```

Defined in: [src/components/registry.ts:64](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L64)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `ModalSubmitInteraction` |
| `params` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`void`\>
