# Discord API errors

discord.js reports REST failures as `DiscordAPIError` with a numeric `code`
(`10008` "Unknown Message", `50013` "Missing Permissions", `50007` "Cannot send
DMs to this user", …). Catching *everything* turns recoverable failures — a
deleted message, a closed DM — into crashes or scary stack traces. spearkit gives
you named codes, a type-narrowing predicate, and a friendly explanation.

## Recognise and recover

`isDiscordError(err, code?)` narrows the throw and optionally matches a code
(or a list). Perfect for "ignore this one, re-throw the rest":

```ts
import { DiscordErrorCode, isDiscordError } from "spearkit";

try {
  await message.delete();
} catch (err) {
  if (isDiscordError(err, DiscordErrorCode.UnknownMessage)) return; // already gone
  throw err;
}
```

```ts
// match any of several codes
if (isDiscordError(err, [DiscordErrorCode.UnknownChannel, DiscordErrorCode.MissingAccess])) {
  return;
}
```

## Friendly messages

`explainDiscordError(err)` returns an end-user-appropriate sentence for a
recognised failure, or `null` otherwise (fall back to a generic message + log):

```ts
import { explainDiscordError } from "spearkit";

catch (err) {
  await ctx.error(explainDiscordError(err) ?? "Something went wrong.");
}
```

spearkit already routes its own command/context-menu errors through
`explainDiscordError`, so a handler that throws `Missing Permissions` shows the
user *"I'm missing the permissions needed to do that."* instead of a generic
error.

## Named codes

`DiscordErrorCode` is a curated map of the codes bots actually hit:

| Name | Code | When |
| --- | --- | --- |
| `UnknownChannel` | 10003 | Channel gone/invisible |
| `UnknownMessage` | 10008 | Message deleted |
| `UnknownMember` | 10007 | Member left |
| `UnknownInteraction` | 10062 | Token expired (the 3s window) |
| `MissingAccess` | 50001 | No access to the resource |
| `CannotSendMessagesToThisUser` | 50007 | DMs closed / blocked |
| `MissingPermissions` | 50013 | Missing a permission |
| `InteractionHasAlreadyBeenAcknowledged` | 40060 | Double-acked |

(See the type for the full set — it mirrors discord.js' `RESTJSONErrorCodes`.)

## Transport & rate-limit errors

- `isHTTPError(err)` — a transport-level `HTTPError` (timeout, 5xx, aborted): an
  HTTP status with no Discord JSON code.
- `isRateLimitError(err)` — a `DiscordAPIError` with HTTP status `429`.
  `explainDiscordError` handles this case first, returning a "try again in a
  moment" message.
