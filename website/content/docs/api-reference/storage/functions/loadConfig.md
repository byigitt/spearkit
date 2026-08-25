---
title: "loadConfig()"
description: "Synchronously read + parse + (optionally) validate a config file."
---

```ts
function loadConfig<T>(options: LoadConfigOptions<T>): T;
```

Defined in: [src/config.ts:27](https://github.com/byigitt/spearkit/blob/main/src/config.ts#L27)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `unknown` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`LoadConfigOptions`](../interfaces/LoadConfigOptions)\<`T`\> |

## Returns

`T`
