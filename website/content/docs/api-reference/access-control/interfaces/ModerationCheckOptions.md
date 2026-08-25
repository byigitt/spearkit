---
title: "ModerationCheckOptions"
description: "Options for moderationCheck."
---

Defined in: [src/permissions.ts:97](https://github.com/byigitt/spearkit/blob/main/src/permissions.ts#L97)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-action"></a> `action?` | `string` | Verb used in the failure messages, e.g. `"ban"`. Default `"moderate"`. |
| <a id="property-me"></a> `me?` | `GuildMember` \| `null` | The bot's own member. Defaults to `target.guild.members.me`. Pass `null` to skip the bot-hierarchy check (e.g. when the action doesn't need it). |
| <a id="property-moderator"></a> `moderator` | `GuildMember` | The member attempting the action. |
| <a id="property-target"></a> `target` | `GuildMember` | The member the action targets. |
