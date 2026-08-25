---
title: "lookup()"
description: "Build a typed lookup over a Record<key, value> table. Throws on missing keys so config typos surface at startup, not at use."
---

> **lookup**\<`K`, `V`\>(`table`, `resourceName?`): (`key`) => `V`

Defined in: [src/config.ts:52](https://github.com/byigitt/spearkit/blob/main/src/config.ts#L52)

Build a typed lookup over a `Record<key, value>` table. Throws on missing
keys so config typos surface at startup, not at use.

## Type Parameters

| Type Parameter |
| :------ |
| `K` *extends* `string` |
| `V` |

## Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `table` | `Readonly`\<`Record`\<`K`, `V`\>\> | `undefined` |
| `resourceName` | `string` | `"key"` |

## Returns

(`key`) => `V`

## Example

```ts
const roles = lookup(config.roles, "role");
const modId = roles("moderator"); // string; throws if "moderator" is absent
```
