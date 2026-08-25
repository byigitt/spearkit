---
title: "ConfirmOptions"
description: "Options for confirm."
---

Defined in: [src/confirm.ts:39](https://github.com/byigitt/spearkit/blob/main/src/confirm.ts#L39)

Options for [confirm](../functions/confirm).

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-body"></a> `body` | `string` | Embed body. |
| <a id="property-cancel"></a> `cancel?` | [`ConfirmButtonOptions`](ConfirmButtonOptions) | Cancel button config. Defaults: label `"Cancel"`, style `"Secondary"`. |
| <a id="property-confirm"></a> `confirm?` | [`ConfirmButtonOptions`](ConfirmButtonOptions) | Confirm button config. Defaults: label `"Confirm"`, style `"Success"`. |
| <a id="property-ephemeral"></a> `ephemeral?` | `boolean` | Make the prompt ephemeral. Default `true`. |
| <a id="property-namespace"></a> `namespace?` | `string` | Custom-id prefix to avoid clashes. Default `"spk-confirm"`. |
| <a id="property-timeoutms"></a> `timeoutMs?` | `number` | Time (ms) before the prompt times out as cancelled. Default `30_000`. |
| <a id="property-title"></a> `title?` | `string` | Embed title. |
| <a id="property-user"></a> `user?` | `string` | Only this user id can click. Defaults to the invoker. |
