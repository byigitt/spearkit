/**
 * Override the default embed colors and icons via the `embeds` client option,
 * then use the factory directly (e.g. when sending an embed from a non-context
 * code path).
 *
 *   DISCORD_TOKEN=... npx tsx examples/embeds/custom-factory.ts
 */
import { SpearClient, Intents, command } from "spearkit";

const client = new SpearClient({
  intents: Intents.default,
  embeds: {
    colors: { success: 0x00ff88, info: 0x9b59b6 },
    icons: { warn: "🟠", error: "" }, // drop the error icon
  },
});

client.register(
  command({
    name: "stats",
    description: "Show stats (uses the custom factory)",
    run: async (ctx) => {
      // Built via the factory and sent manually so you can compose with other
      // payload fields (components, attachments, etc.).
      const embed = (ctx.client as SpearClient).embeds.info({
        title: "Stats",
        description: "Demo of the custom factory",
        fields: [
          { name: "Guilds", value: String(ctx.client.guilds.cache.size), inline: true },
          { name: "Users", value: String(ctx.client.users.cache.size), inline: true },
        ],
      });
      await ctx.reply({ embeds: [embed] });
    },
  }),
);

async function main(): Promise<void> {
  await client.start();
  await client.deployAllCommands({ guildId: process.env.GUILD_ID });
}

void main();
