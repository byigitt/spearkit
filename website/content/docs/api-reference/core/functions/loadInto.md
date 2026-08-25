---
title: "loadInto()"
description: "Load a directory and register everything it exports into the client. Returns the number of items registered."
---

```ts
function loadInto(
   client: SpearClient, 
   dir: string, 
options?: LoadOptions): Promise<number>;
```

Defined in: [src/loader.ts:132](https://github.com/byigitt/spearkit/blob/main/src/loader.ts#L132)

## Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | [`SpearClient`](../classes/SpearClient) |
| `dir` | `string` |
| `options?` | [`LoadOptions`](../interfaces/LoadOptions) |

## Returns

`Promise`\<`number`\>
