---
title: "confirm()"
description: "Show a yes/no confirmation prompt and wait for the user's choice. Resolves once a button is clicked or the timeout fires. The clicked button is automatically…"
---

> **confirm**(`interaction`, `options`): `Promise`\<[`ConfirmResult`](../interfaces/ConfirmResult)\>

Defined in: [src/confirm.ts:86](https://github.com/byigitt/spearkit/blob/main/src/confirm.ts#L86)

Show a yes/no confirmation prompt and wait for the user's choice.

Resolves once a button is clicked or the timeout fires. The clicked button
is automatically acknowledged via `deferUpdate`, and the original message's
buttons are disabled. Returns `{ confirmed, reason, interaction? }`.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `RepliableInteraction` |
| `options` | [`ConfirmOptions`](../interfaces/ConfirmOptions) |

## Returns

`Promise`\<[`ConfirmResult`](../interfaces/ConfirmResult)\>
