import { EmbedBuilder } from "discord.js";
import { describe, expect, it } from "vitest";
import { buildPaginatorPage } from "../src/pagination.js";

describe("buildPaginatorPage", () => {
  it("slices items by pageSize and exposes pages count", async () => {
    const items = Array.from({ length: 23 }, (_, i) => i);
    const { payload, pages } = await buildPaginatorPage(items, 0, {
      pageSize: 10,
      render: (slice, { page }) =>
        new EmbedBuilder().setTitle(`page ${page}`).setDescription(slice.join(",")),
    });
    expect(pages).toBe(3);
    expect((payload.embeds?.[0] as EmbedBuilder | undefined)?.toJSON().description).toBe("0,1,2,3,4,5,6,7,8,9");
    expect(payload.components).toHaveLength(1);
  });

  it("middle page enables both prev and next, end page disables next", async () => {
    const items = [1, 2, 3];
    const middle = await buildPaginatorPage(items, 1, {
      pageSize: 1,
      render: () => new EmbedBuilder(),
    });
    const row = middle.payload.components?.[0] as unknown as { components: { data: { disabled?: boolean; custom_id?: string } }[] };
    const idMap = new Map(row.components.map((c) => [c.data.custom_id, c.data.disabled === true] as const));
    expect(idMap.get("spk-page:prev")).toBe(false);
    expect(idMap.get("spk-page:next")).toBe(false);

    const last = await buildPaginatorPage(items, 2, {
      pageSize: 1,
      render: () => new EmbedBuilder(),
    });
    const row2 = last.payload.components?.[0] as unknown as { components: { data: { disabled?: boolean; custom_id?: string } }[] };
    const idMap2 = new Map(row2.components.map((c) => [c.data.custom_id, c.data.disabled === true] as const));
    expect(idMap2.get("spk-page:next")).toBe(true);
  });

  it("first-prev-next-last controls produce 4 buttons", async () => {
    const items = [0, 1, 2, 3, 4];
    const { payload } = await buildPaginatorPage(items, 0, {
      pageSize: 1,
      controls: "first-prev-next-last",
      render: () => new EmbedBuilder(),
    });
    const row = payload.components?.[0] as unknown as { components: unknown[] };
    expect(row.components).toHaveLength(4);
  });

  it("omits controls when there is exactly one page", async () => {
    const items = [1];
    const { payload, pages } = await buildPaginatorPage(items, 0, {
      pageSize: 10,
      render: () => new EmbedBuilder(),
    });
    expect(pages).toBe(1);
    expect(payload.components).toEqual([]);
  });

  it("custom namespace appears in every button custom-id", async () => {
    const items = [1, 2, 3];
    const { payload } = await buildPaginatorPage(items, 0, {
      pageSize: 1,
      namespace: "mod-list",
      render: () => new EmbedBuilder(),
    });
    const row = payload.components?.[0] as unknown as { components: { data: { custom_id?: string } }[] };
    expect(row.components.every((c) => (c.data.custom_id ?? "").startsWith("mod-list:"))).toBe(true);
  });

  it("renders a custom message payload (embeds + content) through", async () => {
    const items = [1, 2];
    const { payload } = await buildPaginatorPage(items, 0, {
      pageSize: 10,
      render: () => ({ content: "header", embeds: [new EmbedBuilder().setTitle("e")] }),
    });
    expect(payload.content).toBe("header");
    expect((payload.embeds?.[0] as EmbedBuilder | undefined)?.toJSON().title).toBe("e");
  });
});
