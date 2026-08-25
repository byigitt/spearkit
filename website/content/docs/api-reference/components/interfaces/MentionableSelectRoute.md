---
title: "MentionableSelectRoute"
description: "Routing entry for a mentionable select."
---

Defined in: [src/components/registry.ts:54](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L54)

## Extends

- `RouteBase`

## Extended by

- [`MentionableSelect`](MentionableSelect)

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | `RouteBase.guards` |
| <a id="property-kind"></a> `kind` | `readonly` | `"mentionableSelect"` | - |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | `RouteBase.namespace` |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | `RouteBase.paramNames` |

## Methods

### handle()

```ts
handle(interaction: MentionableSelectMenuInteraction, params: Record<string, string>): Promise<void>;
```

Defined in: [src/components/registry.ts:56](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L56)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `MentionableSelectMenuInteraction` |
| `params` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`void`\>
