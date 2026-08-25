---
title: "EventDef"
description: "A type-erased, ready-to-attach event listener. Built by event; the concrete event type is captured in the closures so binding stays type-safe."
---

Defined in: [src/events.ts:20](https://github.com/byigitt/spearkit/blob/main/src/events.ts#L20)

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-name"></a> `name` | `readonly` | keyof `ClientEvents` |
| <a id="property-once"></a> `once` | `readonly` | `boolean` |

## Methods

### attach()

```ts
attach(client: Client): void;
```

Defined in: [src/events.ts:24](https://github.com/byigitt/spearkit/blob/main/src/events.ts#L24)

Attach the listener to a client.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `Client` |

#### Returns

`void`

***

### detach()

```ts
detach(client: Client): void;
```

Defined in: [src/events.ts:26](https://github.com/byigitt/spearkit/blob/main/src/events.ts#L26)

Remove the listener from a client it was attached to.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `Client` |

#### Returns

`void`
