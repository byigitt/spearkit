---
title: "CooldownConfig"
description: "Full cooldown description."
---

Defined in: [src/cooldown.ts:30](https://github.com/byigitt/spearkit/blob/main/src/cooldown.ts#L30)

Full cooldown description.

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-duration"></a> `duration` | `number` | Base cooldown in milliseconds. |
| <a id="property-exempt"></a> `exempt?` | [`CooldownExemptions`](CooldownExemptions) | Users/roles that bypass the cooldown. |
| <a id="property-message"></a> `message?` | `string` \| ((`remainingMs`) => `string`) | Message shown when blocked. A function receives the remaining ms. |
| <a id="property-overrides"></a> `overrides?` | [`CooldownOverrides`](CooldownOverrides) | Per-user / per-role duration overrides. |
| <a id="property-scope"></a> `scope?` | [`CooldownScope`](../type-aliases/CooldownScope) | What the cooldown is keyed on. Default `"user"`. |
