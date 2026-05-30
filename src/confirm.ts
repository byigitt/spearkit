/**
 * Yes/no confirmation prompts: a one-line API for the "are you sure?" flow
 * that bots reimplement every time (saniye-rewrite ships a reaction-based one
 * in commands/prefix/admin/rolereset.ts that this replaces).
 *
 * @example
 * ```ts
 * const ok = await confirm(interaction, {
 *   body: `Reset **${role.name}** for **${members}** members?`,
 *   confirm: { label: "Reset", style: "Danger" },
 *   cancel:  { label: "Cancel" },
 *   timeoutMs: 30_000,
 * });
 * if (!ok.confirmed) return ctx.error("Cancelled.");
 * ```
 */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  type ButtonInteraction,
  type RepliableInteraction,
} from "discord.js";
import { defaultEmbeds, type Embeds } from "./embeds.js";

/** Visual style for a confirm/cancel button. */
export type ConfirmButtonStyle = "Primary" | "Secondary" | "Success" | "Danger";

/** One of the two buttons. */
export interface ConfirmButtonOptions {
  /** Visible label. */
  label?: string;
  /** Visual style. */
  style?: ConfirmButtonStyle;
}

/** Options for {@link confirm}. */
export interface ConfirmOptions {
  /** Embed title. */
  title?: string;
  /** Embed body. */
  body: string;
  /** Confirm button config. Defaults: label `"Confirm"`, style `"Success"`. */
  confirm?: ConfirmButtonOptions;
  /** Cancel button config. Defaults: label `"Cancel"`, style `"Secondary"`. */
  cancel?: ConfirmButtonOptions;
  /** Only this user id can click. Defaults to the invoker. */
  user?: string;
  /** Time (ms) before the prompt times out as cancelled. Default `30_000`. */
  timeoutMs?: number;
  /** Make the prompt ephemeral. Default `true`. */
  ephemeral?: boolean;
  /** Custom-id prefix to avoid clashes. Default `"spk-confirm"`. */
  namespace?: string;
}

/** Result of {@link confirm}. */
export interface ConfirmResult {
  /** Whether the user confirmed (clicked the confirm button before timeout). */
  confirmed: boolean;
  /** How the prompt ended. */
  reason: "confirm" | "cancel" | "timeout";
  /** The triggering button interaction when `reason !== "timeout"`. */
  interaction?: ButtonInteraction;
}

const STYLE_MAP: Record<ConfirmButtonStyle, ButtonStyle> = {
  Primary: ButtonStyle.Primary,
  Secondary: ButtonStyle.Secondary,
  Success: ButtonStyle.Success,
  Danger: ButtonStyle.Danger,
};

function clientEmbeds(client: { embeds?: Embeds } | unknown): Embeds {
  return ((client as { embeds?: Embeds }).embeds) ?? defaultEmbeds;
}

/**
 * Show a yes/no confirmation prompt and wait for the user's choice.
 *
 * Resolves once a button is clicked or the timeout fires. The clicked button
 * is automatically acknowledged via `deferUpdate`, and the original message's
 * buttons are disabled. Returns `{ confirmed, reason, interaction? }`.
 */
export async function confirm(
  interaction: RepliableInteraction,
  options: ConfirmOptions,
): Promise<ConfirmResult> {
  const ns = options.namespace ?? "spk-confirm";
  const confirmLabel = options.confirm?.label ?? "Confirm";
  const cancelLabel = options.cancel?.label ?? "Cancel";
  const confirmStyle = STYLE_MAP[options.confirm?.style ?? "Success"];
  const cancelStyle = STYLE_MAP[options.cancel?.style ?? "Secondary"];
  const user = options.user ?? interaction.user.id;
  const ephemeral = options.ephemeral !== false; // default true

  const embeds = clientEmbeds(interaction.client);
  const promptEmbed = embeds.info(
    options.title !== undefined
      ? { title: options.title, description: options.body }
      : options.body,
  );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(`${ns}:yes`).setLabel(confirmLabel).setStyle(confirmStyle),
    new ButtonBuilder().setCustomId(`${ns}:no`).setLabel(cancelLabel).setStyle(cancelStyle),
  );

  const payload = { embeds: [promptEmbed], components: [row] };
  const sent = interaction.deferred
    ? await interaction.editReply(payload)
    : (await interaction.reply({
        ...payload,
        flags: ephemeral ? 64 : undefined,
      } as never),
      await interaction.fetchReply());

  return new Promise<ConfirmResult>((resolve) => {
    const collector = sent.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: options.timeoutMs ?? 30_000,
      max: 1,
      filter: (i: ButtonInteraction) => i.user.id === user && i.customId.startsWith(`${ns}:`),
    });

    let outcome: ConfirmResult | null = null;

    collector.on("collect", async (button) => {
      const action = button.customId.slice(ns.length + 1);
      outcome = {
        confirmed: action === "yes",
        reason: action === "yes" ? "confirm" : "cancel",
        interaction: button,
      };
      await button.deferUpdate().catch(() => undefined);
    });

    collector.on("end", async () => {
      // Disable both buttons regardless of outcome.
      for (const c of row.components) c.setDisabled(true);
      await interaction
        .editReply({ embeds: [promptEmbed], components: [row] })
        .catch(() => undefined);
      resolve(outcome ?? { confirmed: false, reason: "timeout" });
    });
  });
}
