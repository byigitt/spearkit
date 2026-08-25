---
title: "ComponentRegistry"
description: "Routes button, select and modal interactions to the handlers registered for their custom-id namespace. Decodes the custom-id, extracts typed params, and…"
---

Defined in: [src/components/registry.ts:93](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L93)

Routes button, select and modal interactions to the handlers registered for
their custom-id namespace. Decodes the custom-id, extracts typed params, and
invokes the matching handler.

## Constructors

### Constructor

> **new ComponentRegistry**(): `ComponentRegistry`

#### Returns

`ComponentRegistry`

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/components/registry.ts:161](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L161)

Total number of registered components.

##### Returns

`number`

## Methods

### add()

> **add**(...`defs`): `this`

Defined in: [src/components/registry.ts:107](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L107)

Register one or more components. Later registrations override by namespace.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`defs` | [`ComponentDef`](../type-aliases/ComponentDef)[] |

#### Returns

`this`

***

### handle()

> **handle**(`interaction`): `Promise`\<`boolean`\>

Defined in: [src/components/registry.ts:177](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L177)

Dispatch an interaction to its component handler. Returns `true` if a
handler matched and ran, `false` otherwise.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `interaction` | `Interaction` |

#### Returns

`Promise`\<`boolean`\>

***

### onError()

> **onError**(`handler`): `this`

Defined in: [src/components/registry.ts:137](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L137)

Set the handler used when a component throws.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `handler` | [`ComponentErrorHandler`](../type-aliases/ComponentErrorHandler) |

#### Returns

`this`

***

### setDefaultGuards()

> **setDefaultGuards**(`guards`): `this`

Defined in: [src/components/registry.ts:155](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L155)

Guards that run before every component's own guards.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `guards` | readonly [`Guard`](../../access-control/type-aliases/Guard)[] |

#### Returns

`this`

***

### setLogger()

> **setLogger**(`logger`): `this`

Defined in: [src/components/registry.ts:143](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L143)

Attach a logger used for dispatch tracing (debug level).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `logger` | [`Logger`](../../runtime/classes/Logger) |

#### Returns

`this`

***

### setUsageHook()

> **setUsageHook**(`hook`): `this`

Defined in: [src/components/registry.ts:149](https://github.com/byigitt/spearkit/blob/main/src/components/registry.ts#L149)

Attach a hook called after each successful component handler run.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `hook` | (`event`) => `void` |

#### Returns

`this`
