---
title: "access-control"
description: "access-control in the spearkit API."
---

## Interfaces

| Interface | Description |
| :------ | :------ |
| [GuardContext](interfaces/GuardContext) | Minimal context a guard reads. Every spearkit handler (slash/prefix/component /modal) already exposes these — guards work uniformly across all of them. |
| [ModerationCheckOptions](interfaces/ModerationCheckOptions) | Options for [moderationCheck](functions/moderationCheck). |

## Type Aliases

| Type Alias | Description |
| :------ | :------ |
| [Guard](type-aliases/Guard) | A precondition evaluated before a handler runs. |
| [GuardResult](type-aliases/GuardResult) | A guard's outcome. `true` = pass; `false`/`{ allowed: false, reason? }` = deny. |
| [ModerationCheckResult](type-aliases/ModerationCheckResult) | The result of a [moderationCheck](functions/moderationCheck): pass, or fail with a reason. |
| [PermissionHolder](type-aliases/PermissionHolder) | A member or role whose permissions are being resolved in a channel. |
| [RunGuardsResult](type-aliases/RunGuardsResult) | The resolved outcome of running a list of guards. |

## Functions

| Function | Description |
| :------ | :------ |
| [botMissingPermissions](functions/botMissingPermissions) | Like [missingPermissions](functions/missingPermissions) but for the bot's own member in `channel`. Resolves `channel.guild.members.me`; if that isn't available, every required permission is reported missing. |
| [canActOn](functions/canActOn) | Whether `actor` outranks `target` enough to act on them: not the same member, `target` isn't the guild owner, and `actor` is either the owner or holds a higher top role. |
| [compareRoles](functions/compareRoles) | Compare two members by their highest role position. Returns a positive number when `a` is above `b`, negative when below, `0` when equal. This is the raw comparison Discord enforces for moderation actions. |
| [denied](functions/denied) | Sugar: build a denial result with an explanation. |
| [dmOnly](functions/dmOnly) | Require the interaction/message to come from a DM. |
| [formatPermissions](functions/formatPermissions) | Render permission flag names into a human, comma-separated string. Accepts a PermissionsString array (the output of [missingPermissions](functions/missingPermissions)) or anything PermissionResolvable. |
| [guard](functions/guard) | Inline custom predicate; sugar so a one-off check still types as a Guard. |
| [guildOnly](functions/guildOnly) | Require the interaction/message to come from inside a guild. |
| [hasPermissions](functions/hasPermissions) | Whether `who` has all of `required` in `channel`. |
| [missingPermissions](functions/missingPermissions) | Return the names of the `required` permissions that `who` does NOT have in `channel` (taking channel overwrites and Administrator into account). An empty array means every required permission is granted. When permissions can't be resolved (e.g. the member isn't cached) every required permission is reported missing. |
| [moderationCheck](functions/moderationCheck) | Validate that both the moderator and the bot may act on `target`, returning a ready-to-show reason on the first failing rule. Checks, in order: acting on self, acting on the server owner, moderator role hierarchy, and bot role hierarchy. |
| [requireAllRoles](functions/requireAllRoles) | Require the invoking member to hold EVERY one of these role ids. |
| [requireAnyRole](functions/requireAnyRole) | Require the invoking member to hold ANY of these role ids. |
| [requireBotOwner](functions/requireBotOwner) | Require the invoking user to be a configured bot owner (`new SpearClient({ owners })`) or the Discord application owner. |
| [requireBotPermissions](functions/requireBotPermissions) | Require the BOT's own member to hold a Discord permission flag. |
| [requireOwner](functions/requireOwner) | Require the invoking user to be one of `ownerIds` ("bot owners"). |
| [requireUserPermissions](functions/requireUserPermissions) | Require the invoking member to hold a Discord permission flag. |
| [runGuards](functions/runGuards) | Run guards in order, short-circuiting on the first denial. |
