---
title: "CronExpression"
description: "A parsed cron expression. Evaluates in the host's local time."
---

Defined in: [src/scheduler.ts:66](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L66)

A parsed cron expression. Evaluates in the host's local time.

## Example

```ts
cron("*\u200b/5 * * * *").next();          // next 5-minute boundary
cron("@daily").next(new Date());           // next midnight
```

## Constructors

### Constructor

> **new CronExpression**(`expression`): `CronExpression`

Defined in: [src/scheduler.ts:77](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L77)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `expression` | `string` |

#### Returns

`CronExpression`

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-source"></a> `source` | `readonly` | `string` | The original expression string. |

## Methods

### next()

> **next**(`from?`): `Date`

Defined in: [src/scheduler.ts:119](https://github.com/byigitt/spearkit/blob/main/src/scheduler.ts#L119)

The next time strictly after `from` (default now) that matches.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `from` | `Date` |

#### Returns

`Date`
