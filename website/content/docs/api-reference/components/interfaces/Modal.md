---
title: "Modal"
description: "A registrable modal with a typed build."
---

Defined in: [src/components/builders.ts:709](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L709)

## Extends

- [`ModalRoute`](ModalRoute)

## Type Parameters

| Type Parameter |
| :------ |
| `P` *extends* `string` |

## Properties

| Property | Modifier | Type | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | [`ModalRoute`](ModalRoute).[`guards`](ModalRoute#property-guards) |
| <a id="property-kind"></a> `kind` | `readonly` | `"modal"` | [`ModalRoute`](ModalRoute).[`kind`](ModalRoute#property-kind) |
| <a id="property-namespace"></a> `namespace` | `readonly` | `string` | [`ModalRoute`](ModalRoute).[`namespace`](ModalRoute#property-namespace) |
| <a id="property-paramnames"></a> `paramNames` | `readonly` | readonly `string`[] | [`ModalRoute`](ModalRoute).[`paramNames`](ModalRoute#property-paramnames) |

## Methods

### build()

```ts
build(...args: BuildArgs<P>): ModalBuilder;
```

Defined in: [src/components/builders.ts:710](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L710)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`args` | [`BuildArgs`](../type-aliases/BuildArgs)\<`P`\> |

#### Returns

`ModalBuilder`

***

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

#### Inherited from

[`ModalRoute`](ModalRoute).[`handle`](ModalRoute#handle)
