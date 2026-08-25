---
title: "PrefixCommand"
description: "A registrable prefix command. Build it with prefixCommand."
---

Defined in: [src/prefix.ts:77](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L77)

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| <a id="property-aliases"></a> `aliases` | `readonly` | readonly `string`[] |
| <a id="property-cooldown"></a> `cooldown?` | `readonly` | [`CooldownConfig`](../../cooldowns-and-scaling/interfaces/CooldownConfig) |
| <a id="property-description"></a> `description?` | `readonly` | `string` |
| <a id="property-enabled"></a> `enabled` | `readonly` | `boolean` |
| <a id="property-guards"></a> `guards?` | `readonly` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] |
| <a id="property-kind"></a> `kind` | `readonly` | `"prefixCommand"` |
| <a id="property-name"></a> `name` | `readonly` | `string` |
| <a id="property-parser"></a> `parser?` | `readonly` | [`PrefixArgsParser`](PrefixArgsParser)\<`Record`\<`string`, `unknown`\>\> |
| <a id="property-run"></a> `run` | `readonly` | (`ctx`: [`PrefixContext`](../classes/PrefixContext)) => `Promise`\<`void`\> |
