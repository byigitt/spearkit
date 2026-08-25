---
title: "MessageKey"
description: "MessageKey in the spearkit API."
---

```ts
type MessageKey<M> = Extract<KeysOfUnion<M[keyof M]>, string>;
```

Defined in: [src/i18n.ts:27](https://github.com/byigitt/spearkit/blob/main/src/i18n.ts#L27)

## Type Parameters

| Type Parameter |
| :------ |
| `M` *extends* [`TranslationMessages`](TranslationMessages) |
