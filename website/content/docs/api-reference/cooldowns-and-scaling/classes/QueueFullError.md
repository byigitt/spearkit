---
title: "QueueFullError"
description: "Thrown when a WorkQueue has no remaining waiting capacity."
---

Defined in: [src/scale.ts:236](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L236)

Thrown when a [WorkQueue](WorkQueue) has no remaining waiting capacity.

## Extends

- `Error`

## Constructors

### Constructor

> **new QueueFullError**(`maxQueued`): `QueueFullError`

Defined in: [src/scale.ts:237](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L237)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `maxQueued` | `number` |

#### Returns

`QueueFullError`

#### Overrides

`Error.constructor`

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-maxqueued"></a> `maxQueued` | `readonly` | `number` |
