---
title: "LoadOptions"
description: "Options for the directory loader."
---

Defined in: [src/loader.ts:8](https://github.com/byigitt/spearkit/blob/main/src/loader.ts#L8)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-extensions"></a> `extensions?` | readonly `string`[] | File extensions to import. Default: `.js`, `.mjs`, `.cjs`. Ignored when [typescript](#property-typescript) is true unless you also pass this (then your list wins). |
| <a id="property-recursive"></a> `recursive?` | `boolean` | Recurse into subdirectories. Default: `true`. |
| <a id="property-typescript"></a> `typescript?` | `boolean` | Also import `.ts` / `.mts` source. Requires a runtime that can load TypeScript (`tsx`, `bun`, or Node with type stripping). Default: `false`. |
