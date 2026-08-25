---
title: "UserSelect"
description: "A registrable user select."
---

Defined in: [src/components/builders.ts:199](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L199)

## Extends

- [`UserSelectRoute`](UserSelectRoute)

## Type Parameters

| Type Parameter |
| :------ |
| `P` *extends* `string` |

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | [`UserSelectRoute`](UserSelectRoute).[`guards`](UserSelectRoute#property-guards) |
| <a id="property-kind"></a> `kind` | `readonly` | `"userSelect"` | [`UserSelectRoute`](UserSelectRoute).[`kind`](UserSelectRoute#property-kind) |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | [`UserSelectRoute`](UserSelectRoute).[`namespace`](UserSelectRoute#property-namespace) |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | [`UserSelectRoute`](UserSelectRoute).[`paramNames`](UserSelectRoute#property-paramnames) |

## Methods

### build()

```ts
build(...args: BuildArgs<P>): UserSelectMenuBuilder;
```

Defined in: [src/components/builders.ts:200](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L200)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`args` | [`BuildArgs`](../type-aliases/BuildArgs)\<`P`\> |

#### Returns

`UserSelectMenuBuilder`

***

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

#### Inherited from

[`UserSelectRoute`](UserSelectRoute).[`handle`](UserSelectRoute#handle)
