---
title: "collectModules()"
description: "Recursively import a directory and collect every spearkit-registrable export (commands, events, components, hybrid commands, context menus) found in default or named exports."
---

```ts
function collectModules(dir: string, options?: LoadOptions): Promise<Registerable[]>;
```

Defined in: [src/loader.ts:103](https://github.com/byigitt/spearkit/blob/main/src/loader.ts#L103)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `dir` | `string` |
| `options` | [`LoadOptions`](../interfaces/LoadOptions) |

## Returns

`Promise`\<[`Registerable`](../type-aliases/Registerable)[]\>
