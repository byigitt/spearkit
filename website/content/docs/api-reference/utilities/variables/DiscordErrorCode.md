---
title: "DiscordErrorCode"
description: "The Discord JSON error codes spearkit cares about most, by readable name. This is a curated subset of discord.js' RESTJSONErrorCodes covering the failures bots actually hit and can recover from. Values are the numeric codes Discord returns on DiscordAPIError.code."
---

```ts
const DiscordErrorCode: object;
```

Defined in: [src/discord-errors.ts:30](https://github.com/byigitt/spearkit/blob/main/src/discord-errors.ts#L30)

## Type Declaration

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| <a id="property-cannotexecuteactionondmchannel"></a> `CannotExecuteActionOnDMChannel` | `CannotExecuteActionOnDMChannel` | `RESTJSONErrorCodes.CannotExecuteActionOnDMChannel` | Action attempted on a DM channel that does not support it. |
| <a id="property-cannotsendmessagestothisuser"></a> `CannotSendMessagesToThisUser` | `CannotSendMessagesToThisUser` | `RESTJSONErrorCodes.CannotSendMessagesToThisUser` | The target user has DMs closed or blocked the bot. |
| <a id="property-interactionhasalreadybeenacknowledged"></a> `InteractionHasAlreadyBeenAcknowledged` | `InteractionHasAlreadyBeenAcknowledged` | `RESTJSONErrorCodes.InteractionHasAlreadyBeenAcknowledged` | The interaction was already acknowledged elsewhere. |
| <a id="property-invalidformbodyorcontenttype"></a> `InvalidFormBodyOrContentType` | `InvalidFormBodyOrContentType` | `RESTJSONErrorCodes.InvalidFormBodyOrContentType` | The request body failed Discord's validation. |
| <a id="property-maximumnumberofguildsreached"></a> `MaximumNumberOfGuildsReached` | `MaximumNumberOfGuildsReached` | `RESTJSONErrorCodes.MaximumNumberOfGuildsReached` | The bot reached the maximum number of guilds it may join. |
| <a id="property-maximumnumberofreactionsreached"></a> `MaximumNumberOfReactionsReached` | `MaximumNumberOfReactionsReached` | `RESTJSONErrorCodes.MaximumNumberOfReactionsReached` | Too many active reactions / pins / etc. of this kind. |
| <a id="property-missingaccess"></a> `MissingAccess` | `MissingAccess` | `RESTJSONErrorCodes.MissingAccess` | The bot lacks access to the resource entirely (not just one permission). |
| <a id="property-missingpermissions"></a> `MissingPermissions` | `MissingPermissions` | `RESTJSONErrorCodes.MissingPermissions` | The bot is missing one or more permissions required for the action. |
| <a id="property-unknownchannel"></a> `UnknownChannel` | `UnknownChannel` | `RESTJSONErrorCodes.UnknownChannel` | A referenced channel no longer exists or is invisible to the bot. |
| <a id="property-unknownguild"></a> `UnknownGuild` | `UnknownGuild` | `RESTJSONErrorCodes.UnknownGuild` | The targeted guild is gone or the bot was removed from it. |
| <a id="property-unknowninteraction"></a> `UnknownInteraction` | `UnknownInteraction` | `RESTJSONErrorCodes.UnknownInteraction` | The interaction token expired (the classic 3-second-window failure). |
| <a id="property-unknownmember"></a> `UnknownMember` | `UnknownMember` | `RESTJSONErrorCodes.UnknownMember` | The referenced member is not in the guild. |
| <a id="property-unknownmessage"></a> `UnknownMessage` | `UnknownMessage` | `RESTJSONErrorCodes.UnknownMessage` | The message was deleted (or never existed) before the action ran. |
| <a id="property-unknownuser"></a> `UnknownUser` | `UnknownUser` | `RESTJSONErrorCodes.UnknownUser` | The user could not be resolved. |
