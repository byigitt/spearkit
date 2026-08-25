---
title: "armAutoDefer()"
description: "Arm a one-shot timer that calls deferReply() if the interaction is still un-acknowledged when it fires. Returns a cancel function — always call it once your…"
---

> **armAutoDefer**(`interaction`, `config`): () => `void`

Defined in: [src/auto-defer.ts:58](https://github.com/byigitt/spearkit/blob/main/src/auto-defer.ts#L58)

Arm a one-shot timer that calls `deferReply()` if the interaction is still
un-acknowledged when it fires. Returns a cancel function — always call it
once your handler settles (e.g. in a `finally`) to disarm the timer.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | [`AutoDeferrableInteraction`](../type-aliases/AutoDeferrableInteraction) |
| `config` | [`AutoDeferConfig`](../interfaces/AutoDeferConfig) |

## Returns

() => `void`
