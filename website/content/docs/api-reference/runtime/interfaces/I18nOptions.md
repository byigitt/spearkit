---
title: "I18nOptions\\<M\\>"
description: "I18nOptions\\<M\\> in the spearkit API."
---

Defined in: [src/i18n.ts:46](https://github.com/byigitt/spearkit/blob/main/src/i18n.ts#L46)

## Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `M` *extends* [`TranslationMessages`](../type-aliases/TranslationMessages) | [`TranslationMessages`](../type-aliases/TranslationMessages) |

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-defaultlocale"></a> `defaultLocale` | `string` | - |
| <a id="property-fallbacklocale"></a> `fallbackLocale?` | `string` | Extra fallback tried before `defaultLocale`. |
| <a id="property-messages"></a> `messages` | `M` | - |
| <a id="property-missing"></a> `missing?` | (`key`, `locale`) => `string` | Customize missing keys. Default: return the key itself. |
| <a id="property-resolvelocale"></a> `resolveLocale?` | [`LocaleResolver`](../type-aliases/LocaleResolver) | Override locale per user/guild; may read an async settings store. |
