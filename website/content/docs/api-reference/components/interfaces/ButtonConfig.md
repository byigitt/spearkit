---
title: "ButtonConfig\\<P, R\\>"
description: "Config for an interactive button created with button."
---

Defined in: [src/components/builders.ts:71](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L71)

Config for an interactive button created with [button](../functions/button).

## Type Parameters

| Type Parameter |
| :------ |
| `P` *extends* `string` |
| `R` |

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-disabled"></a> `disabled?` | `boolean` | - |
| <a id="property-emoji"></a> `emoji?` | `ComponentEmojiResolvable` | - |
| <a id="property-guards"></a> `guards?` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] | Preconditions evaluated before the handler runs. |
| <a id="property-id"></a> `id` | `P` | Custom-id pattern, e.g. `"vote"` or `"vote:{choice}"`. |
| <a id="property-label"></a> `label?` | `string` | - |
| <a id="property-run"></a> `run` | (`ctx`) => `Awaitable`\<`R`\> | - |
| <a id="property-style"></a> `style?` | [`ButtonStyleInput`](../type-aliases/ButtonStyleInput) | - |
