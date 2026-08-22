/**
 * Command scope — user-installable apps and interaction contexts.
 *
 * Two orthogonal axes from the Discord application-command surface:
 * - `install` → `integration_types`: where the app is installed
 *   (guild install vs. per-user install).
 * - `contexts` → `contexts`: where a command may run (guild, bot DM,
 *   private channels). Private channels are only reachable with a user
 *   install.
 *
 * The legacy `guildOnly: true` flag keeps working as an alias for
 * `contexts: ["guild"]`; combining it with an explicit `contexts` list throws.
 */
import {
  ApplicationIntegrationType,
  InteractionContextType,
} from "discord.js";

/** Installation targets accepted by `install`. */
export type InstallKind = "guild" | "user";

/** Runtime contexts accepted by `contexts`. */
export type ContextKind = "guild" | "botDm" | "privateChannel";

const CONTEXT_MAP: Record<ContextKind, InteractionContextType> = {
  guild: InteractionContextType.Guild,
  botDm: InteractionContextType.BotDM,
  privateChannel: InteractionContextType.PrivateChannel,
};

/** Scope metadata shared by slash commands and context menus. */
export interface CommandScopeMeta {
  /** Restrict invocation to guilds (alias for `contexts: ["guild"]`). */
  guildOnly?: boolean;
  /** App installation targets; omit for Discord's default (guild install). */
  install?: readonly InstallKind[];
  /** Where the command may run; omit to inherit the installation default. */
  contexts?: readonly ContextKind[];
}

/** Resolved REST payload fragments for {@link CommandScopeMeta}. */
export interface ResolvedCommandScope {
  integration_types?: ApplicationIntegrationType[];
  contexts?: InteractionContextType[];
}

/**
 * Resolve scope metadata into its REST payload form. Throws when
 * `guildOnly` conflicts with an explicit `contexts` list.
 */
export function resolveCommandScope(meta: CommandScopeMeta): ResolvedCommandScope {
  if (meta.guildOnly === true && meta.contexts !== undefined) {
    throw new Error(
      "spearkit: guildOnly and contexts are mutually exclusive — pass one of them",
    );
  }

  let contexts: InteractionContextType[] | undefined;
  if (meta.guildOnly === true) {
    contexts = [InteractionContextType.Guild];
  } else if (meta.contexts !== undefined) {
    contexts = meta.contexts.map((kind) => CONTEXT_MAP[kind]);
  }

  const integrationTypes = meta.install?.map((kind) =>
    kind === "user"
      ? ApplicationIntegrationType.UserInstall
      : ApplicationIntegrationType.GuildInstall,
  );

  return {
    integration_types:
      integrationTypes !== undefined && integrationTypes.length > 0 ? integrationTypes : undefined,
    contexts: contexts !== undefined && contexts.length > 0 ? contexts : undefined,
  };
}
