---
title: "keyValueCooldownBackend()"
description: "Persist last-hit timestamps in any KeyValueStore. Safe across restarts; two processes hitting the same key can race (use redisCooldownBackend when you need…"
---

> **keyValueCooldownBackend**(`store`): [`CooldownBackend`](../interfaces/CooldownBackend)

Defined in: [src/cooldown.ts:168](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L168)

Persist last-hit timestamps in any [KeyValueStore](../../storage/interfaces/KeyValueStore).

Safe across restarts; two processes hitting the same key can race (use
[redisCooldownBackend](redisCooldownBackend) when you need atomic NX).

## Parameters

| Parameter | Type |
| :------ | :------ |
| `store` | [`KeyValueStore`](../../storage/interfaces/KeyValueStore) |

## Returns

[`CooldownBackend`](../interfaces/CooldownBackend)
