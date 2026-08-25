---
title: "parseEnv()"
description: "Parse .env-formatted text into a flat object. Does not touch process.env."
---

```ts
function parseEnv(content: string): ParsedEnv;
```

Defined in: [src/env.ts:42](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L42)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `content` | `string` |

## Returns

[`ParsedEnv`](../type-aliases/ParsedEnv)
