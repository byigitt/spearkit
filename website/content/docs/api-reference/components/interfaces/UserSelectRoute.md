---
title: "UserSelectRoute"
description: "Routing entry for a user select."
---

Defined in: [src/components/registry.ts:39](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L39)

## Extends

- `RouteBase`

## Extended by

- [`UserSelect`](UserSelect)

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | `RouteBase.guards` |
| <a id="property-kind"></a> `kind` | `readonly` | `"userSelect"` | - |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | `RouteBase.namespace` |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | `RouteBase.paramNames` |

## Methods

### handle()

```ts
handle(interaction: UserSelectMenuInteraction, params: Record<string, string>): Promise<void>;
```

Defined in: [src/components/registry.ts:41](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L41)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `UserSelectMenuInteraction` |
| `params` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`void`\>
