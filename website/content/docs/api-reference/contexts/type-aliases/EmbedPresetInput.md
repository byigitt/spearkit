---
title: "EmbedPresetInput"
description: "Shape accepted by every preset: a plain string or a structured body."
---

```ts
type EmbedPresetInput = 
  | string
  | {
  author?: APIEmbedAuthor;
  description?: string;
  fields?: readonly APIEmbedField[];
  footer?: APIEmbedFooter;
  image?: {
     url: string;
  };
  thumbnail?: {
     url: string;
  };
  timestamp?: Date | number | string;
  title?: string;
  url?: string;
};
```

Defined in: [src/embeds.ts:40](https://github.com/byigitt/spearkit/blob/main/src/embeds.ts#L40)

