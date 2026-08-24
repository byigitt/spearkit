/**
 * Bot invite URL builder — the OAuth2 authorize link every README needs.
 */
import { PermissionsBitField, type PermissionResolvable } from "discord.js";

/** Options for {@link inviteUrl}. */
export interface InviteUrlOptions {
  /** Application / bot user id. */
  clientId: string;
  /** Permission bitfield requested for the bot. */
  permissions?: PermissionResolvable;
  /**
   * OAuth2 scopes. Default `["bot", "applications.commands"]` so slash
   * commands work after invite.
   */
  scopes?: readonly string[];
  /** Pre-select this guild in the picker. */
  guildId?: string;
  /** Hide the guild picker when `guildId` is set. */
  disableGuildSelect?: boolean;
}

/**
 * Build a Discord OAuth2 invite URL.
 *
 * @example
 * ```ts
 * inviteUrl({
 *   clientId: "123",
 *   permissions: ["BanMembers", "KickMembers"],
 * });
 * ```
 */
export function inviteUrl(options: InviteUrlOptions): string {
  const params = new URLSearchParams({
    client_id: options.clientId,
    scope: (options.scopes ?? ["bot", "applications.commands"]).join(" "),
  });
  if (options.permissions !== undefined) {
    params.set("permissions", PermissionsBitField.resolve(options.permissions).toString());
  }
  if (options.guildId !== undefined) params.set("guild_id", options.guildId);
  if (options.disableGuildSelect === true) params.set("disable_guild_select", "true");
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}
