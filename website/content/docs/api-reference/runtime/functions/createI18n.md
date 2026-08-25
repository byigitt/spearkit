---
title: "createI18n()"
description: "Create an I18n while inferring the union of catalog keys."
---

> **createI18n**\<`M`\>(`options`): [`I18n`](../classes/I18n)\<`Extract`\<`KeysOfUnion`\<`M`\[keyof `M`\]\>, `string`\>\>

Defined in: [src/i18n.ts:154](https://github.com/byigitt/spearkit/blob/main/src/i18n.ts#L154)

Create an [I18n](../classes/I18n) while inferring the union of catalog keys.

## Type Parameters

| Type Parameter |
| :------ |
| `M` *extends* `Readonly`\<`Record`\<`string`, `Readonly`\<`Record`\<`string`, [`TranslationValue`](../type-aliases/TranslationValue)\>\>\>\> |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`I18nOptions`](../interfaces/I18nOptions)\<`M`\> |

## Returns

[`I18n`](../classes/I18n)\<`Extract`\<`KeysOfUnion`\<`M`\[keyof `M`\]\>, `string`\>\>
