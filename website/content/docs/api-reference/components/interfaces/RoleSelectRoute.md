---
title: "RoleSelectRoute"
description: "Routing entry for a role select."
---

Defined in: [src/components/registry.ts:44](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L44)

## Extends

- `RouteBase`

## Extended by

- [`RoleSelect`](RoleSelect)

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | `RouteBase.guards` |
| <a id="property-kind"></a> `kind` | `readonly` | `"roleSelect"` | - |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | `RouteBase.namespace` |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | `RouteBase.paramNames` |

## Methods

### handle()

```ts
handle(interaction: RoleSelectMenuInteraction, params: Record<string, string>): Promise<void>;
```

Defined in: [src/components/registry.ts:46](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L46)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `RoleSelectMenuInteraction` |
| `params` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`void`\>
