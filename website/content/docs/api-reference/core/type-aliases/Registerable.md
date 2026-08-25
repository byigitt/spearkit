---
title: "Registerable"
description: "Anything that can be handed to SpearClient.register."
---

```ts
type Registerable = 
  | SlashCommand
  | EventDef
  | ComponentDef
  | ScheduledTask
  | PrefixCommand
  | ContextMenuCommand
  | HybridCommand;
```

Defined in: [src/client.ts:39](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L39)

