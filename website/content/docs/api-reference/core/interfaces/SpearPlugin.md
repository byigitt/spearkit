---
title: "SpearPlugin"
description: "A spearkit plugin: a named, reusable bundle of commands, events and components. Its setup runs once when added to a client via client.use(plugin)."
---

Defined in: [src/plugin.ts:8](https://github.com/byigitt/spearkit/blob/main/src/plugin.ts#L8)

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-name"></a> `name` | `readonly` | `string` |

## Methods

### setup()

```ts
setup(client: SpearClient): Awaitable<void>;
```

Defined in: [src/plugin.ts:10](https://github.com/byigitt/spearkit/blob/main/src/plugin.ts#L10)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | [`SpearClient`](../classes/SpearClient) |

#### Returns

`Awaitable`\<`void`\>
