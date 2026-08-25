---
title: "PrefixErrorHandler"
description: "Error hook invoked when a prefix command handler throws."
---

> **PrefixErrorHandler** = (`error`, `message`, `commandName`) => `Awaitable`\<`void`\>

Defined in: [src/prefix.ts:223](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L223)

Error hook invoked when a prefix command handler throws.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `Error` |
| `message` | `Message` |
| `commandName` | `string` |

## Returns

`Awaitable`\<`void`\>
