---
title: "RedisSetOptions"
description: "Options accepted by RedisCommands.set for NX/PX writes."
---

Defined in: [src/redis-store.ts:11](https://github.com/byigitt/spearkit/blob/main/src/redis-store.ts#L11)

Options accepted by [RedisCommands.set](RedisCommands#set) for NX/PX writes.

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-nx"></a> `NX?` | `boolean` | Set only if the key does not exist. |
| <a id="property-px"></a> `PX?` | `number` | Expire after this many milliseconds. |
