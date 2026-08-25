---
title: "GuardResult"
description: "A guard's outcome. true = pass; false/{ allowed: false, reason? } = deny."
---

> **GuardResult** = `boolean` \| \{ `allowed`: `false`; `reason?`: `string`; \}

Defined in: [src/guards.ts:38](https://github.com/byigitt/spearkit/blob/main/src/guards.ts#L38)

A guard's outcome. `true` = pass; `false`/`{ allowed: false, reason? }` = deny.
