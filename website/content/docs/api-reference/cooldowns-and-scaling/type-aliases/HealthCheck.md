---
title: "HealthCheck"
description: "Named readiness probe."
---

```ts
type HealthCheck = () => Awaitable<boolean>;
```

Defined in: [src/scale.ts:349](https://github.com/byigitt/spearkit/blob/main/src/scale.ts#L349)

## Returns

`Awaitable`\<`boolean`\>
