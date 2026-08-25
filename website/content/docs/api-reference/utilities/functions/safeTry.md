---
title: "safeTry()"
description: "Wrap an arbitrary best-effort operation so a failure resolves to null instead of throwing. Useful for sends/deletes whose outcome is non-critical."
---

> **safeTry**\<`T`\>(`op`): `Promise`\<`T` \| `null`\>

Defined in: [src/safe-fetch.ts:153](https://github.com/byigitt/spearkit/blob/main/src/safe-fetch.ts#L153)

Wrap an arbitrary best-effort operation so a failure resolves to `null`
instead of throwing. Useful for sends/deletes whose outcome is non-critical.

## Type Parameters

| Type Parameter |
| :------ |
| `T` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `op` | () => `T` \| `Promise`\<`T`\> |

## Returns

`Promise`\<`T` \| `null`\>

## Example

```ts
await safeTry(() => message.delete());
```
