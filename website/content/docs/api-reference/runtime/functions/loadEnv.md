---
title: "loadEnv()"
description: "Read a .env file and merge it into process.env. Existing variables win unless override is set. Missing files are ignored (returns {}), so it is safe to call…"
---

> **loadEnv**(`options?`): [`ParsedEnv`](../type-aliases/ParsedEnv)

Defined in: [src/env.ts:64](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L64)

Read a `.env` file and merge it into `process.env`. Existing variables win
unless `override` is set. Missing files are ignored (returns `{}`), so it is
safe to call unconditionally.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`LoadEnvOptions`](../interfaces/LoadEnvOptions) |

## Returns

[`ParsedEnv`](../type-aliases/ParsedEnv)

the parsed key/value pairs from the file.
