---
title: "Embeds"
description: "Builds preset embeds with consistent colors and icons."
---

Defined in: [src/embeds.ts:82](https://github.com/byigitt/spearkit/blob/main/src/embeds.ts#L82)

Builds preset embeds with consistent colors and icons.

## Example

```ts
const embeds = new Embeds({ colors: { success: 0x00ff88 } });
await channel.send({ embeds: [embeds.success("Saved.")] });
```

## Constructors

### Constructor

> **new Embeds**(`options?`): `Embeds`

Defined in: [src/embeds.ts:88](https://github.com/byigitt/spearkit/blob/main/src/embeds.ts#L88)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`EmbedsOptions`](../interfaces/EmbedsOptions) |

#### Returns

`Embeds`

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-colors"></a> `colors` | `readonly` | [`EmbedColors`](../interfaces/EmbedColors) | The resolved colors for every preset. |
| <a id="property-icons"></a> `icons` | `readonly` | [`EmbedIcons`](../interfaces/EmbedIcons) | The resolved icons for every preset. |

## Methods

### build()

> **build**(`level`, `input`): `EmbedBuilder`

Defined in: [src/embeds.ts:114](https://github.com/byigitt/spearkit/blob/main/src/embeds.ts#L114)

Build an embed at a chosen level.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `level` | [`EmbedLevel`](../type-aliases/EmbedLevel) |
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |

#### Returns

`EmbedBuilder`

***

### error()

> **error**(`input`): `EmbedBuilder`

Defined in: [src/embeds.ts:94](https://github.com/byigitt/spearkit/blob/main/src/embeds.ts#L94)

Red preset — something went wrong.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |

#### Returns

`EmbedBuilder`

***

### info()

> **info**(`input`): `EmbedBuilder`

Defined in: [src/embeds.ts:104](https://github.com/byigitt/spearkit/blob/main/src/embeds.ts#L104)

Blue preset — neutral information.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |

#### Returns

`EmbedBuilder`

***

### success()

> **success**(`input`): `EmbedBuilder`

Defined in: [src/embeds.ts:99](https://github.com/byigitt/spearkit/blob/main/src/embeds.ts#L99)

Green preset — something succeeded.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |

#### Returns

`EmbedBuilder`

***

### warn()

> **warn**(`input`): `EmbedBuilder`

Defined in: [src/embeds.ts:109](https://github.com/byigitt/spearkit/blob/main/src/embeds.ts#L109)

Yellow preset — caution.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`EmbedPresetInput`](../type-aliases/EmbedPresetInput) |

#### Returns

`EmbedBuilder`
