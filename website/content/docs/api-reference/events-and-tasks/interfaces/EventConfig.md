---
title: "EventConfig\\<E\\>"
description: "Object form accepted by event."
---

Defined in: [src/events.ts:9](https://github.com/byigitt/spearkit/blob/main/src/events.ts#L9)

Object form accepted by [event](../functions/event).

## Type Parameters

| Type Parameter |
| :------ |
| `E` *extends* keyof `ClientEvents` |

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-name"></a> `name` | `E` | - |
| <a id="property-once"></a> `once?` | `boolean` | Run the handler at most once, then auto-detach. |
| <a id="property-run"></a> `run` | [`EventHandler`](../type-aliases/EventHandler)\<`E`\> | - |
