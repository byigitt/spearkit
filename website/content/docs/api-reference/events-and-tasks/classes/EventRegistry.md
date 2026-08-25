---
title: "EventRegistry"
description: "Holds event listeners and attaches them to clients in bulk."
---

Defined in: [src/events.ts:92](https://github.com/byigitt/spearkit/blob/main/src/events.ts#L92)

## Constructors

### Constructor

```ts
new EventRegistry(): EventRegistry;
```

#### Returns

`EventRegistry`

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [src/events.ts:106](https://github.com/byigitt/spearkit/blob/main/src/events.ts#L106)

Number of registered listeners.

##### Returns

`number`

## Methods

### add()

```ts
add(...defs: EventDef[]): this;
```

Defined in: [src/events.ts:97](https://github.com/byigitt/spearkit/blob/main/src/events.ts#L97)

Register one or more event definitions.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`defs` | [`EventDef`](../interfaces/EventDef)[] |

#### Returns

`this`

***

### attachAll()

```ts
attachAll(client: Client): void;
```

Defined in: [src/events.ts:111](https://github.com/byigitt/spearkit/blob/main/src/events.ts#L111)

Attach every registered listener to the client.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `Client` |

#### Returns

`void`

***

### detachAll()

```ts
detachAll(client: Client): void;
```

Defined in: [src/events.ts:117](https://github.com/byigitt/spearkit/blob/main/src/events.ts#L117)

Detach every registered listener from the client.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `Client` |

#### Returns

`void`
