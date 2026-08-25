---
title: "LocaleResolver"
description: "LocaleResolver in the spearkit API."
---

```ts
type LocaleResolver = (target: LocaleTarget) => Awaitable<string | null | undefined>;
```

Defined in: [src/i18n.ts:42](https://github.com/byigitt/spearkit/blob/main/src/i18n.ts#L42)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `target` | [`LocaleTarget`](../interfaces/LocaleTarget) |

## Returns

`Awaitable`\<`string` \| `null` \| `undefined`\>
