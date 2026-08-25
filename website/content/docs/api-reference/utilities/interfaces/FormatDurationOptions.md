---
title: "FormatDurationOptions"
description: "Options for formatDuration."
---

Defined in: [src/format.ts:62](https://github.com/byigitt/spearkit/blob/main/src/format.ts#L62)

Options for [formatDuration](../functions/formatDuration).

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-largest"></a> `largest?` | `number` | How many non-zero units to keep. Default `2`. Pass `Infinity` to keep all. |
| <a id="property-locale"></a> `locale?` | `string` \| `UnitLabels` | Locale label set: `"en"`, `"en-US"`, `"tr"`, `"tr-TR"`, or a custom set. |
| <a id="property-units"></a> `units?` | readonly `DurationUnit`[] | Subset of units to consider (in order: week → second). |
