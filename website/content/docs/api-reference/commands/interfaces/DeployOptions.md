---
title: "DeployOptions"
description: "Options for pushing commands to discord."
---

Defined in: [src/commands/registry.ts:34](https://github.com/byigitt/spearkit/blob/main/src/commands/registry.ts#L34)

Options for pushing commands to discord.

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-applicationid"></a> `applicationId` | `string` | Application (client) id. |
| <a id="property-guildid"></a> `guildId?` | `string` | Deploy to a single guild (updates instantly) instead of globally. |
| <a id="property-rest"></a> `rest?` | `REST` | Reuse an existing REST instance instead of creating one. |
| <a id="property-token"></a> `token?` | `string` | Bot token. Falls back to the client token when omitted. |
