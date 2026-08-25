---
title: "PrefixOptions"
description: "Options controlling how prefix messages are recognised."
---

Defined in: [src/prefix.ts:35](https://github.com/byigitt/spearkit/blob/main/src/prefix.ts#L35)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-caseinsensitive"></a> `caseInsensitive?` | `boolean` | Match command names case-insensitively. Default `true`. |
| <a id="property-dynamic"></a> `dynamic?` | (`message`: `Message`) => `Awaitable`\<`string` \| readonly `string`[] \| `null` \| `undefined`\> | Resolve extra prefix(es) per message — e.g. a custom per-guild prefix from a database or createSettings. Returned prefixes are tried in addition to any static `prefix`. Return `null`/`undefined` for none. Keep it fast (and cached): it runs on every candidate message. |
| <a id="property-ignorebots"></a> `ignoreBots?` | `boolean` | Ignore messages authored by bots. Default `true`. |
| <a id="property-mention"></a> `mention?` | `boolean` | Also accept a leading bot mention as a prefix. Default `true`. |
| <a id="property-prefix"></a> `prefix?` | `string` \| readonly `string`[] | One or more command prefixes (e.g. `"!"` or `["!", "?"]`). |
