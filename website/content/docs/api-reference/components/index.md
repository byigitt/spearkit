---
title: "Components"
description: "Buttons, selects, modals, component contexts, layouts, and payload routing."
---

## Classes

| Class | Description |
| :------ | :------ |
| [ButtonContext](classes/ButtonContext) | Context for a button click. |
| [ChannelSelectContext](classes/ChannelSelectContext) | Context for a channel select. |
| [ComponentRegistry](classes/ComponentRegistry) | Routes button, select and modal interactions to the handlers registered for their custom-id namespace. Decodes the custom-id, extracts typed params, and invokes the matching handler. |
| [MentionableSelectContext](classes/MentionableSelectContext) | Context for a mentionable (user + role) select. |
| [MessageComponentContext](classes/MessageComponentContext) | Base context for message-component interactions (buttons and selects). Adds the component-only `update`/`deferUpdate`/`showModal` helpers and the routed, typed [params](classes/MessageComponentContext#property-params). |
| [ModalContext](classes/ModalContext) | Context for a submitted modal. Exposes the routed [params](classes/ModalContext#property-params) plus the resolved [fields](classes/ModalContext#property-fields), keyed by the field names you declared and typed by each field definition (text inputs are `string`, radio groups narrow to their option values, checkboxes are `boolean`, uploads resolve to Attachment[]). |
| [RoleSelectContext](classes/RoleSelectContext) | Context for a role select. |
| [StringSelectContext](classes/StringSelectContext) | Context for a string select; exposes the chosen [values](classes/StringSelectContext#values). |
| [UserSelectContext](classes/UserSelectContext) | Context for a user select; exposes selected ids, users and members. |

## Interfaces

| Interface | Description |
| :------ | :------ |
| [Button](interfaces/Button) | A registrable button with a typed [build](interfaces/Button#build). |
| [ButtonConfig](interfaces/ButtonConfig) | Config for an interactive button created with [button](functions/button). |
| [ButtonRoute](interfaces/ButtonRoute) | Routing entry for a button. |
| [ChannelSelect](interfaces/ChannelSelect) | A registrable channel select. |
| [ChannelSelectFieldDef](interfaces/ChannelSelectFieldDef) | A channel select field inside a modal. Submits channel ids. |
| [ChannelSelectRoute](interfaces/ChannelSelectRoute) | Routing entry for a channel select. |
| [CheckboxDef](interfaces/CheckboxDef) | A single checkbox field definition. Submits a `boolean` (never `required`). |
| [CheckboxGroupDef](interfaces/CheckboxGroupDef) | A checkbox group field definition. Submits an array of its option values. |
| [CompiledPattern](interfaces/CompiledPattern) | A compiled pattern: its routing namespace and ordered param names. |
| [ConfirmButtonOptions](interfaces/ConfirmButtonOptions) | One of the two buttons. |
| [ConfirmOptions](interfaces/ConfirmOptions) | Options for [confirm](functions/confirm). |
| [ConfirmResult](interfaces/ConfirmResult) | Result of [confirm](functions/confirm). |
| [ContainerConfig](interfaces/ContainerConfig) | Config for [container](functions/container). |
| [CreatePayloadStoreOptions](interfaces/CreatePayloadStoreOptions) | Options for [createPayloadStore](functions/createPayloadStore). |
| [EntitySelectConfig](interfaces/EntitySelectConfig) | Config shared by the entity-select builders (user/role/channel/mentionable). |
| [FileUploadDef](interfaces/FileUploadDef) | A file upload field definition. Submits the uploaded Attachments. |
| [GalleryItem](interfaces/GalleryItem) | One media gallery entry. |
| [GroupOption](interfaces/GroupOption) | One option inside a radio group / checkbox group. |
| [HelpCommandOptions](interfaces/HelpCommandOptions) | Options for [helpCommand](functions/helpCommand). |
| [HelpEntry](interfaces/HelpEntry) | One command shown by the generated help command. |
| [LinkButtonConfig](interfaces/LinkButtonConfig) | Config for a link button (no handler — just opens a URL). |
| [MentionableSelect](interfaces/MentionableSelect) | A registrable mentionable select. |
| [MentionableSelectFieldDef](interfaces/MentionableSelectFieldDef) | A mentionable (user + role) select field inside a modal. Submits ids. |
| [MentionableSelectRoute](interfaces/MentionableSelectRoute) | Routing entry for a mentionable select. |
| [Modal](interfaces/Modal) | A registrable modal with a typed [build](interfaces/Modal#build). |
| [ModalConfig](interfaces/ModalConfig) | Config for a modal created with [modal](functions/modal). |
| [ModalFieldDef](interfaces/ModalFieldDef) | Base of every modal field definition. The two type parameters are phantom markers used purely for compile-time inference of the submitted value: - `TValue` is the type produced for the modal handler. - `TRequired` controls nullability (`false` => value may be missing). |
| [ModalRoute](interfaces/ModalRoute) | Routing entry for a modal submission. |
| [PaginateOptions](interfaces/PaginateOptions) | Options for [paginate](functions/paginate) / [buildPaginatorPage](functions/buildPaginatorPage). |
| [ParsedCustomId](interfaces/ParsedCustomId) | The namespace + raw values parsed out of an incoming custom-id. |
| [PayloadStore](interfaces/PayloadStore) | A token → payload map backed by a [KeyValueStore](../storage/interfaces/KeyValueStore). |
| [PollConfig](interfaces/PollConfig) | Configuration for [poll](functions/poll). |
| [RadioGroupDef](interfaces/RadioGroupDef) | A radio group field definition. Submits one of its option values. |
| [RoleSelect](interfaces/RoleSelect) | A registrable role select. |
| [RoleSelectFieldDef](interfaces/RoleSelectFieldDef) | A role select field inside a modal. Submits role ids. |
| [RoleSelectRoute](interfaces/RoleSelectRoute) | Routing entry for a role select. |
| [SectionConfig](interfaces/SectionConfig) | Config for [section](functions/section): side text plus exactly one accessory. |
| [SeparatorConfig](interfaces/SeparatorConfig) | Config for [separator](functions/separator). |
| [StringSelect](interfaces/StringSelect) | A registrable string select with a typed [build](interfaces/StringSelect#build). |
| [StringSelectConfig](interfaces/StringSelectConfig) | Config for a string select created with [stringSelect](functions/stringSelect). |
| [StringSelectFieldDef](interfaces/StringSelectFieldDef) | A string select field inside a modal. Submits the chosen values. |
| [StringSelectRoute](interfaces/StringSelectRoute) | Routing entry for a string select. |
| [TextInputDef](interfaces/TextInputDef) | A resolved text-input field definition. Submits a `string`. |
| [ThumbnailConfig](interfaces/ThumbnailConfig) | Config for [thumbnail](functions/thumbnail). |
| [UserSelect](interfaces/UserSelect) | A registrable user select. |
| [UserSelectFieldDef](interfaces/UserSelectFieldDef) | A user select field inside a modal. Submits user ids. |
| [UserSelectRoute](interfaces/UserSelectRoute) | Routing entry for a user select. |

## Type Aliases

| Type Alias | Description |
| :------ | :------ |
| [AnyComponentInteraction](type-aliases/AnyComponentInteraction) | The concrete message-component interaction types (button + every select). |
| [AnyModalFieldDef](type-aliases/AnyModalFieldDef) | Any modal field definition, regardless of value type. |
| [BuildArgs](type-aliases/BuildArgs) | Arguments `build()` accepts: none when the pattern has no params. |
| [ButtonStyleInput](type-aliases/ButtonStyleInput) | Accepted button styles for an interactive (custom-id) button. |
| [ComponentDef](type-aliases/ComponentDef) | Any registrable component routing entry. |
| [ComponentErrorHandler](type-aliases/ComponentErrorHandler) | Error hook invoked when a component handler throws. |
| [ConfirmButtonStyle](type-aliases/ConfirmButtonStyle) | Visual style for a confirm/cancel button. |
| [HelpSurface](type-aliases/HelpSurface) | - |
| [ModalFieldKind](type-aliases/ModalFieldKind) | Every modal field kind spearkit knows how to build and read back. |
| [ModalFieldMap](type-aliases/ModalFieldMap) | A map of field name => definition. |
| [PaginateRender](type-aliases/PaginateRender) | Result of [PaginateOptions.render](interfaces/PaginateOptions#property-render): a builder OR a full message payload. |
| [ParamNames](type-aliases/ParamNames) | Names of the `{param}` placeholders inside a pattern. |
| [Params](type-aliases/Params) | The params object a pattern resolves to (every value is a string). |
| [PollAnswerInput](type-aliases/PollAnswerInput) | One answer accepted by [poll](functions/poll). |
| [ResolvedFieldValue](type-aliases/ResolvedFieldValue) | Maps a single field definition to the value passed into the modal handler. Optional fields only widen to include `undefined` when being empty is a meaningful distinct state (radio groups); collection-valued fields resolve to an empty array instead. |
| [ResolvedModalFields](type-aliases/ResolvedModalFields) | Resolves a whole [ModalFieldMap](type-aliases/ModalFieldMap) into the handler's `fields` object. |
| [SectionButton](type-aliases/SectionButton) | Accessory accepted by [section](functions/section): an API button or a ButtonBuilder. |
| [TextInputStyleInput](type-aliases/TextInputStyleInput) | Accepted text-input styles. |
| [V2Child](type-aliases/V2Child) | Anything that can sit inside a container or at the top level of a V2 message. |

## Variables

| Variable | Description |
| :------ | :------ |
| [MAX\_CUSTOM\_ID\_LENGTH](variables/MAX_CUSTOM_ID_LENGTH) | The discord custom-id length limit. |

## Functions

| Function | Description |
| :------ | :------ |
| [buildCustomId](functions/buildCustomId) | Build a concrete custom-id from a compiled pattern and its params. |
| [buildHelpEntries](functions/buildHelpEntries) | Collect command metadata from a client without sending anything. |
| [buildPaginatorPage](functions/buildPaginatorPage) | Build the payload for a single paginator page (embeds + button row), without any interaction or collector wiring. Useful for tests, web previews and custom UIs that want spearkit's slicing/controls but their own send path. |
| [button](functions/button) | Define an interactive button: its appearance, its custom-id pattern and its click handler, all in one place. Register it with `client.components.add`. |
| [channelSelect](functions/channelSelect) | Define a channel select menu, optionally restricted to channel types. |
| [channelSelectField](functions/channelSelectField) | Define a channel select field inside a modal, optionally restricted to channel types. The handler receives channel ids. |
| [checkbox](functions/checkbox) | Define a modal checkbox field (a single yes/no tick). Checkboxes cannot be required per the Discord spec; the handler always receives a `boolean`. |
| [checkboxGroup](functions/checkboxGroup) | Define a modal checkbox-group field (zero or more selectable options). Checkbox groups cannot be `required`; an untouched submit resolves to `[]`. |
| [compilePattern](functions/compilePattern) | Compile and validate a custom-id pattern. Throws on malformed input. |
| [confirm](functions/confirm) | Show a yes/no confirmation prompt and wait for the user's choice. |
| [container](functions/container) | A card: accent-coloured box holding text displays, separators, sections, galleries, files and action rows. Containers cannot be nested. |
| [createPayloadStore](functions/createPayloadStore) | Build a [PayloadStore](interfaces/PayloadStore) over any [KeyValueStore](../storage/interfaces/KeyValueStore). |
| [file](functions/file) | An attached-file block referencing `attachment://…` or a URL. |
| [fileUpload](functions/fileUpload) | Define a modal file-upload field. The handler receives the uploaded Attachments (CDN links — file bodies are not part of the interaction). |
| [helpCommand](functions/helpCommand) | Define a paginated `/help` command backed by the live registries. |
| [linkButton](functions/linkButton) | Build a link button. Link buttons have no custom-id and run no handler. |
| [mediaGallery](functions/mediaGallery) | A grid of remote images/videos. |
| [mentionableSelect](functions/mentionableSelect) | Define a mentionable (user + role) select menu. |
| [mentionableSelectField](functions/mentionableSelectField) | Define a mentionable (user + role) select field inside a modal. |
| [modal](functions/modal) | Define a modal: its title, its custom-id pattern, its typed fields and a submit handler. Every field renders as a Label component; submitted values arrive keyed by field name in `ctx.fields`, inferred from the definitions. |
| [paginate](functions/paginate) | Send an item list across paginated, button-controlled embeds. |
| [paramsFromValues](functions/paramsFromValues) | Map ordered values onto their param names. |
| [parseCustomId](functions/parseCustomId) | Parse an incoming custom-id into its namespace and decoded values. |
| [poll](functions/poll) | Build a Discord poll payload with readable names and early validation. |
| [radioGroup](functions/radioGroup) | Define a modal radio-group field (exactly one selectable option). |
| [roleSelect](functions/roleSelect) | Define a role select menu. |
| [roleSelectField](functions/roleSelectField) | Define a role select field inside a modal. The handler receives role ids. |
| [row](functions/row) | Wrap one or more component builders in an action row. |
| [section](functions/section) | Side-by-side layout: text displays next to one button or thumbnail. |
| [separator](functions/separator) | A spacing/divider block. |
| [stringSelect](functions/stringSelect) | Define a string select menu, its custom-id pattern and its handler. |
| [stringSelectField](functions/stringSelectField) | Define a string select menu field inside a modal. The handler receives the chosen values. |
| [textDisplay](functions/textDisplay) | A text display block (Discord-flavoured markdown allowed). |
| [textInput](functions/textInput) | Define a single modal text-input field. |
| [thumbnail](functions/thumbnail) | An inline thumbnail (used as a section accessory). |
| [userSelect](functions/userSelect) | Define a user select menu. |
| [userSelectField](functions/userSelectField) | Define a user select field inside a modal. The handler receives user ids. |
