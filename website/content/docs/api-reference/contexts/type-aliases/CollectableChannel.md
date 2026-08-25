---
title: "CollectableChannel"
description: "A text-based channel that can collect messages — every TextBasedChannel except PartialGroupDMChannel (which has no message manager)."
---

```ts
type CollectableChannel = Exclude<TextBasedChannel, PartialGroupDMChannel>;
```

Defined in: [src/collectors.ts:47](https://github.com/byigitt/spearkit/blob/main/src/collectors.ts#L47)

