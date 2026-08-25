---
title: "guildOnly()"
description: "Require the interaction/message to come from inside a guild."
---

```ts
function guildOnly(reason?: string): Guard;
```

Defined in: [src/guards.ts:69](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L69)

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `reason` | `string` | `"This can only be used in a server."` |

## Returns

[`Guard`](../type-aliases/Guard)
