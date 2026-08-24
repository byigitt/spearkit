import { GatewayIntentBits } from "discord.js";
import { describe, expect, it } from "vitest";
import { Intents, SpearClient } from "../src/client.js";
import { command } from "../src/commands/command.js";
import { button } from "../src/components/builders.js";
import { event } from "../src/events.js";
import { definePlugin } from "../src/plugin.js";
import { MemoryStore } from "../src/store.js";

function newClient(): SpearClient {
  return new SpearClient({ intents: Intents.default });
}

describe("Intents presets", () => {
  it("default contains exactly Guilds", () => {
    expect(Intents.default).toEqual([GatewayIntentBits.Guilds]);
  });
  it("all is a non-empty list of numeric intents", () => {
    expect(Intents.all.length).toBeGreaterThan(0);
    expect(Intents.all.every((v) => typeof v === "number")).toBe(true);
  });
});

describe("SpearClient.register", () => {
  it("routes each item to the matching registry", () => {
    const client = newClient();
    client.register(
      command({ name: "ping", description: "d", run: () => {} }),
      event("warn", () => {}),
      button({ id: "b", run: () => {} }),
    );
    expect(client.commands.size).toBe(1);
    expect(client.events.size).toBe(1);
    expect(client.components.size).toBe(1);
    client.destroy();
  });

  it("skips commands parked with enabled: false", () => {
    const client = newClient();
    client.register(
      command({ name: "live", description: "d", run: () => {} }),
      command({ name: "wip", description: "d", enabled: false, run: () => {} }),
    );
    expect(client.commands.size).toBe(1);
    expect(client.commands.get("live")).toBeDefined();
    client.destroy();
  });
});

describe("SpearClient i18n", () => {
  it("builds a translator from inline options", () => {
    const client = new SpearClient({
      i18n: {
        defaultLocale: "en",
        messages: { en: { hello: "Hello" } },
      },
    });
    expect(client.i18n?.t("en", "hello")).toBe("Hello");
    client.destroy();
  });
});

describe("SpearClient cooldownStore", () => {
  it("shares last-hit timestamps through the client manager", async () => {
    const store = new MemoryStore();
    const client = new SpearClient({ cooldownStore: store, cooldown: 1_000 });
    const actor = { userId: "1", roleIds: [], guildId: null, channelId: null };
    expect((await client.cooldowns.consume("x", 1_000, actor, 0)).allowed).toBe(true);
    expect((await client.cooldowns.consume("x", 1_000, actor, 10)).allowed).toBe(false);
    client.destroy();
  });
});

describe("SpearClient.use", () => {
  it("runs plugin setup", async () => {
    const client = newClient();
    let installed = false;
    const plugin = definePlugin({
      name: "test",
      setup(c) {
        installed = true;
        c.register(command({ name: "x", description: "d", run: () => {} }));
      },
    });
    await client.use(plugin);
    expect(installed).toBe(true);
    expect(client.commands.size).toBe(1);
    client.destroy();
  });
});

describe("SpearClient.deployCommands", () => {
  it("throws before the client is ready", async () => {
    const client = newClient();
    await expect(client.deployCommands()).rejects.toThrow(/after the client is ready/);
    client.destroy();
  });
});
