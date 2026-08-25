---
title: "Intents"
description: "Ready-made intent presets. Pass one to SpearClient as intents. all includes privileged intents — enable them in the developer portal."
---

```ts
const Intents: object;
```

Defined in: [src/client.ts:56](https://github.com/byigitt/spearkit/blob/main/src/client.ts#L56)

## Type Declaration

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-all"></a> `all` | `GatewayIntentBits`[] | `allIntents` | Every intent, including privileged ones. |
| <a id="property-default"></a> `default` | readonly \[`Guilds`\] | - | Just `Guilds` — enough for slash commands and interactions. |
| <a id="property-guilds"></a> `guilds` | readonly \[`Guilds`, `GuildMembers`\] | - | Guild + member gateway data. |
| <a id="property-messages"></a> `messages` | readonly \[`Guilds`, `GuildMessages`, `MessageContent`\] | - | Read message content (privileged) alongside guild messages. |
| <a id="property-none"></a> `none` | `GatewayIntentBits`[] | - | No intents. |
