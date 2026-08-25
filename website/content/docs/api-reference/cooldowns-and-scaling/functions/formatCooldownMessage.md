---
title: "formatCooldownMessage()"
description: "Build the user-facing message for a blocked action."
---

```ts
function formatCooldownMessage(config: CooldownConfig, remainingMs: number): string;
```

Defined in: [src/cooldown.ts:345](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L345)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`CooldownConfig`](../interfaces/CooldownConfig) |
| `remainingMs` | `number` |

## Returns

`string`
