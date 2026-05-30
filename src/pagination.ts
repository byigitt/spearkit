/**
 * Paginated embed replies driven by buttons.
 *
 * Real bots reimplement the same {page state, prev/next buttons, user-only
 * filter, disable-on-timeout} dance per command. {@link paginate} handles it:
 * pass an item list and a render function, and you get an interactive,
 * timeout-aware paginator in one call. {@link buildPaginatorPage} exposes the
 * same logic without the collector, for tests or custom flows.
 */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  type BaseMessageOptions,
  type ButtonInteraction,
  type EmbedBuilder,
  type RepliableInteraction,
} from "discord.js";

/** Result of {@link PaginateOptions.render}: a builder OR a full message payload. */
export type PaginateRender =
  | EmbedBuilder
  | readonly EmbedBuilder[]
  | BaseMessageOptions;

/** Options for {@link paginate} / {@link buildPaginatorPage}. */
export interface PaginateOptions<T> {
  /** Items per page. Default `10`. */
  pageSize?: number;
  /** Build the body for one page. */
  render: (
    slice: readonly T[],
    state: { page: number; pages: number },
  ) => PaginateRender | Promise<PaginateRender>;
  /** When set, only this user id can click. Defaults to the invoker. */
  user?: string;
  /** Time (ms) before buttons are disabled. Default `5 * 60_000`. */
  timeoutMs?: number;
  /** Custom-id prefix to avoid clashes with other components. Default `"spk-page"`. */
  namespace?: string;
  /** Make the initial reply ephemeral. Default `false`. */
  ephemeral?: boolean;
  /** Button labels. Defaults: `‹` Prev / `›` Next / `«` First / `»` Last. */
  labels?: {
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
  };
  /** Which buttons to show. Default `"prev-next"`. */
  controls?: "prev-next" | "first-prev-next-last";
}

function normalisePayload(render: PaginateRender): BaseMessageOptions {
  if (
    typeof (render as EmbedBuilder).setColor === "function" &&
    typeof (render as EmbedBuilder).toJSON === "function"
  ) {
    return { embeds: [render as EmbedBuilder] };
  }
  if (Array.isArray(render)) {
    return { embeds: render as EmbedBuilder[] };
  }
  return render as BaseMessageOptions;
}

function controlsRow(
  page: number,
  pages: number,
  ns: string,
  controls: "prev-next" | "first-prev-next-last",
  labels: Required<NonNullable<PaginateOptions<unknown>["labels"]>>,
): ActionRowBuilder<ButtonBuilder> {
  const buttons: ButtonBuilder[] = [];
  if (controls === "first-prev-next-last") {
    buttons.push(
      new ButtonBuilder()
        .setCustomId(`${ns}:first`)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(labels.first)
        .setDisabled(page === 0),
    );
  }
  buttons.push(
    new ButtonBuilder()
      .setCustomId(`${ns}:prev`)
      .setStyle(ButtonStyle.Primary)
      .setLabel(labels.prev)
      .setDisabled(page === 0),
    new ButtonBuilder()
      .setCustomId(`${ns}:next`)
      .setStyle(ButtonStyle.Primary)
      .setLabel(labels.next)
      .setDisabled(page >= pages - 1),
  );
  if (controls === "first-prev-next-last") {
    buttons.push(
      new ButtonBuilder()
        .setCustomId(`${ns}:last`)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(labels.last)
        .setDisabled(page >= pages - 1),
    );
  }
  return new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons);
}

function resolveLabels(input: PaginateOptions<unknown>["labels"]): Required<NonNullable<PaginateOptions<unknown>["labels"]>> {
  return {
    first: input?.first ?? "«",
    prev: input?.prev ?? "‹",
    next: input?.next ?? "›",
    last: input?.last ?? "»",
  };
}

/**
 * Build the payload for a single paginator page (embeds + button row), without
 * any interaction or collector wiring. Useful for tests, web previews and
 * custom UIs that want spearkit's slicing/controls but their own send path.
 */
export async function buildPaginatorPage<T>(
  items: readonly T[],
  page: number,
  options: PaginateOptions<T>,
): Promise<{ payload: BaseMessageOptions; pages: number }> {
  const pageSize = options.pageSize ?? 10;
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const ns = options.namespace ?? "spk-page";
  const controls = options.controls ?? "prev-next";
  const labels = resolveLabels(options.labels);
  const slice = items.slice(page * pageSize, page * pageSize + pageSize);
  const body = await options.render(slice, { page, pages });
  const payload = normalisePayload(body);
  const components = pages > 1 ? [controlsRow(page, pages, ns, controls, labels)] : [];
  return { payload: { ...payload, components }, pages };
}

/**
 * Send an item list across paginated, button-controlled embeds.
 *
 * The first page is replied to {@link interaction} (or `editReply`d when
 * already deferred), then a button-component collector handles prev/next
 * clicks until the timeout fires — at which point the buttons are disabled.
 */
export async function paginate<T>(
  interaction: RepliableInteraction,
  items: readonly T[],
  options: PaginateOptions<T>,
): Promise<void> {
  const pageSize = options.pageSize ?? 10;
  const ns = options.namespace ?? "spk-page";
  const controls = options.controls ?? "prev-next";
  const labels = resolveLabels(options.labels);
  const allowedUser = options.user ?? interaction.user.id;
  let page = 0;

  const buildPage = async (): Promise<{ payload: BaseMessageOptions; pages: number }> => {
    return buildPaginatorPage(items, page, { ...options, pageSize, namespace: ns, controls, labels });
  };

  const { payload: initial, pages } = await buildPage();
  const sent = interaction.deferred
    ? await interaction.editReply(initial)
    : (await interaction.reply({
        ...initial,
        flags: options.ephemeral === true ? 64 : undefined,
      } as never),
      await interaction.fetchReply());

  if (pages <= 1) return;

  const collector = sent.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: options.timeoutMs ?? 5 * 60_000,
    filter: (i: ButtonInteraction) => i.user.id === allowedUser && i.customId.startsWith(`${ns}:`),
  });

  collector.on("collect", async (button) => {
    const action = button.customId.slice(ns.length + 1);
    if (action === "first") page = 0;
    else if (action === "prev") page = Math.max(0, page - 1);
    else if (action === "next") page = Math.min(pages - 1, page + 1);
    else if (action === "last") page = pages - 1;
    const next = await buildPage();
    await button.update(next.payload).catch(() => undefined);
  });

  collector.on("end", async () => {
    const disabledRow = controlsRow(page, pages, ns, controls, labels);
    for (const c of disabledRow.components) c.setDisabled(true);
    const { payload: final } = await buildPage();
    await interaction.editReply({ ...final, components: [disabledRow] }).catch(() => undefined);
  });
}
