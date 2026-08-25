---
title: "V2Child"
description: "Anything that can sit inside a container or at the top level of a V2 message."
---

```ts
type V2Child = 
  | TextDisplayBuilder
  | SeparatorBuilder
  | SectionBuilder
  | MediaGalleryBuilder
  | FileBuilder
| ActionRowBuilder<MessageActionRowComponentBuilder>;
```

Defined in: [src/components/v2.ts:25](https://github.com/byigitt/spearkit/blob/main/src/components/v2.ts#L25)

