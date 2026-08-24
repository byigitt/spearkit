/**
 * Automatic `/help` generated from the client's live command registries.
 */
import { EmbedBuilder } from "discord.js";
import { command, type SlashCommand } from "./commands/command.js";
import type { CommandContext } from "./commands/context.js";
import type { SpearClient } from "./client.js";
import { paginate } from "./pagination.js";

export type HelpSurface = "slash" | "prefix" | "userMenu" | "messageMenu";

/** One command shown by the generated help command. */
export interface HelpEntry {
  name: string;
  description: string;
  surface: HelpSurface;
}

/** Options for {@link helpCommand}. */
export interface HelpCommandOptions {
  /** Slash command name. Default: `"help"`. */
  name?: string;
  /** Discord command description. */
  description?: string;
  /** Embed title. Default: `"Commands"`. */
  title?: string;
  /** Entries per page. Default: 10. */
  pageSize?: number;
  /** Include prefix commands. Default: true. */
  includePrefix?: boolean;
  /** Include user/message context menus. Default: true. */
  includeContextMenus?: boolean;
  /** Make help visible only to the invoker. Default: true. */
  ephemeral?: boolean;
  /** Filter or reorder entries before rendering. */
  transform?: (
    entries: readonly HelpEntry[],
    ctx: CommandContext,
  ) => readonly HelpEntry[] | Promise<readonly HelpEntry[]>;
}

/** Collect command metadata from a client without sending anything. */
export function buildHelpEntries(
  client: Pick<SpearClient, "commands" | "prefix" | "contextMenus">,
  options: Pick<
    HelpCommandOptions,
    "includePrefix" | "includeContextMenus"
  > & { exclude?: string } = {},
): HelpEntry[] {
  const entries: HelpEntry[] = client.commands
    .all()
    .filter((item) => item.name !== options.exclude)
    .map((item) => ({
      name: item.name,
      description: item.toJSON().description,
      surface: "slash" as const,
    }));

  if (options.includePrefix !== false) {
    entries.push(
      ...client.prefix
        .list()
        .filter((item) => item.name !== options.exclude)
        .map((item) => ({
          name: item.name,
          description: item.description ?? "Text command",
          surface: "prefix" as const,
        })),
    );
  }

  if (options.includeContextMenus !== false) {
    entries.push(
      ...client.contextMenus
        .all()
        .filter((item) => item.name !== options.exclude)
        .map((item) => ({
          name: item.name,
          description:
            item.kind === "userMenu"
              ? "User context-menu command"
              : "Message context-menu command",
          surface: item.kind,
        })),
    );
  }

  return entries.sort(
    (a, b) => a.name.localeCompare(b.name) || a.surface.localeCompare(b.surface),
  );
}

function label(entry: HelpEntry): string {
  switch (entry.surface) {
    case "slash":
      return `/${entry.name}`;
    case "prefix":
      return `text: ${entry.name}`;
    case "userMenu":
      return `user menu: ${entry.name}`;
    case "messageMenu":
      return `message menu: ${entry.name}`;
  }
}

/** Define a paginated `/help` command backed by the live registries. */
export function helpCommand(options: HelpCommandOptions = {}): SlashCommand {
  const name = options.name ?? "help";
  return command({
    name,
    description: options.description ?? "List available commands",
    run: async (ctx) => {
      const client = ctx.client as SpearClient;
      let entries: readonly HelpEntry[] = buildHelpEntries(client, {
        exclude: name,
        includePrefix: options.includePrefix,
        includeContextMenus: options.includeContextMenus,
      });
      if (options.transform !== undefined) {
        entries = await options.transform(entries, ctx);
      }

      await paginate(ctx.interaction, entries, {
        pageSize: options.pageSize ?? 10,
        ephemeral: options.ephemeral ?? true,
        namespace: `spk-help-${ctx.interaction.id}`,
        render: (slice, state) =>
          new EmbedBuilder()
            .setColor(client.embeds.colors.info)
            .setTitle(options.title ?? "Commands")
            .setDescription(
              slice.length === 0
                ? "No commands available."
                : slice
                    .map(
                      (entry) =>
                        `**${label(entry)}** — ${entry.description}`,
                    )
                    .join("\n"),
            )
            .setFooter({ text: `Page ${state.page + 1}/${state.pages}` }),
      });
    },
  });
}
