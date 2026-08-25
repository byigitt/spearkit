---
title: "effectiveDuration()"
description: "Resolve the cooldown an actor should serve. null means exempt (no cooldown). Otherwise a duration in milliseconds (which may be 0)."
---

```ts
function effectiveDuration(config: CooldownConfig, actor: CooldownActor): number | null;
```

Defined in: [src/cooldown.ts:79](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L79)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`CooldownConfig`](../interfaces/CooldownConfig) |
| `actor` | [`CooldownActor`](../interfaces/CooldownActor) |

## Returns

`number` \| `null`
