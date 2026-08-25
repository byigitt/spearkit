---
title: "Contexts and replies"
description: "Shared handler contexts, collectors, and reply embed helpers."
---

## Classes

| Class | Description |
| :------ | :------ |
| [BaseContext](classes/BaseContext) | Ergonomic base wrapper shared by every interaction context (commands, buttons, selects, modals). Exposes the common actor/location accessors plus reply helpers that smooth over discord.js' state machine. |
| [Embeds](classes/Embeds) | Builds preset embeds with consistent colors and icons. |

## Interfaces

| Interface | Description |
| :------ | :------ |
| [AwaitComponentOptions](interfaces/AwaitComponentOptions) | Options for [awaitComponent](functions/awaitComponent). |
| [AwaitMessageOptions](interfaces/AwaitMessageOptions) | Options for [awaitMessage](functions/awaitMessage). |
| [AwaitModalOptions](interfaces/AwaitModalOptions) | Options for [showAndAwaitModal](functions/showAndAwaitModal). |
| [EmbedColors](interfaces/EmbedColors) | Color in `0xRRGGBB` form for each preset level. |
| [EmbedIcons](interfaces/EmbedIcons) | Icon glyph prepended to the description of each preset. Pass `""` to drop. |
| [EmbedsOptions](interfaces/EmbedsOptions) | Construction options for [Embeds](classes/Embeds). Missing fields fall back to defaults. |
| [ProgressHandle](interfaces/ProgressHandle) | Handle returned by [BaseContext.progress](classes/BaseContext#progress). |

## Type Aliases

| Type Alias | Description |
| :------ | :------ |
| [CollectableChannel](type-aliases/CollectableChannel) | A text-based channel that can collect messages — every TextBasedChannel except `PartialGroupDMChannel` (which has no message manager). |
| [EmbedLevel](type-aliases/EmbedLevel) | One of the four built-in preset levels. |
| [EmbedPresetInput](type-aliases/EmbedPresetInput) | Shape accepted by every preset: a plain string or a structured body. |
| [ModalLike](type-aliases/ModalLike) | A modal in any of the forms discord.js' `showModal` accepts. |
| [ModalShowingInteraction](type-aliases/ModalShowingInteraction) | Interactions that can open a modal and await its submission. |
| [ReplyData](type-aliases/ReplyData) | Reply options with an ergonomic `ephemeral` shortcut (mapped to flags). |
| [ReplyInput](type-aliases/ReplyInput) | Either a plain string or full reply options. |

## Variables

| Variable | Description |
| :------ | :------ |
| [DEFAULT\_EMBED\_COLORS](variables/DEFAULT_EMBED_COLORS) | Discord-ish defaults: red / green / blue / yellow + ⛔ ✅ ℹ️ ⚠️. |
| [DEFAULT\_EMBED\_ICONS](variables/DEFAULT_EMBED_ICONS) | Default icons: warning / check / info / triangle. |
| [defaultEmbeds](variables/defaultEmbeds) | The shared default factory — used by contexts when the client has none. |

## Functions

| Function | Description |
| :------ | :------ |
| [asEphemeral](functions/asEphemeral) | Marks an input as ephemeral, regardless of how it was passed. |
| [awaitComponent](functions/awaitComponent) | Wait for the next component interaction (button/select click) on `message`, resolving to it or `null` on timeout. Note: you must still acknowledge the returned interaction (`update`/`deferUpdate`/`reply`). |
| [awaitMessage](functions/awaitMessage) | Wait for the next message in `channel` that matches `filter`, resolving to the `Message` or `null` if none arrives before `time` elapses. |
| [normalizeReply](functions/normalizeReply) | Normalises spearkit reply input into a discord.js reply payload. |
| [showAndAwaitModal](functions/showAndAwaitModal) | Show `modal` on `interaction`, then wait for its submission — scoped to the same user and the modal's own custom-id — resolving to the ModalSubmitInteraction or `null` if the user dismisses it / it times out. Sidesteps the "Unknown interaction after cancelling a modal" trap by always bounding the wait. |
