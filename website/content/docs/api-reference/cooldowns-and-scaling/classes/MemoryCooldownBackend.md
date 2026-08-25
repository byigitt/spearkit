---
title: "MemoryCooldownBackend"
description: "In-process timestamp map — the historical CooldownManager behaviour."
---

Defined in: [src/cooldown.ts:129](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L129)

In-process timestamp map — the historical [CooldownManager](CooldownManager) behaviour.

## Implements

- [`CooldownBackend`](../interfaces/CooldownBackend)

## Constructors

### Constructor

> **new MemoryCooldownBackend**(): `MemoryCooldownBackend`

#### Returns

`MemoryCooldownBackend`

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/cooldown.ts:157](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L157)

Drop every tracked key.

#### Returns

`void`

#### Implementation of

[`CooldownBackend`](../interfaces/CooldownBackend).[`clear`](../interfaces/CooldownBackend#clear)

***

### delete()

> **delete**(`key`): `boolean`

Defined in: [src/cooldown.ts:153](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L153)

Drop one key. Resolves `true` if it existed.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

#### Implementation of

[`CooldownBackend`](../interfaces/CooldownBackend).[`delete`](../interfaces/CooldownBackend#delete)

***

### hit()

> **hit**(`key`, `durationMs`, `now`): [`CooldownResult`](../type-aliases/CooldownResult)

Defined in: [src/cooldown.ts:136](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L136)

Record a hit unless `key` is still cooling down.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `durationMs` | `number` |
| `now` | `number` |

#### Returns

[`CooldownResult`](../type-aliases/CooldownResult)

#### Implementation of

[`CooldownBackend`](../interfaces/CooldownBackend).[`hit`](../interfaces/CooldownBackend#hit)

***

### peek()

> **peek**(`key`, `durationMs`, `now`): [`CooldownResult`](../type-aliases/CooldownResult)

Defined in: [src/cooldown.ts:145](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L145)

Read-only check.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `durationMs` | `number` |
| `now` | `number` |

#### Returns

[`CooldownResult`](../type-aliases/CooldownResult)

#### Implementation of

[`CooldownBackend`](../interfaces/CooldownBackend).[`peek`](../interfaces/CooldownBackend#peek)

***

### size()

> **size**(): `number`

Defined in: [src/cooldown.ts:132](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L132)

Number of tracked keys, when cheap to compute.

#### Returns

`number`

#### Implementation of

[`CooldownBackend`](../interfaces/CooldownBackend).[`size`](../interfaces/CooldownBackend#size)
