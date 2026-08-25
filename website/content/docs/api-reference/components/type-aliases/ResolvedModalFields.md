---
title: "ResolvedModalFields\\<F\\>"
description: "Resolves a whole ModalFieldMap into the handler's fields object."
---

> **ResolvedModalFields**\<`F`\> = `{ [K in keyof F]: ResolvedFieldValue<F[K]> }`

Defined in: [src/components/builders.ts:427](https://github.com/byigitt/spearkit/blob/main/src/components/builders.ts#L427)

Resolves a whole [ModalFieldMap](ModalFieldMap) into the handler's `fields` object.

## Type Parameters

| Type Parameter |
| :------ |
| `F` *extends* [`ModalFieldMap`](ModalFieldMap) |
