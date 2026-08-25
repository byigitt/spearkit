---
title: "event()"
description: "event() in the spearkit API."
---

## Call Signature

> **event**\<`E`\>(`name`, `run`): [`EventDef`](../interfaces/EventDef)

Defined in: [src/events.ts:76](https://github.com/byigitt/spearkit/blob/main/src/events.ts#L76)

Define a discord.js event listener with a fully-typed handler. Thrown errors
and rejected promises are routed to the client's `error` event instead of
crashing the process.

### Type Parameters

| Type Parameter |
| :------ |
| `E` *extends* keyof `ClientEvents` |

### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `E` |
| `run` | [`EventHandler`](../type-aliases/EventHandler)\<`E`\> |

### Returns

[`EventDef`](../interfaces/EventDef)

### Example

```ts
export default event("messageCreate", (message) => {
  if (message.author.bot) return;
  // message is fully typed as Message
});
```

## Call Signature

> **event**\<`E`\>(`config`): [`EventDef`](../interfaces/EventDef)

Defined in: [src/events.ts:77](https://github.com/byigitt/spearkit/blob/main/src/events.ts#L77)

Define a discord.js event listener with a fully-typed handler. Thrown errors
and rejected promises are routed to the client's `error` event instead of
crashing the process.

### Type Parameters

| Type Parameter |
| :------ |
| `E` *extends* keyof `ClientEvents` |

### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`EventConfig`](../interfaces/EventConfig)\<`E`\> |

### Returns

[`EventDef`](../interfaces/EventDef)

### Example

```ts
export default event("messageCreate", (message) => {
  if (message.author.bot) return;
  // message is fully typed as Message
});
```
