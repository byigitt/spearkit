---
title: "isHTTPError()"
description: "Narrow to a transport-level HTTPError (timeouts, 5xx, aborted requests) — failures with an HTTP status but no Discord JSON code."
---

> **isHTTPError**(`error`): `error is HTTPError`

Defined in: [src/discord-errors.ts:92](https://github.com/byigitt/spearkit/blob/main/src/discord-errors.ts#L92)

Narrow to a transport-level HTTPError (timeouts, 5xx, aborted
requests) — failures with an HTTP status but no Discord JSON code.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |

## Returns

`error is HTTPError`
