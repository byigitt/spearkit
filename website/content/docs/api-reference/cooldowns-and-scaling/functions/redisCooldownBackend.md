---
title: "redisCooldownBackend()"
description: "Atomic cooldown clock over Redis SET key NX PX duration. The key exists only while the actor is cooling down, so shards share one window without a…"
---

> **redisCooldownBackend**(`client`, `options?`): [`CooldownBackend`](../interfaces/CooldownBackend)

Defined in: [src/cooldown.ts:203](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L203)

Atomic cooldown clock over Redis `SET key NX PX duration`.

The key exists only while the actor is cooling down, so shards share one
window without a compare-and-swap race.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | [`RedisCommands`](../../storage/interfaces/RedisCommands) |
| `options` | \{ `prefix?`: `string`; \} |
| `options.prefix?` | `string` |

## Returns

[`CooldownBackend`](../interfaces/CooldownBackend)
